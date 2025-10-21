import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'

function Agendamento() {
  // Dados mocados
  const user = {
    nome: "Nome do User",
    cpf: "xxx.xxx.xxx-xx",
    dataDoacao: "05/07/2025",
    localDoacao: "Hospital Centra, Rua das Flores 123",
  };

  return (
    <div className="agendamento-container">
      <div className="agendamento-header">
        <h1>Protocolo de Agendamento</h1>
        <p><strong>Nome:</strong> {user.nome}</p>
        <p><strong>CPF:</strong> {user.cpf}</p>
        <p><strong>Data da doação:</strong> {user.dataDoacao}</p>
        <p><strong>Local da doação:</strong> {user.localDoacao}</p>
      </div>

      <div className="agendamento-body">
        <h2>Lembrete</h2>
        <p><strong>No dia da sua doação, não se esqueça de:</strong></p>
        <ul>
          <li>✅ Levar um documento oficial com foto (RG ou CNH).</li>
          <li>✅ Esteja bem alimentado e hidratado (evite jejum, comidas gordurosas e álcool nas 12h anteriores).</li>
          <li>✅ Usar roupas confortáveis e fáceis de arregaçar a manga.</li>
        </ul>
        <p>
          Sua doação fará toda a diferença. Obrigado por esse gesto de amor e
          solidariedade!
        </p>
        <p className="alerta">
          Se não puder comparecer, avise com 24h de antecedência para
          reorganizarmos os atendimentos e ajudarmos mais pessoas.
        </p>
        <button className="confirm-btn">Confirmar</button>
      </div>
    </div>
  );
}

export default Agendamento;
