import { useEffect } from 'react'
import './style.css'
import Logo_Branca from '../../assets/Logo_Branca.png'
import { useNavigate } from 'react-router-dom'

function Recuperar_senha() {
  const navigate = useNavigate()
  useEffect(() => {}, []) 

  return (
    <div className="rec-senha">
      <div className="rec-senha__decor"></div>
      <img className="rec-senha__logo" src={Logo_Branca} alt="DoeVida" />
      <h1 className="rec-senha__title">Recuperar Senha</h1>
      <form className="rec-senha__form" autoComplete="off">
        <input id="email_recuperacao" className="rec-senha__input rec-senha__input--email" placeholder="Digite seu E-mail ou usuário" name="email" type="email"/>
      </form>
      <div className="rec-senha__actions">
        <button className="rec-senha__submit" type="button">Concluir</button>
        <button
          type="button"
          className="rec-senha__back"
          onClick={() => navigate('/login')}>Voltar ao Login</button>
      </div>
    </div>
  )
}

export default Recuperar_senha
