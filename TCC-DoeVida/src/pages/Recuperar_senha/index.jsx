import { useEffect } from 'react'
import './style.css'
import Logo_Branca from '../../assets/Logo_Branca.png'


function Recuperar_senha() {

  useEffect(() => {

  }, []) 
 
  return (
  
    <div className='container'>
      <div class='bola-cortada'></div>
      <img id='Logo_Branca' src={Logo_Branca} />
      <h1>Recuperar Senha</h1>
      <form id='caixa-recuperacao'>
        <input id='email_recupecao' placeholder='Digite seu E-mail ou Usuário' name='E-mail' type="email" />
      </form>
      <div className='botoes'>
        <button id='concluir-recuperacao' type='button'>concluir</button>
      </div>
    </div>
  )
}

export default Recuperar_senha
