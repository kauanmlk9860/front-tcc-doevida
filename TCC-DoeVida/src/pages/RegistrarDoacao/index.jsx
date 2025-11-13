import { useRef, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './style.css'
import logoSemFundo from '../../assets/icons/logo_semfundo.png'
import PhotoUpload from '../../components/jsx/PhotoUpload'
import { InputIcons } from '../../components/jsx/InputIcons'
import { useUser } from '../../contexts/UserContext'
import { 
  criarRegistroDoacao, 
  uploadComprovanteDoacao
} from '../../api/registroDoacao'
import { listarMeusAgendamentos } from '../../api/agendamento'

function RegistrarDoacao() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isLoggedIn } = useUser()
  
  // Refs
  const agendamentoRef = useRef()
  const observacoesRef = useRef()
  const photoUploadRef = useRef()

  // Estados
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [agendamentos, setAgendamentos] = useState([])
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(true)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)

  // Verificar se está logado
  if (!isLoggedIn) {
    navigate('/login')
    return null
  }

  // Carregar agendamentos concluídos
  useEffect(() => {
    carregarAgendamentos()
  }, [])

  // Pré-selecionar agendamento se fornecido
  useEffect(() => {
    const agendamentoId = searchParams.get('agendamento')
    if (agendamentoId && agendamentoRef.current) {
      agendamentoRef.current.value = agendamentoId
      handleAgendamentoChange({ target: { value: agendamentoId } })
    }
  }, [searchParams, agendamentos])

  const carregarAgendamentos = async () => {
    try {
      setLoadingAgendamentos(true)
      const resultado = await listarMeusAgendamentos()
      if (resultado.success) {
        const concluidos = resultado.data.filter(a => a.status === 'Concluído')
        setAgendamentos(concluidos)
        
        if (concluidos.length === 0) {
          setError('Você não possui agendamentos concluídos para registrar')
        }
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      setError('Erro ao carregar agendamentos')
    } finally {
      setLoadingAgendamentos(false)
    }
  }

  const handleAgendamentoChange = (e) => {
    const id = e.target.value
    if (id) {
      const agendamento = agendamentos.find(a => a.id === parseInt(id))
      setAgendamentoSelecionado(agendamento)
    } else {
      setAgendamentoSelecionado(null)
    }
  }

  const validarFormulario = () => {
    const agendamentoId = agendamentoRef.current?.value

    if (!agendamentoId) return 'Selecione o agendamento da doação'
    
    return null
  }

  const registrarDoacao = async () => {
    setError('')
    setSuccess('')
    
    const erro = validarFormulario()
    if (erro) return setError(erro)
    
    setLoading(true)

    try {
      const idAgendamento = parseInt(agendamentoRef.current.value)
      
      if (!idAgendamento || isNaN(idAgendamento)) {
        setError('ID do agendamento inválido')
        setLoading(false)
        return
      }

      let fotoUrl = null
      
      // Upload da foto se fornecida
      if (photoUploadRef.current) {
        const file = photoUploadRef.current.getFile()
        if (file) {
          console.log('📤 Fazendo upload da foto...')
          const uploadResult = await uploadComprovanteDoacao(file)
          if (uploadResult.success) {
            fotoUrl = uploadResult.url
            console.log('✅ Foto enviada:', fotoUrl)
          } else {
            setError(uploadResult.message || 'Erro ao fazer upload da foto')
            setLoading(false)
            return
          }
        }
      }

      // Preparar dados - Backend preenche automaticamente:
      // id_usuario (do token), id_hospital, data_doacao, local_doacao (do agendamento)
      const dadosDoacao = {
        id_agendamento: idAgendamento,
        observacao: observacoesRef.current?.value?.trim() || null,
        foto_comprovante: fotoUrl
      }

      console.log('📝 Enviando dados para registro:', dadosDoacao)
      console.log('ℹ️ Backend preencherá automaticamente: id_usuario, id_hospital, data_doacao, local_doacao')
      
      const resultado = await criarRegistroDoacao(dadosDoacao)
      
      if (resultado.success) {
        console.log('✅ Doação registrada:', resultado.data)
        setSuccess('Doação registrada com sucesso! Obrigado por salvar vidas! 🩸')
        
        setTimeout(() => {
          if (agendamentoRef.current) agendamentoRef.current.value = ''
          setAgendamentoSelecionado(null)
          if (observacoesRef.current) observacoesRef.current.value = ''
          if (photoUploadRef.current?.clear) photoUploadRef.current.clear()
          
          setTimeout(() => navigate('/historico'), 2000)
        }, 1500)
      } else {
        console.error('❌ Erro do backend:', resultado.message)
        setError(resultado.message || 'Erro ao registrar doação')
      }
      
    } catch (error) {
      console.error('❌ Erro ao registrar doação:', error)
      setError(error.response?.data?.message || 'Erro ao registrar doação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => e.key === 'Enter' && !loading && registrarDoacao()

  return (
    <div className="registrar-doacao">
      <div className="registrar-doacao__decor-circle" />
      
      {/* Header */}
      <div className="registrar-doacao__header">
        <button 
          className="btn-back" 
          onClick={() => navigate('/home')}
          aria-label="Voltar para Home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Voltar para Home</span>
        </button>
        <img className="registrar-doacao__logo" src={logoSemFundo} alt="DoeVida" />
      </div>

      {/* Título e Descrição */}
      <div className="registrar-doacao__intro">
        <h1 className="registrar-doacao__title">Registrar Doação</h1>
        <p className="registrar-doacao__subtitle">
          Registre sua doação e ajude a manter seu histórico atualizado
        </p>
      </div>

      {/* Formulário */}
      <form className="registrar-doacao__form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-grid">
          
          {/* Agendamento */}
          <div className="field field--full">
            <label htmlFor="agendamento">
              <span className="field-label">Agendamento *</span>
              <span className="field-hint">Selecione o agendamento da doação concluída</span>
            </label>
            <div className="input-wrapper">
              <InputIcons.Calendar />
              <select
                id="agendamento"
                ref={agendamentoRef}
                className="input"
                disabled={loading || loadingAgendamentos || agendamentos.length === 0}
                onChange={handleAgendamentoChange}
              >
                <option value="">
                  {loadingAgendamentos 
                    ? 'Carregando agendamentos...' 
                    : agendamentos.length === 0 
                      ? 'Nenhum agendamento concluído disponível' 
                      : 'Selecione o agendamento'}
                </option>
                {agendamentos.map(agendamento => {
                  const dataObj = new Date(agendamento.data)
                  const data = dataObj.toLocaleDateString('pt-BR')
                  let hora = ''
                  if (agendamento.hora) {
                    try {
                      const horaObj = new Date(agendamento.hora)
                      hora = horaObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                    } catch (e) {
                      hora = agendamento.hora
                    }
                  }
                  return (
                    <option key={agendamento.id} value={agendamento.id}>
                      {data} {hora && `- ${hora}`} - {agendamento.nome_hospital || 'Hospital'}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          {/* Info do Agendamento Selecionado */}
          {agendamentoSelecionado && (
            <div className="field field--full">
              <div className="info-box">
                <strong>Dados que serão registrados automaticamente:</strong>
                <p>🏥 Hospital: {agendamentoSelecionado.nome_hospital || 'N/A'}</p>
                <p>📅 Data da Doação: {new Date(agendamentoSelecionado.data).toLocaleDateString('pt-BR')}</p>
                {agendamentoSelecionado.hora && (
                  <p>🕐 Horário: {(() => {
                    try {
                      return new Date(agendamentoSelecionado.hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                    } catch (e) {
                      return agendamentoSelecionado.hora
                    }
                  })()}</p>
                )}
                <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>
                  ℹ️ Estes dados serão preenchidos automaticamente pelo sistema
                </p>
              </div>
            </div>
          )}

          {/* Observações */}
          <div className="field field--full">
            <label htmlFor="observacoes">
              <span className="field-label">Observações</span>
              <span className="field-hint">Informações adicionais (opcional)</span>
            </label>
            <div className="textarea-wrapper">
              <textarea
                id="observacoes"
                ref={observacoesRef}
                className="textarea"
                placeholder="Ex: Primeira doação, doação em campanha, etc."
                disabled={loading}
                maxLength={500}
                rows={4}
              />
            </div>
          </div>

          {/* Foto da Doação */}
          <div className="field field--full">
            <label>
              <span className="field-label">Foto da Doação</span>
              <span className="field-hint">Foto sua doando ou comprovante (opcional)</span>
            </label>
            <PhotoUpload
              ref={photoUploadRef}
              placeholder="Adicione uma foto da doação"
              disabled={loading}
            />
          </div>
        </div>

        {/* Mensagens de Erro/Sucesso */}
        {error && (
          <div className="message-box error-msg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="message-box success-msg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{success}</span>
          </div>
        )}
      </form>

      {/* Botões de Ação */}
      <div className="registrar-doacao__actions">
        <button 
          className="btn btn--primary" 
          type="button" 
          onClick={registrarDoacao} 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="btn-spinner"></span>
              Registrando...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor"/>
              </svg>
              Registrar Doação
            </>
          )}
        </button>
        
        <button 
          className="btn btn--secondary" 
          type="button" 
          onClick={() => navigate('/home')} 
          disabled={loading}
        >
          Cancelar
        </button>
      </div>

      {/* Info Card */}
      <div className="info-card">
        <div className="info-card__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#990410" strokeWidth="2"/>
            <path d="M12 16v-4m0-4h.01" stroke="#990410" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="info-card__content">
          <h3 className="info-card__title">Por que registrar?</h3>
          <p className="info-card__text">
            Manter seu histórico atualizado ajuda você a acompanhar suas doações 
            e saber quando poderá doar novamente. Cada doação salva até 4 vidas!
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegistrarDoacao
