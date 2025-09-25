import { useEffect, useRef } from 'react'
import './style.css'
import Logo_Branca from '../../assets/Logo_Branca.png'
import Api from '../../services/api'

function Cadastro() {

  const inputNome = useRef()
  const inputEmail = useRef()
  const inputSenha = useRef()
  // const inputConfirmarSenha = useRef()
  const inputCpf = useRef()
  const inputCep = useRef()
  const inputNumero = useRef()
  const inputDataNascimento = useRef()
  const inputTipoSanguineo = useRef()
  const inputFoto = useRef()
  const inputSexo = useRef()

  async function PostUser(){
    // await Api.post('/usuario')
    console.log(inputNome)
  }

  useEffect(() => {

  }, []) 
 
  return (
  
    <div className='container'>

      <div class='bola-cortada'></div>

      <img id='Logo_Branca' src={Logo_Branca} />

      <h1>Sou Doador</h1>

      <form id='formulario_doador'>
        <input id='nome_cadastro'            placeholder='Nome Completo'                 name='Nome'           type="text"   ref={inputNome}/>
        <input id='email_cadastro'           placeholder='Digite seu E-mail'             name='E-mail'         type="email"  ref={inputEmail}/>
        <input id='senha_cadastro'           placeholder='Digite sua Senha'              name='Senha'          type="text"   ref={inputSenha}/>
        <input id='confirmar_senha'          placeholder='Confirme sua Senha'            name='Senha'          type="text"   ref={inputSenha}/>
        <input id='cpf_cadastro'             placeholder='Digite seu CPF'                name='Cpf'            type="text"   ref={inputCpf}/>
        <input id='cep_cadastro'             placeholder='Digite seu CEP'                name='Cep'            type="text"   ref={inputCep}/>
        <input id='numero_cadastro'          placeholder='Digite seu Numero'             name='Cpf'            type="text"   ref={inputNumero}/>
        <input id='data_nasciemnto_cadastro' placeholder='Digite sua Data de Nascimento' name='Numero'         type="text"   ref={inputDataNascimento}/>
        <input id='tipo_sanguineo_cadastro'  placeholder='Escolha seu Tipo Sanguineo'    name='Tipo Sanguineo' type="text"   ref={inputTipoSanguineo}/>
        <input id='foto_cadastro'            placeholder='Escolha sua Foto'              name='Foto de perfil' type="text"   ref={inputFoto}/>
        <input id='sexo_cadastro'            placeholder='Escolha seu Sexo'              name='Sexo'           type="text"   ref={inputSexo}/>
      </form>

      <div className='botoes'>
        <button id='criar_cadastro' type='button' onClick={PostUser}>Criar Conta</button>
        <button id='tem_conta' type='button'>Já tem uma conta?</button>
      </div>

    </div>
  )
}

export default Cadastro
