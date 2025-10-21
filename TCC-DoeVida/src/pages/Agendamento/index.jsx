import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./style.css";
import http from "../../services/http.js";
import { useNavigate } from "react-router-dom";

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
  const [hospitais, setHospitais] = useState([]);
  const [loadingHosp, setLoadingHosp] = useState(true);
  const [errorHosp, setErrorHosp] = useState("");

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [times, setTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  // carrossel
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

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
  function confirm() {
    if (!selectedHospital) return alert("Selecione um hospital.");
    if (!selectedDate) return alert("Selecione uma data.");
    if (!selectedTime) return alert("Selecione um horário.");
    navigate("/protocolo-agendamento", {
      state: {
        hospital: selectedHospital,
        data: selectedDate?.toISOString(),
        horario: selectedTime,
      },
    });
  }

  return (
    <div className="agd-container">
      <h1 className="agd-title">Agendar Doação</h1>
      {/* <p className="agd-sublead">
        Escolha um hospital próximo, selecione uma data e horário — rapidinho você agenda sua doação. ❤️
      </p> */}

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
              const isToday = new Date().toDateString() === d.toDateString();
              const isSelected = selectedDate && selectedDate.toDateString() === d.toDateString();
              return (
                <button
                  key={idx}
                  className={`agd-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                  onClick={() => setSelectedDate(d)}
                  type="button"
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

        {loadingTimes ? (
          <div className="agd-times-skeleton" />
        ) : (
          <div className="agd-times">
            {times.map((t) => {
              const isToday = selectedDate && selectedDate.toDateString() === new Date().toDateString();
              let disabled = false;
              if (isToday) {
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
        <button className="agd-confirm" type="button" onClick={confirm}>
          Confirmar Agendamento
        </button>
      </div>
    </div>
  );
}
