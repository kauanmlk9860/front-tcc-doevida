import { useEffect, useMemo, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { atualizarUsuario, obterSexos, obterTiposSanguineos } from '../../api/usuario/usuario';
import LogoutModal from '../../components/jsx/LogoutModal';

// Imagens
const logoBranca = '/src/assets/Logo_Branca.png';
const placeholder = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

function Perfil() {
  const navigate = useNavigate();
  const { user, isLoggedIn, loading, updateUser, setUser, logout } = useUser();

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [tipos, setTipos] = useState([]);
  const [sexos, setSexos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [donations, setDonations] = useState({ total: 12, ano: 3 }); // mock
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  if (loading || !user) {
    return null; // Não mostra nada enquanto carrega
  }

  return (
    <div className="page-wrapper">
      {/* Header Premium */}
      <header className="perfil-header-premium">
        <div className="header-bg-pattern"></div>
        <div className="header-content-premium">
          <div className="header-left-simple">
            <button 
              className="btn-voltar-premium"
              onClick={() => navigate(-1)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="header-brand-simple">
              <div className="brand-logo-container">
                <img src={logoBranca} alt="DoeVida" className="header-logo" />
                <div className="logo-glow"></div>
              </div>
              <h1 className="brand-title">Perfil</h1>
            </div>
          </div>

          <div className="user-brief">
            <img
              src={form.foto_perfil || placeholder}
              alt={form.nome || 'Usuário'}
              className="user-avatar-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholder;
              }}
            />
            <div className="user-name-stack">
              <span className="title">{form.nome || 'Usuário'}</span>
              <span className="subtitle">{form.email || 'usuario@email.com'}</span>
            </div>
          </div>

          <div className="donations">
            <div className="row">
              <span className="label">Total de doações</span>
              <span className="value">{donations.total}</span>
            </div>
            <div className="row">
              <span className="label">Este ano</span>
              <span className="value">{donations.ano}</span>
            </div>
          </div>

          <div className="nav-simple">
            <button onClick={() => navigate('/home')}>Home</button>
            <button onClick={() => navigate('/saiba-mais')}>Notícias</button>
          </div>
        </div>
      </header>

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
        <button className="logout" onClick={handleLogoutClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sair
        </button>
      </div>

      {/* Modal de Logout */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user?.nome}
      />
    </div>
  );
}

export default Perfil;
