import { useEffect, useMemo, useState } from "react";
import "./style.css";
import AuthService from "../../services/auth.js";
import http from "../../services/http.js";
import { useNavigate } from "react-router-dom";

function MonthLabel({ date }) {
  const fmt = useMemo(() => new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }), []);
  return <h2 className="agd-month">{fmt.format(date)}</h2>;
}

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

function buildMonthDays(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < startWeekday; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
  return days;
}

export default function Agendamento() {
  const navigate = useNavigate();
  const [hospitais, setHospitais] = useState([]);
  const [loadingHosp, setLoadingHosp] = useState(true);
  const [errorHosp, setErrorHosp] = useState("");

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [times, setTimes] = useState(["09:00", "10:00", "11:00", "19:00"]);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    if (!AuthService.isLoggedIn()) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoadingHosp(true);
      setErrorHosp("");
      try {
        // Ajuste a URL conforme sua API. Esperado: [{id,nome,endereco,fotoUrl}]
        const res = await http.get("/hospitais");
        const list = res?.data?.hospitais || res?.data || [];
        if (!mounted) return;
        setHospitais(Array.isArray(list) ? list : []);
        setSelectedHospital((Array.isArray(list) && list[0]) || null);
      } catch (e) {
        if (!mounted) return;
        setErrorHosp("Não foi possível carregar os hospitais.");
      } finally {
        if (mounted) setLoadingHosp(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const days = useMemo(() => buildMonthDays(viewDate), [viewDate]);

  // Gera horários a partir do horário de abertura/fechamento do hospital
  useEffect(() => {
    function toHM(date) {
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    }

    function parseTime(t) {
      // aceita "08:00:00" ou "08:00"
      if (!t || typeof t !== "string") return null;
      const [hh, mm] = t.split(":");
      const d = new Date(selectedDate);
      d.setHours(Number(hh || 0), Number(mm || 0), 0, 0);
      return d;
    }

    function buildSlots(h, date) {
      // por padrão, intervalo de 60 minutos; ajuste se necessário
      const stepMin = 60;
      const open = parseTime(h?.horario_abertura || h?.horarioAbertura || "08:00:00");
      const close = parseTime(h?.horario_fechamento || h?.horarioFechamento || "18:00:00");
      if (!open || !close) return ["09:00", "10:00", "11:00", "19:00"];
      const out = [];
      const cur = new Date(open);
      while (cur < close) {
        out.push(toHM(cur));
        cur.setMinutes(cur.getMinutes() + stepMin);
      }
      return out;
    }

    if (!selectedHospital || !selectedDate) return;
    setLoadingTimes(true);
    setSelectedTime("");

    const generated = buildSlots(selectedHospital, selectedDate);
    setTimes(generated && generated.length ? generated : ["09:00", "10:00", "11:00", "19:00"]);
    setLoadingTimes(false);
  }, [selectedHospital, selectedDate]);

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

  function confirm() {
    if (!selectedHospital) return alert("Selecione um hospital.");
    if (!selectedDate) return alert("Selecione uma data.");
    if (!selectedTime) return alert("Selecione um horário.");

    // Poderia salvar via API aqui e depois navegar.
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

      <section className="agd-section">
        <div className="agd-section-header">
          <h3>Local</h3>
          <span className="agd-help">Selecione o local</span>
        </div>

        {loadingHosp ? (
          <div className="agd-skeleton-row" />
        ) : errorHosp ? (
          <div className="agd-error">{errorHosp}</div>
        ) : (
          <div className="agd-hosp-row">
            {hospitais.map((h) => (
              <button
                key={h.id ?? h.nome}
                type="button"
                className={
                  "agd-hosp-card" + (selectedHospital?.id === h.id || selectedHospital?.nome === h.nome ? " is-active" : "")
                }
                onClick={() => setSelectedHospital(h)}
              >
                <div className="agd-thumb" style={{
                  backgroundImage: `url(${h.fotoUrl || h.foto || h.imagem || "/placeholder-hospital.jpg"})`
                }} />
                <div className="agd-hosp-meta">
                  <div className="agd-hosp-name">{h.nome || "Hospital"}</div>
                  <div className="agd-hosp-addr">{h.complemento || h.cep || "Contato: " + (h.telefone || "não informado")}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="agd-section">
        <h3 className="agd-subtitle">Data</h3>
        <div className="agd-calendar">
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
          <div className="agd-grid">
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

      <section className="agd-section">
        <div className="agd-times-header">
          <h4>Horários {selectedHospital?.nome ? `· ${selectedHospital.nome}` : ""}</h4>
          {loadingTimes && <span className="agd-chip">carregando...</span>}
        </div>
        {loadingTimes ? (
          <div className="agd-times-skeleton" />
        ) : (
          <div className="agd-times">
            {times.map((t) => {
              // Desabilita horários passados se a data for hoje
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

      <div className="agd-cta">
        <button className="agd-confirm" type="button" onClick={confirm}>
          Confirmar Agendamento
        </button>
      </div>
    </div>
  );
}
