import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoSemFundo from '../../assets/icons/logo_semfundo.png'
import PhotoUpload from '../../components/jsx/PhotoUpload'
import { InputIcons } from '../../components/jsx/InputIcons'
import { useUser } from '../../contexts/UserContext'

function RegistrarDoacao() {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useUser()
  
  // Refs
  const localDoacaoRef = useRef()
  const dataDoacaoRef = useRef()
  const observacoesRef = useRef()
  const photoUploadRef = useRef()

  // Estados
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Verificar se está logado
  if (!isLoggedIn) {
    navigate('/login')
    return null
  }

  const validarFormulario = () => {
    const localDoacao = localDoacaoRef.current?.value?.trim()
    const dataDoacao = dataDoacaoRef.current?.value

    if (!localDoacao) return 'Local da doação é obrigatório'
    if (localDoacao.length > 200) return 'Local deve ter no máximo 200 caracteres'
    
    if (!dataDoacao) return 'Data da doação é obrigatória'
    
    // Validar se a data não é futura
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const dataSelecionada = new Date(dataDoacao + 'T00:00:00')
    
    if (dataSelecionada > hoje) {
      return 'A data da doação não pode ser futura'
    }
    
    return null
  }

  const registrarDoacao = async () => {
    setError('')
    setSuccess('')
    
    const erro = validarFormulario()
    if (erro) return setError(erro)
    
    setLoading(true)

    try {
      // Preparar foto do comprovante
      let fotoComprovanteData = null
      if (photoUploadRef.current?.hasFile) {
        try {
          fotoComprovanteData = await photoUploadRef.current.getBase64()
          if (fotoComprovanteData && fotoComprovanteData.length > 1000000) {
            setError('Foto muito grande. Tente uma imagem menor (máx 1MB).')
            setLoading(false)
            return
          }
        } catch (error) {
          setError('Erro ao processar foto: ' + error.message)
          setLoading(false)
          return
        }
      }

      // Preparar dados da doação
      const dadosDoacao = {
        local_doacao: localDoacaoRef.current.value.trim(),
        data_doacao: dataDoacaoRef.current.value,
        observacoes: observacoesRef.current?.value?.trim() || null,
        foto_comprovante: fotoComprovanteData,
        id_usuario: user?.id
      }

      console.log('📝 Dados da doação:', dadosDoacao)
      
      // TODO: Integrar com API quando endpoint estiver pronto
      // const resultado = await registrarDoacaoAPI(dadosDoacao)
      
      // Simulação de sucesso
      setSuccess('Doação registrada com sucesso! Obrigado por salvar vidas! 🩸')
      
      // Limpar formulário
      setTimeout(() => {
        localDoacaoRef.current.value = ''
        dataDoacaoRef.current.value = ''
        if (observacoesRef.current) observacoesRef.current.value = ''
        if (photoUploadRef.current) photoUploadRef.current.clear()
        
        // Redirecionar para histórico após 2 segundos
        setTimeout(() => navigate('/historico'), 2000)
      }, 1500)
      
    } catch (error) {
      console.error('Erro ao registrar doação:', error)
      setError('Erro ao registrar doação. Tente novamente.')
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
          
          {/* Local da Doação */}
          <div className="field field--full">
            <label htmlFor="local-doacao">
              <span className="field-label">Local da Doação *</span>
              <span className="field-hint">Hospital, hemocentro ou posto de coleta</span>
            </label>
            <div className="input-wrapper">
              <InputIcons.Location />
              <input
                id="local-doacao"
                ref={localDoacaoRef}
                type="text"
                className="input"
                placeholder="Ex: Hospital São Paulo - Hemocentro"
                onKeyPress={handleKeyPress}
                disabled={loading}
                maxLength={200}
              />
            </div>
          </div>

          {/* Data da Doação */}
          <div className="field">
            <label htmlFor="data-doacao">
              <span className="field-label">Data da Doação *</span>
              <span className="field-hint">Quando você doou</span>
            </label>
            <div className="input-wrapper">
              <InputIcons.Calendar />
              <input
                id="data-doacao"
                ref={dataDoacaoRef}
                type="date"
                className="input"
                disabled={loading}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

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

          {/* Foto do Comprovante */}
          <div className="field field--full">
            <label>
              <span className="field-label">Comprovante de Doação</span>
              <span className="field-hint">Foto do comprovante ou carteirinha (opcional)</span>
            </label>
            <PhotoUpload
              ref={photoUploadRef}
              placeholder="Adicione uma foto do comprovante"
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
