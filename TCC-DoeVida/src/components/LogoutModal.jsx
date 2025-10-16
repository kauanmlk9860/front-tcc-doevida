import './LogoutModal.css';

const LogoutModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="logout-modal-overlay" onClick={handleOverlayClick}>
      <div className="logout-modal-content" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
        <div className="logout-modal-header">
          <h2 id="logout-modal-title" className="logout-modal-title">
            Confirmar Saída
          </h2>
        </div>
        
        <div className="logout-modal-body">
          <div className="logout-modal-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <p className="logout-modal-message">
            {userName ? (
              <>Olá <strong>{userName}</strong>, tem certeza que deseja sair da sua conta?</>
            ) : (
              'Tem certeza que deseja sair da sua conta?'
            )}
          </p>
          
          <p className="logout-modal-submessage">
            Você precisará fazer login novamente para acessar sua conta.
          </p>
        </div>
        
        <div className="logout-modal-actions">
          <button 
            type="button" 
            className="logout-modal-btn logout-modal-btn--cancel"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className="logout-modal-btn logout-modal-btn--confirm"
            onClick={onConfirm}
          >
            Sim, Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
