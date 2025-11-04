import { useEffect, useMemo, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { atualizarUsuario, obterSexos, obterTiposSanguineos } from '../../api/usuario/usuario';

function Perfil() {
  const navigate = useNavigate();
  const { user, isLoggedIn, loading, updateUser, setUser, logout } = useUser();

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [tipos, setTipos] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [donations, setDonations] = useState({ total: 12, ano: 3 }); // mock

  useEffect(() => {
    if (!isLoggedIn) return;
    setForm({
      id: user?.id,
      nome: user?.nome || '',
      email: user?.email || '',
      cpf: user?.cpf || '',
      cep: user?.cep || '',
      numero: user?.numero || '',
      data_nascimento: user?.data_nascimento || '',
      telefone: user?.telefone || '',
      id_sexo: user?.id_sexo || '',
      id_tipo_sanguineo: user?.id_tipo_sanguineo || '',
      foto_perfil: user?.foto_perfil || '',
    });
  }, [user, isLoggedIn]);


  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        const [t, s] = await Promise.all([
          obterTiposSanguineos().catch(() => ({ data: [] })),
          obterSexos().catch(() => ({ data: [] }))
        ]);
        
        if (isMounted) {
          if (t?.data) setTipos(Array.isArray(t.data) ? t.data : []);
          if (s?.data) setSexos(Array.isArray(s.data) ? s.data : []);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        if (isMounted) {
          setTipos([]);
          setSexos([]);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const bloodType = useMemo(() => {
    if (user?.tipo_sanguineo) return user.tipo_sanguineo;
    if (!Array.isArray(tipos)) return 'O+';
    const found = tipos.find(x => x.id === user?.id_tipo_sanguineo);
    return found?.tipo || 'O+'; // fallback
  }, [user, tipos]);

  const handleSave = async () => {
    if (!form?.id) { setEdit(false); return; }
    setSaving(true);
    const payload = { ...form };
    const res = await atualizarUsuario(form.id, payload);
    if (res?.success) {
      await updateUser();
      setEdit(false);
    }
    setSaving(false);
  };

  if (loading || !user) {
    return null; // Não mostra nada enquanto carrega
  }

  return (
    <div className="page-wrapper">
      <div className="topbar">
        <div className="user-brief">
          <img src={user?.foto_perfil || '/placeholder-profile.png'} alt="Foto" className="user-avatar-lg" />
          <div className="user-name-stack">
            <span className="title">Nome</span>
            <span className="subtitle">{user?.nome || 'Usuário'}</span>
          </div>
        </div>

        <div className="donations">
          <div className="row"><span className="label">Total de Doações:</span><span className="value">{donations.total}</span></div>
          <div className="row"><span className="label">Doações este ano:</span><span className="value">{donations.ano}</span></div>
        </div>

        <div className="nav-simple">
          <button onClick={() => navigate('/home')}>Home</button>
          <button onClick={() => navigate('/saiba-mais')}>Notícias</button>
          <span className="chip">Perfil</span>
        </div>
      </div>

      <div className="blood-drop">{bloodType}</div>

      <div className="content">
        <section className="card">
          <div className="card-title-row">
            <h3 className="card-title">Dados</h3>
            {!edit ? (
              <button className="edit-btn" onClick={() => setEdit(true)}>✏️</button>
            ) : null}
          </div>

          {!edit ? (
            <div className="fields">
              <div className="field"><label>Nome</label><div className="value">{user?.nome}</div></div>
              <div className="field"><label>Email</label><div className="value">{user?.email}</div></div>
              <div className="field"><label>CPF</label><div className="value">{user?.cpf}</div></div>
              <div className="field"><label>Cep</label><div className="value">{user?.cep}</div></div>
              <div className="field"><label>Data de Nascimento</label><div className="value">{user?.data_nascimento}</div></div>
              <div className="field"><label>Celular</label><div className="value">{user?.telefone}</div></div>
            </div>
          ) : (
            <div className="form-grid">
              <input className="input" placeholder="Nome" value={form.nome} onChange={e=>setForm(v=>({...v,nome:e.target.value}))} />
              <input className="input" placeholder="Email" type="email" value={form.email} onChange={e=>setForm(v=>({...v,email:e.target.value}))} />
              <input className="input" placeholder="CPF" value={form.cpf} onChange={e=>setForm(v=>({...v,cpf:e.target.value}))} />
              <input className="input" placeholder="CEP" value={form.cep} onChange={e=>setForm(v=>({...v,cep:e.target.value}))} />
              <input className="input" placeholder="Data de Nascimento" value={form.data_nascimento} onChange={e=>setForm(v=>({...v,data_nascimento:e.target.value}))} />
              <input className="input" placeholder="Celular" value={form.telefone||''} onChange={e=>setForm(v=>({...v,telefone:e.target.value}))} />
              <select className="input" value={form.id_tipo_sanguineo||''} onChange={e=>setForm(v=>({...v,id_tipo_sanguineo:Number(e.target.value)}))}>
                <option value="">Tipo sanguíneo</option>
                {tipos?.map(t=> (
                  <option key={t.id} value={t.id}>{t.tipo}</option>
                ))}
              </select>
              <select className="input" value={form.id_sexo||''} onChange={e=>setForm(v=>({...v,id_sexo:Number(e.target.value)}))}>
                <option value="">Sexo</option>
                {sexos?.map(s=> (
                  <option key={s.id} value={s.id}>{s.sexo}</option>
                ))}
              </select>
              <div className="actions">
                <button className="btn ghost" onClick={()=>{ setEdit(false); setForm(user || {}); }}>Cancelar</button>
                <button className="btn primary" onClick={handleSave} disabled={saving}>{saving? 'Salvando...' : 'Salvar'}</button>
              </div>
            </div>
          )}
        </section>

        <aside className="card">
          <div className="card-title-row">
            <h3 className="card-title">Certificados</h3>
            <span>›</span>
          </div>
          <div className="cert-card">
            <span>Certificados</span>
            <span>›</span>
          </div>
        </aside>
      </div>

      <div className="logout-wrapper">
        <button className="logout" onClick={()=> { logout(); navigate('/login'); }}>⎋ Sair</button>
      </div>
    </div>
  );
}

export default Perfil;
