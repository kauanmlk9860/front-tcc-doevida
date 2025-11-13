import './UserModal.css';

const UserModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal-header">
          <h3>Perfil do Usuário</h3>
          <button className="user-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="user-modal-content">
          <div className="user-modal-photo">
            <img
              src={user.foto_perfil || "https://via.placeholder.com/100x100/990410/ffffff?text=U"}
              alt="Foto de perfil"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/100x100/990410/ffffff?text=U";
              }}
            />
          </div>
          
          <div className="user-modal-info">
            <p><strong>Nome:</strong> {user.nome || 'Não informado'}</p>
            <p><strong>Email:</strong> {user.email || 'Não informado'}</p>
            <p><strong>CPF:</strong> {user.cpf || 'Não informado'}</p>
            <p><strong>Tipo Sanguíneo:</strong> {user.tipo_sanguineo || 'Não informado'}</p>
            <p><strong>Sexo:</strong> {user.sexo || 'Não informado'}</p>
            {user.data_nascimento && (
              <p><strong>Data de Nascimento:</strong> {user.data_nascimento}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;