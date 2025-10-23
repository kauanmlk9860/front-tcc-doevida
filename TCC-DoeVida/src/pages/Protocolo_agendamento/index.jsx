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

/** Tenta extrair o objeto de usuário real, mesmo que venha embrulhado no payload do login */
function getUsuarioAtual() {
  try {
    const raw = localStorage.getItem("usuario");
    if (!raw) return null;
    const u = JSON.parse(raw);

    // Em muitos backends o usuário vem dentro de outra chave (ex.: { usuario: {...} } ou { user: {...} })
    const obj =
      u?.usuario ||
      u?.user ||
      u?.data?.usuario ||
      u?.data?.user ||
      u;

    return obj && typeof obj === "object" ? obj : null;
  } catch {
    return null;
  }
}

/** Composição robusta do nome do usuário */
function getNomeUsuario(usuario) {
  if (!usuario) return null;

  // Candidatos comuns
  const candidatos = [
    usuario.nome,
    usuario.nomeUsuario,
    usuario.nome_completo,
    usuario.nomeCompleto,
    usuario.fullName,
    // monta a partir de first/last, mas só se existir algo
    [usuario.firstName, usuario.lastName].filter(Boolean).join(" ").trim(),
    // alguns bancos usam "sobrenome"
    [usuario.nome, usuario.sobrenome].filter(Boolean).join(" ").trim(),
  ];

  // Retorna o primeiro string não-vazia
  const escolhido = candidatos.find((v) => typeof v === "string" && v.trim().length > 0);
  return escolhido || null;
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
  const nomeUsuario = getNomeUsuario(usuario) ?? "Usuário";

  const cpfUsuario =
    (typeof usuario?.cpf === "string" && usuario.cpf) ||
    (typeof usuario?.documento === "string" && usuario.documento) ||
    (typeof usuario?.documentoCpf === "string" && usuario.documentoCpf) ||
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
        {agendamento?.agendamento_id && (
          <p><strong>Protocolo:</strong> #{agendamento.agendamento_id}</p>
        )}
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
