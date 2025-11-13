import { useUser } from '../../contexts/UserContext';

const UserPhotoDebug = () => {
  const { user, isLoggedIn } = useUser();

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Debug - Dados do Usuário:</h4>
      <p><strong>Nome:</strong> {user.nome || 'N/A'}</p>
      <p><strong>Email:</strong> {user.email || 'N/A'}</p>
      <p><strong>Foto URL:</strong> {user.foto_perfil ? 'Presente' : 'Ausente'}</p>
      {user.foto_perfil && (
        <div>
          <p><strong>Tipo da foto:</strong> {user.foto_perfil.startsWith('data:') ? 'Base64' : 'URL'}</p>
          <p><strong>Tamanho:</strong> {user.foto_perfil.length} chars</p>
          <img 
            src={user.foto_perfil} 
            alt="Preview" 
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid white',
              marginTop: '5px'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default UserPhotoDebug;