import { useState, forwardRef, useImperativeHandle } from 'react';
import './PhotoUpload.css';

const PhotoUpload = forwardRef(({ 
  placeholder = "Clique para adicionar foto",
  className = "",
  disabled = false,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  onFileChange,
  ...props 
}, ref) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Expor métodos para o componente pai
  useImperativeHandle(ref, () => ({
    get file() {
      return selectedFile;
    },
    get preview() {
      return preview;
    },
    clear: () => {
      setSelectedFile(null);
      setPreview(null);
      setError('');
    },
    get hasFile() {
      return !!selectedFile;
    }
  }));

  const validateFile = (file) => {
    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return 'Por favor, selecione apenas arquivos de imagem';
    }

    // Verificar tamanho do arquivo
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return `O arquivo deve ter no máximo ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFileSelect = (file) => {
    setError('');
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Notificar componente pai
    if (onFileChange) {
      onFileChange(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    
    if (onFileChange) {
      onFileChange(null);
    }
  };

  return (
    <div className={`photo-upload-container ${className}`}>
      <div 
        className={`photo-upload-area ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''} ${error ? 'has-error' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="photo-preview">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="photo-overlay">
              <div className="photo-info">
                <span className="file-name">{selectedFile?.name}</span>
                <span className="file-size">
                  {(selectedFile?.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                type="button"
                className="remove-photo-btn"
                onClick={handleRemove}
                disabled={disabled}
                aria-label="Remover foto"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="photo-upload-content">
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17,8 12,3 7,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="upload-text">
              <p className="upload-primary">{placeholder}</p>
              <p className="upload-secondary">
                Arraste uma imagem ou clique para selecionar
              </p>
              <p className="upload-formats">
                PNG, JPG, JPEG até {(maxSize / (1024 * 1024)).toFixed(1)}MB
              </p>
            </div>
          </div>
        )}
        
        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="photo-upload-input"
          {...props}
        />
      </div>
      
      {error && (
        <div className="photo-upload-error">
          {error}
        </div>
      )}
    </div>
  );
});

PhotoUpload.displayName = 'PhotoUpload';

export default PhotoUpload;
