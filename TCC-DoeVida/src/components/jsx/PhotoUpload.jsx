import { useState, forwardRef, useImperativeHandle } from 'react';
import '../style/PhotoUpload.css';

const PhotoUpload = forwardRef(({ 
  placeholder = "Clique para adicionar foto",
  className = "",
  disabled = false,
  accept = "image/*",
  maxSize = 1 * 1024 * 1024, // 1MB
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
    },
    getBase64: () => {
      return new Promise((resolve, reject) => {
        if (!selectedFile) {
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result;
          
          // Validar tamanho do base64 (máximo ~200KB para ser seguro)
          const maxBase64Size = 200 * 1024; // 200KB
          if (base64.length > maxBase64Size) {
            reject(new Error('Imagem muito grande mesmo após compressão. Tente uma imagem menor.'));
            return;
          }
          
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('Erro ao processar imagem'));
        reader.readAsDataURL(selectedFile);
      });
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

  const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular novas dimensões mantendo proporção
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Configurar canvas
        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para blob comprimido
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file) => {
    setError('');
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Comprimir imagem
      const compressedFile = await compressImage(file);
      
      // Verificar se a compressão foi bem-sucedida
      if (!compressedFile) {
        setError('Erro ao processar a imagem');
        return;
      }

      // Criar um novo File object com o blob comprimido
      const finalFile = new File([compressedFile], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      setSelectedFile(finalFile);

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(finalFile);

      // Notificar componente pai
      if (onFileChange) {
        onFileChange(finalFile);
      }
    } catch (error) {
      setError('Erro ao processar a imagem');
      console.error('Erro na compressão:', error);
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
                PNG, JPG, JPEG até {(maxSize / (1024 * 1024)).toFixed(1)}MB (otimizada automaticamente)
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
