import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";

/** Formata data ISO + hora em pt-BR */
function usePtBrFormatters() {
  const fmtData = useMemo(
    () => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }),
    []
  );
  return { fmtData };
}

function getUsuarioAtual() {
  try {
    const raw = localStorage.getItem("usuario");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u && typeof u === "object" ? u : null;
  } catch {
    return null;
  }
}

/** Tenta obter o agendamento: 1) via state, 2) via localStorage */
function useAgendamentoFromStateOrStorage() {
  const { state } = useLocation();
  const [ag, setAg] = useState(() => state || null);

  useEffect(() => {
    if (state) return; // já veio por state
    try {
      const raw = localStorage.getItem("ultimo_agendamento");
      if (raw) {
        const parsed = JSON.parse(raw);
        setAg(parsed);
      }
    } catch {
      /* ignore */
    }
  }, [state]);

  return ag;
}

export default function Protocolo_agendamento() {
  const navigate = useNavigate();
  const { fmtData } = usePtBrFormatters();

  const usuario = getUsuarioAtual();
  const agendamento = useAgendamentoFromStateOrStorage();

  // Deriva campos de usuario de forma tolerante
  const nomeUsuario =
    usuario?.nome ||
    usuario?.nomeCompleto ||
    usuario?.fullName ||
    usuario?.firstName && usuario?.lastName ? `${usuario.firstName} ${usuario.lastName}` : "Usuário";

  const cpfUsuario =
    usuario?.cpf ||
    usuario?.documento ||
    usuario?.documentoCpf ||
    "";

  // Deriva campos do agendamento/hospital
  const hospitalNome = agendamento?.hospital?.nome || "Hospital";
  const hospitalEndereco =
    agendamento?.hospital?.endereco ||
    (agendamento?.hospital?.cep ? `CEP: ${agendamento.hospital.cep}` : "Endereço não disponível");

  const dataDoacao = agendamento?.data ? fmtData.format(new Date(agendamento.data)) : "";
  const horaDoacao = agendamento?.horario || "";

  // Se não há agendamento, oferece voltar
  if (!agendamento) {
    return (
      <div className="agendamento-container">
        <div className="agendamento-header">
          <h1>Protocolo de Agendamento</h1>
          <p>Não encontramos um agendamento recente.</p>
          <button
            className="confirm-btn"
            onClick={() => navigate("/agendamento")}
          >
            Ir para Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="agendamento-container">
      <div className="agendamento-header">
        <h1>Protocolo de Agendamento</h1>
        <p><strong>Nome:</strong> {nomeUsuario}</p>
        {cpfUsuario && <p><strong>CPF:</strong> {cpfUsuario}</p>}
        <p><strong>Data da doação:</strong> {dataDoacao} {horaDoacao && `às ${horaDoacao}`}</p>
        <p><strong>Local da doação:</strong> {hospitalNome}</p>
        <p><strong>Endereço:</strong> {hospitalEndereco}</p>
      </div>

      <div className="agendamento-body">
        <h2>Lembrete</h2>
        <p><strong>No dia da sua doação, não se esqueça de:</strong></p>
        <ul>
          <li>✅ Levar um documento oficial com foto (RG ou CNH).</li>
          <li>✅ Estar bem alimentado e hidratado (evite jejum, comidas gordurosas e álcool nas 12h anteriores).</li>
          <li>✅ Usar roupas confortáveis e fáceis de arregaçar a manga.</li>
        </ul>
        <p>
          Sua doação fará toda a diferença. Obrigado por esse gesto de amor e solidariedade!
        </p>
        <p className="alerta">
          Se não puder comparecer, avise com 24h de antecedência para
          reorganizarmos os atendimentos e ajudarmos mais pessoas.
        </p>

        <button className="confirm-btn" onClick={() => navigate("/home")}>
          Concluir
        </button>
      </div>
    </div>
  );
}
