import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'


export default function Login() {
  const navigate = useNavigate()
  const emailRef = useRef()
  const senhaRef = useRef()

  const handleLogin = () => {
    console.log({
      email: emailRef.current?.value,
      senha: senhaRef.current?.value
    })
  }

  return (
    <div className="login">
      <div className="login__decor-circle" />
      <img className="login__logo" src={logoBranca} alt="DoeVida" />
      <h1 className="login__title">Sou Doador</h1>

      <form className="login__form" autoComplete="off">
        <input className="input input--email" placeholder="E-mail" type="email" ref={emailRef} />
        <input className="input input--password" placeholder="Senha" type="password" ref={senhaRef} />
        <button type="button" className="login__forgot" onClick={() => navigate('/recuperar-senha')}>Esqueci minha senha</button>
      </form>

      <div className="login__actions">
        <button className="btn btn--primary" type="button" onClick={handleLogin}>Entrar</button>
        <button className="btn btn--link" type="button" onClick={(handleLogin) => navigate('/Cadastro')}>Criar conta?</button>
      </div>
    </div>
  )
}
