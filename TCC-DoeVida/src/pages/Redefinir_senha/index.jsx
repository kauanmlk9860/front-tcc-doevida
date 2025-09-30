import { useEffect } from 'react'
import './style.css'
import Logo_Branca from '../../assets/Logo_Branca.png'
import Api from '../../services/api'

function Redefinir_senha() {

  useEffect(() => {
  }, []) 
 
  return (
    <div className='container'>
      <div className='bola-cortada'></div>
      
      <img 
        id='Logo_Branca' 
        src={Logo_Branca} 
        alt="Logo DoeVida" 
      />
      
      <h1>Redefinir Senha</h1>

      <form id='caixa-recuperacao'>
        <div className="input-container">
          <input 
            id='senha_nova' 
            placeholder='Digite sua nova senha' 
            name='senha_nova' 
            type='password' 
          />
        </div>
        <div className="input-container">
          <input 
            id='senha_confirmar' 
            placeholder='Confirme sua nova senha' 
            name='senha_confirmar' 
            type='password' 
          />
        </div>
      </form>

      <div className='botoes'>
        <button id='concluir-recuperacao' type='button'>
          Concluir nova senha
        </button>
      </div>
    </div>
  )
}

export default Redefinir_senha
