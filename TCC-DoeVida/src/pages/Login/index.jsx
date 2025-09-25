import { useEffect } from 'react'
import './style.css'
import Logo_Branca from '../../assets/Logo_Branca.png'
import Api from '../../services/api'

function Login() {

  useEffect(() => {

  }, []) 
 
  return (
  
    <div className='container'>
      <div class='bola-cortada'></div>
      <img id='Logo_Branca' src={Logo_Branca} />
      <h1>Sou Doador</h1>
      <form id='formulario_doador'>
        <input id='email_login' placeholder='Digite seu E-mail' name='E-mail' type="email" />
        <input id='senha_login' placeholder='Digite sua Senha' name='Senha' type="text" />
        <button id='esqueci_login' type='button'> Esqueci minha Senha?</button>
      </form>
      <div className='botoes'>
        <button id='entrar_login' type='button'>Entrar</button>
        <button id='sem_conta' type='button'>Não tem uma conta?</button>
      </div>
    </div>
  )
}

export default Login
