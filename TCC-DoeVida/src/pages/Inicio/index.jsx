import './style.css'
import Logo_Branca from '../../assets/Logo_Branca.png'

function Inicio() {

  return (
    <div className='container'>
      <img src={Logo_Branca} />
      <form id='formulario_doador'>
        <h1>DOEVIDA</h1>
        <input id='name_doador' name='Nome completo' type="text" />
        <input id='email_doador' name='E-mail' type="email" />
        <input id='senha_doador' name='Digite sua Senha' type="text" />
        <input id='confirmar_doador' name='Confirme sua Senha' type="text" />
        <button id='criar_doador' type='button'>Criar Conta</button>
        <button id='tem_conta' type='button'>Já tem uma conta?</button>
      </form>
    </div>
  )
}

export default Inicio
