import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./style.css";
import http from "../../services/http.js";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { criarAgendamento, verificarDisponibilidade } from "../../api/agendamento/agendamento.js";
import logoSemFundo from "../../assets/icons/logo_semfundo.png";

/* ---------- utils ---------- */
function MonthLabel({ date }) {
  const fmt = useMemo(
    () => new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }),
    []
  );
  return <h2 className="agd-month">{fmt.format(date)}</h2>;
}

/** Semana começando na SEGUNDA */
const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/** Monta os dias do mês com padding para semana ISO (Seg=0 … Dom=6) */
function buildMonthDays(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  // getDay(): Dom=0..Sáb=6 -> ISO: Seg=0..Dom=6
  const startWeekdayISO = (firstDay.getDay() + 6) % 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < startWeekdayISO; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
  return days;
}

function toHM(date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
function parseTimeOn(dateBase, timeStr) {
  if (!timeStr || typeof timeStr !== "string") return null;
  const [hh, mm] = timeStr.split(":");
  const d = new Date(dateBase);
  d.setHours(Number(hh || 0), Number(mm || 0), 0, 0);
  return d;
}

/* ===== helpers de data ===== */
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function isSameDay(a, b) {
  return a && b && a.toDateString() === b.toDateString();
}
function isPastCalendarDay(d) {
  if (!d) return false;
  const today0 = startOfDay(new Date());
  return startOfDay(d) < today0;
}

async function cepToEndereco(cep) {
  try {
    const clean = String(cep || "").replace(/\D/g, "");
    if (clean.length !== 8) return null;
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
    const data = await res.json();
    if (data?.erro) return null;
    const logradouro = [data.logradouro, data.bairro].filter(Boolean).join(" - ");
    const cidadeUf = [data.localidade, data.uf].filter(Boolean).join("/");
    const texto = [logradouro, cidadeUf].filter(Boolean).join(", ");
    return texto || null;
  } catch {
    return null;
  }
}

/* =================================================================== */

export default function Agendamento() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  const [hospitais, setHospitais] = useState([]);
  const [loadingHosp, setLoadingHosp] = useState(true);
  const [errorHosp, setErrorHosp] = useState("");

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [times, setTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  
  // Estados para salvamento na API
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [errorConfirm, setErrorConfirm] = useState("");

  // carrossel
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  /* ---------- verificar autenticação ---------- */
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
  }, [isLoggedIn, navigate]);

  /* ---------- carregar hospitais ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingHosp(true);
      setErrorHosp("");
      try {
        const res = await http.get("/hospital");
        const data = res?.data;
        const list =
          (Array.isArray(data) && data) ||
          data?.hospitais ||
          data?.dados ||
          data?.data ||
          [];

        if (!Array.isArray(list)) {
          throw new Error("Formato inesperado da resposta da API /hospital");
        }

        const enriched = await Promise.all(
          list.map(async (h) => {
            const endereco = await cepToEndereco(h?.cep);
            return {
              ...h,
              _enderecoViaCep: endereco || (h?.cep ? `CEP: ${h.cep}` : "Endereço não disponível"),
            };
          })
        );

        if (!mounted) return;
        setHospitais(enriched);
        setSelectedHospital(enriched[0] || null);
      } catch (e) {
        console.error("[Agendamento] Falha ao carregar /hospital:", e);
        if (!mounted) return;
        const status = e?.response?.status;
        const net = e?.code === "ERR_NETWORK" ? " Verifique se a API está rodando e o CORS." : "";
        setErrorHosp(`Não foi possível carregar os hospitais${status ? ` (HTTP ${status})` : ""}.${net}`);
      } finally {
        if (mounted) setLoadingHosp(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------- setas do carrossel ---------- */
  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    const id = setTimeout(updateArrows, 0);
    return () => clearTimeout(id);
  }, [hospitais, updateArrows]);

  const scrollByAmount = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };
  const handleScroll = () => updateArrows();

  /* ---------- horários pelo hospital ---------- */
  useEffect(() => {
    if (!selectedHospital || !selectedDate) return;

    setLoadingTimes(true);
    setSelectedTime("");

    // BLOQUEIO: não gerar horários para datas passadas
    if (isPastCalendarDay(selectedDate)) {
      setTimes([]);
      setLoadingTimes(false);
      return;
    }

    const ha = selectedHospital?.horario_abertura || selectedHospital?.horarioAbertura || "08:00:00";
    const hf = selectedHospital?.horario_fechamento || selectedHospital?.horarioFechamento || "18:00:00";
    const stepMin = 60;

    const open = parseTimeOn(selectedDate, ha);
    const close = parseTimeOn(selectedDate, hf);

    let out = [];
    if (open && close) {
      const cur = new Date(open);
      while (cur < close) {
        out.push(toHM(cur));
        cur.setMinutes(cur.getMinutes() + stepMin);
      }
    }
    if (out.length === 0) out = ["09:00", "10:00", "11:00", "19:00"];

    setTimes(out);
    setLoadingTimes(false);
  }, [selectedHospital, selectedDate]);

  /* ---------- navegação de mês ---------- */
  const days = useMemo(() => buildMonthDays(viewDate), [viewDate]);
  function prevMonth() {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() - 1);
    setViewDate(d);
  }
  function nextMonth() {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + 1);
    setViewDate(d);
  }

  /* ---------- confirmar ---------- */
  async function confirm() {
    // Validações básicas
    if (!selectedHospital) return alert("Selecione um hospital.");
    if (!selectedDate) return alert("Selecione uma data.");
    if (isPastCalendarDay(selectedDate)) {
      return alert("A data selecionada já passou. Escolha outra data.");
    }
    if (!selectedTime) return alert("Selecione um horário.");
    if (!user?.id) {
      return alert("Usuário não identificado. Faça login novamente.");
    }

    setLoadingConfirm(true);
    setErrorConfirm("");

    try {
      // Preparar dados para a API
      const dataAgendamento = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const horaAgendamento = selectedTime + ":00"; // HH:MM:SS
      
      const dadosAgendamento = {
        id_usuario: user.id,
        id_hospital: selectedHospital.id,
        data: dataAgendamento,
        hora: horaAgendamento,
        status: 'Agendado'
      };

      // Salvar na API
      const resultado = await criarAgendamento(dadosAgendamento);
      
      if (resultado.success) {
        // Preparar payload para o protocolo (mantendo compatibilidade)
        const dataISO = selectedDate?.toISOString();
        const payload = {
          agendamento_id: resultado.data?.id, // ID do agendamento criado
          hospital: {
            id: selectedHospital.id ?? null,
            nome: selectedHospital.nome || selectedHospital.nomeHospital,
            cep: selectedHospital.cep || null,
            endereco: selectedHospital._enderecoViaCep || null,
            fotoUrl: selectedHospital.fotoUrl || selectedHospital.foto || null,
          },
          data: dataISO,
          horario: selectedTime,
        };

        // Salvar no localStorage como backup
        try {
          localStorage.setItem("ultimo_agendamento", JSON.stringify(payload));
        } catch (e) {
          console.warn("Não foi possível persistir ultimo_agendamento:", e);
        }

        // Navegar para o protocolo
        navigate("/protocolo-agendamento", { state: payload });
      } else {
        setErrorConfirm(resultado.message || 'Erro ao criar agendamento');
      }
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      setErrorConfirm('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setLoadingConfirm(false);
    }
  }

  const today = new Date();

  const handleVoltar = () => {
    navigate("/home");
  };

  return (
    <>
      {/* ====== CABEÇALHO IGUAL AO BANCO DE SANGUE ====== */}
      <header className="banco-header-premium">
        <div className="header-bg-banco"></div>
        <div className="header-content-banco">
          <div className="header-left-banco">
            <button className="btn-voltar-banco" onClick={handleVoltar} aria-label="Voltar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="header-brand-banco">
              <div className="brand-logo-container-banco">
                <img src={logoSemFundo} alt="DoeVida" className="header-logo-banco" />
                <div className="logo-glow-banco"></div>
              </div>
              <h1 className="brand-title-banco">Agendamento</h1>
            </div>
          </div>

          {/* (Opcional) espaço à direita para manter o mesmo respiro do layout */}
          <div className="header-stats-banco" aria-hidden="true" />
        </div>
      </header>

      {/* ====== CONTEÚDO DA PÁGINA ====== */}
      <div className="agd-container">
        <h1 className="agd-title">Agendar Doação</h1>

        {/* HOSPITAIS - CARROSSEL */}
        <section className="agd-section">
          <div className="agd-section-header">
            <h3>Local</h3>
            <span className="agd-help">Selecione o hospital</span>
          </div>

          {loadingHosp ? (
            <div className="agd-skeleton-row" />
          ) : errorHosp ? (
            <div className="agd-error">{errorHosp}</div>
          ) : hospitais.length === 0 ? (
            <div className="agd-error">Nenhum hospital cadastrado.</div>
          ) : (
            <div className="agd-carousel">
              <button
                type="button"
                className="agd-carousel-nav agd-carousel-prev"
                onClick={() => scrollByAmount(-1)}
                disabled={!canPrev}
                aria-label="Anterior"
              >
                ‹
              </button>

              <div
                className="agd-hosp-track"
                ref={trackRef}
                onScroll={handleScroll}
              >
                {hospitais.map((h) => {
                  const nome = h?.nome || h?.nomeHospital || "Hospital";
                  const foto = h?.fotoUrl || h?.foto || null;
                  const endereco = h?._enderecoViaCep || "Endereço não disponível";
                  const ativo = selectedHospital?.id
                    ? selectedHospital.id === h.id
                    : (selectedHospital?.nome || selectedHospital?.nomeHospital) === nome;

                  return (
                    <button
                      key={h.id ?? nome}
                      type="button"
                      className={"agd-hosp-card agd-hosp-card--slide" + (ativo ? " is-active" : "")}
                      onClick={() => setSelectedHospital(h)}
                      title={nome}
                    >
                      <div
                        className={"agd-thumb " + (!foto ? "agd-thumb--placeholder" : "")}
                        style={foto ? { backgroundImage: `url(${foto})` } : {}}
                      />
                      <div className="agd-hosp-meta">
                        <div className="agd-hosp-name" title={nome}>{nome}</div>
                        <div className="agd-hosp-addr">{endereco}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="agd-carousel-nav agd-carousel-next"
                onClick={() => scrollByAmount(1)}
                disabled={!canNext}
                aria-label="Próximo"
              >
                ›
              </button>
            </div>
          )}
        </section>

        {/* CALENDÁRIO */}
        <section className="agd-section">
          <h3 className="agd-subtitle">Data</h3>
          <div className="agd-calendar agd-calendar--wide">
            <div className="agd-cal-header">
              <button className="agd-nav" onClick={prevMonth} aria-label="Mês anterior">‹</button>
              <MonthLabel date={viewDate} />
              <button className="agd-nav" onClick={nextMonth} aria-label="Próximo mês">›</button>
            </div>

            <div className="agd-week">
              {weekDays.map((d) => (
                <div key={d} className="agd-weekday">{d}</div>
              ))}
            </div>

            <div className="agd-grid agd-grid--lg">
              {days.map((d, idx) => {
                if (!d) return <div key={idx} className="agd-day empty" />;
                const isToday = isSameDay(d, today);
                const dayIsPast = isPastCalendarDay(d);
                const isSelected = selectedDate && isSameDay(selectedDate, d);

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`agd-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""} ${dayIsPast ? "past" : ""}`}
                    onClick={() => {
                      if (!dayIsPast) setSelectedDate(d); // bloqueia datas passadas
                    }}
                    disabled={dayIsPast}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* HORÁRIOS */}
        <section className="agd-section">
          <div className="agd-times-header">
            <h4>Horários {selectedHospital ? `· ${selectedHospital.nome || selectedHospital.nomeHospital}` : ""}</h4>
            {loadingTimes && <span className="agd-chip">carregando...</span>}
          </div>

          {selectedDate && isPastCalendarDay(selectedDate) ? (
            <div className="agd-error" style={{ maxWidth: 820 }}>
              A data selecionada já passou. Selecione outra data para visualizar horários disponíveis.
            </div>
          ) : loadingTimes ? (
            <div className="agd-times-skeleton" />
          ) : (
            <div className="agd-times">
              {times.map((t) => {
                const isTodaySel = selectedDate && isSameDay(selectedDate, today);
                let disabled = false;
                if (isTodaySel) {
                  const [hh, mm] = t.split(":").map(Number);
                  const now = new Date();
                  const slot = new Date();
                  slot.setHours(hh, mm, 0, 0);
                  disabled = slot <= now;
                }
                return (
                  <button
                    type="button"
                    key={t}
                    disabled={disabled}
                    className={"agd-time " + (selectedTime === t ? "is-selected" : "")}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* CTA */}
        <div className="agd-cta">
          {errorConfirm && (
            <div className="agd-error" style={{ marginBottom: '16px', maxWidth: '820px' }}>
              {errorConfirm}
            </div>
          )}
          <button 
            className="agd-confirm" 
            type="button" 
            onClick={confirm}
            disabled={loadingConfirm}
          >
            {loadingConfirm ? 'Salvando Agendamento...' : 'Confirmar Agendamento'}
          </button>
        </div>
      </div>
    </>
  );
}
