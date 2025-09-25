import { useEffect } from 'react'
import './style.css'
import Logo_Branca from '../../assets/Logo_Branca.png'
import Api from '../../services/api'

function Cadastro() {

  async function PostUser(){
    await Api.post('/usuario')
  }

  useEffect(() => {

  }, []) 
 
  return (
  
    <div className='container'>
      <div class='bola-cortada'></div>
      <img id='Logo_Branca' src={Logo_Branca} />
      <h1>Sou Doador</h1>
      <form id='formulario_doador'>
        <input id='nome_cadastro' placeholder='Nome Completo' name='Nome' type="text" />
        <input id='email_cadastro' placeholder='Digite seu E-mail' name='E-mail' type="email" />
        <input id='senha_cadastro' placeholder='Digite sua Senha' name='Senha' type="text" />
        <input id='confirmar_senha' placeholder='Confirme sua Senha' name='Senha' type="text" />
      </form>
      <div className='botoes'>
        <button id='criar_cadastro' type='button'>Criar Conta</button>
        <button id='tem_conta' type='button'>Já tem uma conta?</button>
      </div>
    </div>
  )
}

export default Cadastro
