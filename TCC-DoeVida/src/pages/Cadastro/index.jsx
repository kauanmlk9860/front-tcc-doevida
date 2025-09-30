import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'
import logoBranca from '../../assets/Logo_Branca.png'
import Api from '../../services/api'

function Cadastro() {
  const navigate = useNavigate()

  const nomeRef = useRef()
  const emailRef = useRef()
  const senhaRef = useRef()
  const confirmarSenhaRef = useRef()
  const cpfRef = useRef()
  const cepRef = useRef()
  const numeroRef = useRef()
  const dataNascimentoRef = useRef()
  const fotoPerfilRef = useRef()

  const [sexos, setSexos] = useState([])
  const [tiposSangue, setTiposSangue] = useState([])

  const [idSexo, setIdSexo] = useState('')
  const [idTipoSanguineo, setIdTipoSanguineo] = useState('') 

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const resSexo = await Api.get('/sexo-usuario')
        setSexos(Array.isArray(resSexo.data) ? resSexo.data : resSexo.data?.dados || [])
      } catch {
        setSexos([{ id: 1, nome: 'Masculino' }, { id: 2, nome: 'Feminino' }, { id: 3, nome: 'Outro' }])
      }

      try {
        const resTipos = await Api.get('/tipos-sanguineos')
        const arr = Array.isArray(resTipos.data) ? resTipos.data : resTipos.data?.dados || []
        const normalizado = arr.map((t, i) => ({
          id: t.id ?? t.id_tipo_sanguineo ?? t.ID ?? i + 1,
          tipo: t.tipo ?? t.sigla ?? String(t)
        }))
        setTiposSangue(normalizado)
      } catch {
        setTiposSangue([
          { id: 1, tipo: 'O+' }, { id: 2, tipo: 'O-' },
          { id: 3, tipo: 'A+' }, { id: 4, tipo: 'A-' },
          { id: 5, tipo: 'B+' }, { id: 6, tipo: 'B-' },
          { id: 7, tipo: 'AB+' }, { id: 8, tipo: 'AB-' }
        ])
      }
    }
    loadOptions()
  }, [])

  async function postUser() {
    if (!idSexo) { alert('Selecione seu sexo.'); return }
    if (!idTipoSanguineo) { alert('Selecione seu tipo sanguíneo.'); return }
    if (!senhaRef.current?.value || senhaRef.current.value !== confirmarSenhaRef.current?.value) {
      alert('Senha inválida ou diferente da confirmação.'); return
    }

    const payload = {
      nome: nomeRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      senha_hash: senhaRef.current.value,
      cpf: cpfRef.current.value.trim(),
      cep: cepRef.current.value.trim(),
      numero: numeroRef.current.value.trim(),
      data_nascimento: dataNascimentoRef.current.value,
      foto_perfil: (fotoPerfilRef.current.value || '').trim() || null,
      id_sexo: Number(idSexo),            
      id_tipo_sanguineo: Number(idTipoSanguineo), 
      id_banco_sangue: 1                     
    }

    await Api.post('/usuario', payload, {
      headers: { 'Content-Type': 'application/json' }
    })
    navigate('/login')
  }

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

        <select
          className="input input--blood"
          value={idTipoSanguineo}
          onChange={e => setIdTipoSanguineo(e.target.value)}
        >
          <option value="" disabled>Selecione seu tipo sanguíneo</option>
          {tiposSangue.map(ts => (
            <option key={ts.id} value={ts.id}>{ts.tipo}</option>
          ))}
        </select>

        <select
          className="input input--sex"
          value={idSexo}
          onChange={e => setIdSexo(e.target.value)}
        >
          <option value="" disabled>Selecione seu sexo</option>
          {sexos.map(s => (
            <option key={s.id} value={s.id}>{s.nome}</option>
          ))}
        </select>

        <input className="input input--photo" placeholder="Foto de Perfil" name="foto-perfil" type="" ref={fotoPerfilRef} />
      </form>

      <div className="cadastro__actions">
        <button className="btn btn--primary" type="button" onClick={postUser}>Criar Conta</button>
        <button className="btn btn--link" type="button" onClick={() => navigate('/login')}>Já tem uma conta?</button>
      </div>
    </div>
  )
}

export default Cadastro
