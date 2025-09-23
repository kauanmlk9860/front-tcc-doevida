import './style.css'
import Logo_Branca from '../../assets/Logo_Branca.png'

function Inicio() {

  return (
      <div className='container'>
        <form>
          <img src={Logo_Branca}/>
          <h1>DOEVIDA</h1>
          <input name='Nome completo' type="text" />
          <input name='E-mail' type="email" />
          <input name='Digite sua Senha' type="text" />
          <input name='Confirme sua Senha' type="text" />
          <button type='button'>Criar Conta</button>
          <button type='button'>
            Já tem uma conta?
            Faça Login
          </button>
        </form>
      </div>
  )
}

export default Inicio
