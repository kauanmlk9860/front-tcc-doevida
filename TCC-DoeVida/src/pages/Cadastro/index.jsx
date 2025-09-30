// Cadastro.jsx
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'
import Api from '../../services/api'

function Cadastro() {
  const navigate = useNavigate()
  const nomeRef = useRef(null)
  const emailRef = useRef(null)
  const senhaRef = useRef(null)
  const confirmarSenhaRef = useRef(null)
  const cpfRef = useRef(null)
  const cepRef = useRef(null)
  const numeroRef = useRef(null)
  const dataNascimentoRef = useRef(null)
  const tipoSanguineoRef = useRef(null)
  const fotoPerfilRef = useRef(null)
  const sexoRef = useRef(null)

  async function postUser() {
    console.log({
      nome: nomeRef.current?.value,
      email: emailRef.current?.value,
      senha: senhaRef.current?.value,
      confirmarSenha: confirmarSenhaRef.current?.value,
      cpf: cpfRef.current?.value,
      cep: cepRef.current?.value,
      numero: numeroRef.current?.value,
      dataNascimento: dataNascimentoRef.current?.value,
      tipoSanguineo: tipoSanguineoRef.current?.value,
      fotoPerfil: fotoPerfilRef.current?.value,
      sexo: sexoRef.current?.value
    })
  }

  useEffect(() => {}, [])

  return (
    <div className="cadastro">
      <div className="cadastro__decor-circle" />
      <img className="cadastro__logo" src={logoBranca} alt="DoeVida" />
      <h1 className="cadastro__title">Sou Doador</h1>

      <form className="cadastro__form" autoComplete="off">
        <input className="input input--name" placeholder="Nome Completo" name="nome" type="text" ref={nomeRef} />
        <input className="input input--email" placeholder="Digite seu E-mail" name="email" type="email" ref={emailRef} />
        <input className="input input--password" placeholder="Digite sua Senha" name="senha" type="password" ref={senhaRef} />
        <input className="input input--password-confirm" placeholder="Confirme sua Senha" name="confirmar-senha" type="password" ref={confirmarSenhaRef} />
        <input className="input input--cpf" placeholder="Digite seu CPF" name="cpf" type="text" ref={cpfRef} />
        <input className="input input--cep" placeholder="Digite seu CEP" name="cep" type="text" ref={cepRef} />
        <input className="input input--number" placeholder="Digite seu Número" name="numero" type="text" ref={numeroRef} />
        <input className="input input--date" placeholder="Data de Nascimento" name="data-nascimento" type="date" ref={dataNascimentoRef} />
        <input className="input input--blood" placeholder="Tipo Sanguíneo" name="tipo-sanguineo" type="text" ref={tipoSanguineoRef} />
        <input className="input input--photo" placeholder="Foto de Perfil" name="foto-perfil" type="url" ref={fotoPerfilRef} />
        <input className="input input--sex" placeholder="Sexo" name="sexo" type="text" ref={sexoRef} />
      </form>

      <div className="cadastro__actions">
        <button className="btn btn--primary" type="button" onClick={postUser}>Criar Conta</button>
        <button className="btn btn--link" type="button" onClick={() => navigate('/login')}>Já tem uma conta?</button>
      </div>
    </div>
  )
}

export default Cadastro
