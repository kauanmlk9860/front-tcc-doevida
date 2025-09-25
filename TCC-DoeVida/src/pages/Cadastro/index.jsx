import { useEffect } from 'react'
import './style.css'
import Logo_Branca from '../../assets/Logo_Branca.png'
import Api from '../../services/api'

function Login() {

  async function PostUser(){
    await Api.post('/usuario')
  }

  useEffect(() => {

  }, []) 
 
  return (
  
    <div className='container'>
      <div class="bola-cortada"></div>
      <img id='Logo_Branca' src={Logo_Branca} />
      <form id='formulario_doador'>
        <h1>Sou Doador</h1>
        <input id='name_doador' placeholder='Nome Completo' name='Nome completo' type="text" />
        <input id='email_doador' placeholder='E-mail' name='E-mail' type="email" />
        <input id='senha_doador' placeholder='Senha' name='Digite sua Senha' type="text" />
        <input id='confirmar_doador' placeholder='Confirme sua Senha' name='Confirme sua Senha' type="text" />
        <button id='criar_doador' type='button'>Criar Conta</button>
        <button id='tem_conta' type='button'>Já tem uma conta?</button>
      </form>
    </div>
  )
}

export default Login
