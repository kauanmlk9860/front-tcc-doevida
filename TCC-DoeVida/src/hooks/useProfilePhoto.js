

export const useProfilePhoto = (user) => {
  const getPhotoUrl = (size = 40) => {
    const placeholder = `data:image/svg+xml;base64,${btoa(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="#990410"/><text x="${size/2}" y="${size/2 + size/8}" font-family="Arial, sans-serif" font-size="${size/2.5}" fill="white" text-anchor="middle">U</text></svg>`)}`;
    
    if (!user?.foto_perfil) return placeholder;
    if (typeof user.foto_perfil !== 'string') return placeholder;
    if (user.foto_perfil.startsWith('data:') || user.foto_perfil.startsWith('http') || user.foto_perfil.startsWith('blob:')) {
      return user.foto_perfil;
    }
    
    const saved = sessionStorage.getItem('user_photo_blob');
    return saved || placeholder;
  };

  return { getPhotoUrl };
};