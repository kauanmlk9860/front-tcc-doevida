import { useState, useEffect } from 'react';

export const useProfilePhoto = (user) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!user?.foto_perfil) {
      setPhotoUrl(null);
      return;
    }

    // Se for base64, usar diretamente
    if (user.foto_perfil.startsWith('data:')) {
      setPhotoUrl(user.foto_perfil);
      return;
    }

    // Se for URL completa, usar diretamente
    if (user.foto_perfil.startsWith('http')) {
      setPhotoUrl(user.foto_perfil);
      return;
    }

    // Se for blob URL, usar diretamente
    if (user.foto_perfil.startsWith('blob:')) {
      setPhotoUrl(user.foto_perfil);
      return;
    }

    // Tentar recuperar do sessionStorage
    const savedPhoto = sessionStorage.getItem('user_photo_blob');
    if (savedPhoto) {
      setPhotoUrl(savedPhoto);
      return;
    }

    // Se não encontrou nada, usar placeholder
    setPhotoUrl(null);
  }, [user?.foto_perfil]);

  const getPhotoUrl = (size = 40) => {
    if (photoUrl) return photoUrl;
    
    // Placeholder SVG inline
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="#990410"/>
        <text x="${size/2}" y="${size/2 + size/8}" font-family="Arial, sans-serif" font-size="${size/2.5}" fill="white" text-anchor="middle">U</text>
      </svg>
    `)}`;
  };

  return { photoUrl, getPhotoUrl };
};