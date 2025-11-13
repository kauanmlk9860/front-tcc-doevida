import { useState, useEffect } from 'react';

export const useHospitalPhoto = (hospital) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!hospital?.foto) {
      setPhotoUrl(null);
      return;
    }

    // Se for base64, usar diretamente
    if (hospital.foto.startsWith('data:')) {
      setPhotoUrl(hospital.foto);
      return;
    }

    // Se for URL completa, usar diretamente
    if (hospital.foto.startsWith('http')) {
      setPhotoUrl(hospital.foto);
      return;
    }

    // Se for blob URL, usar diretamente
    if (hospital.foto.startsWith('blob:')) {
      setPhotoUrl(hospital.foto);
      return;
    }

    // Tentar recuperar do sessionStorage
    const savedPhoto = sessionStorage.getItem('hospital_photo_blob');
    if (savedPhoto) {
      setPhotoUrl(savedPhoto);
      return;
    }

    // Se não encontrou nada, usar placeholder
    setPhotoUrl(null);
  }, [hospital?.foto]);

  const getPhotoUrl = (width = 600, height = 400) => {
    if (photoUrl) return photoUrl;
    
    // Placeholder SVG inline para hospital
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#990410"/>
        <text x="${width/2}" y="${height/2}" font-family="Arial, sans-serif" font-size="${Math.min(width, height)/10}" fill="white" text-anchor="middle">Hospital</text>
      </svg>
    `)}`;
  };

  return { photoUrl, getPhotoUrl };
};