import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import logoBranca from '../../assets/Logo_Branca.png';
import { criarUsuario } from '../../api/usuario/usuario.js';


function Cadastro() {
  

  const nomeRef = useRef();
  const emailRef = useRef();
  const senhaRef = useRef();
  const confirmarSenhaRef = useRef();
  const cpfRef = useRef();
  const cepRef = useRef();
  const numeroRef = useRef();
  const dataNascimentoRef = useRef();
  const fotoPerfilRef = useRef();

  const [sexos, setSexos] = useState([]);
  const [tiposSangue, setTiposSangue] = useState([]);

  const [idSexo, setIdSexo] = useState('');
  const [idTipoSanguineo, setIdTipoSanguineo] = useState('');

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const resSexo = await Api.get('/sexo-usuario');
        setSexos(Array.isArray(resSexo.data) ? resSexo.data : resSexo.data?.dados || []);
      } catch {
        setSexos([{ id: 1, nome: 'Masculino' }, { id: 2, nome: 'Feminino' }, { id: 3, nome: 'Outro' }]);
      }

      try {
        const resTipos = await Api.get('/tipos-sanguineos');
        const arr = Array.isArray(resTipos.data) ? resTipos.data : resTipos.data?.dados || [];
        const normalizado = arr.map((t, i) => ({
          id: t.id ?? t.id_tipo_sanguineo ?? t.ID ?? i + 1,
          tipo: t.tipo ?? t.sigla ?? String(t),
        }));
        setTiposSangue(normalizado);
      } catch {
        setTiposSangue([
          { id: 1, tipo: 'O+' },
          { id: 2, tipo: 'O-' },
          { id: 3, tipo: 'A+' },
          { id: 4, tipo: 'A-' },
          { id: 5, tipo: 'B+' },
          { id: 6, tipo: 'B-' },
          { id: 7, tipo: 'AB+' },
          { id: 8, tipo: 'AB-' },
        ]);
      }
    };
    loadOptions();
  }, []);

  async function handleCadastro(e) {
    e.preventDefault();

    if (!idSexo) {
      alert('Selecione seu sexo.');
      return;
    }
    if (!idTipoSanguineo) {
      alert('Selecione seu tipo sanguíneo.');
      return;
    }
    if (!senhaRef.current?.value || senhaRef.current.value !== confirmarSenhaRef.current?.value) {
      alert('Senha inválida ou diferente da confirmação.');
      return;
    }

    const payload = {
      nome: nomeRef.current.value.trim(),
      email: emailRef.current.value.trim(),
      senha: senhaRef.current.value,
      confirmar_senha: confirmarSenhaRef.current.value,
      cpf: cpfRef.current.value.trim(),
      cep: cepRef.current.value.trim(),
      numero: numeroRef.current.value.trim(),
      data_nascimento: dataNascimentoRef.current.value,
      foto_perfil: fotoPerfilRef.current.value || null,
      id_sexo: Number(idSexo),
      id_tipo_sanguineo: Number(idTipoSanguineo),
      id_banco_sangue: 1,
    };

    try {
      await criarUsuario(payload);
      alert('Usuário cadastrado com sucesso!');
      navigate('login');
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      alert('Erro ao cadastrar usuário. Tente novamente.');
    }
  }

  return (
    <div className="cadastro">
      <h1>Cadastro</h1>
      <form onSubmit={handleCadastro}>
        <label>
          Nome:
          <input type="text" ref={nomeRef} required />
        </label>
        <label>
          Email:
          <input type="email" ref={emailRef} required />
        </label>
        <label>
          Senha:
          <input type="password" ref={senhaRef} required />
        </label>
        <label>
          Confirmar Senha:
          <input type="password" ref={confirmarSenhaRef} required />
        </label>
        <label>
          CPF:
          <input type="text" ref={cpfRef} required />
        </label>
        <label>
          CEP:
          <input type="text" ref={cepRef} required />
        </label>
        <label>
          Número:
          <input type="text" ref={numeroRef} required />
        </label>
        <label>
          Data de Nascimento:
          <input type="date" ref={dataNascimentoRef} required />
        </label>
        <label>
          Foto de Perfil:
          <input type="file" ref={fotoPerfilRef} />
        </label>
        <label>
          Sexo:
          <select onChange={(e) => setIdSexo(e.target.value)} required>
            <option value="">Selecione</option>
            {sexos.map((sexo) => (
              <option key={sexo.id} value={sexo.id}>
                {sexo.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tipo Sanguíneo:
          <select onChange={(e) => setIdTipoSanguineo(e.target.value)} required>
            <option value="">Selecione</option>
            {tiposSangue.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.tipo}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Cadastro;