

export const useHospitalPhoto = (hospital) => {
  const getPhotoUrl = (width = 600, height = 400) => {
    const placeholder = `data:image/svg+xml;base64,${btoa(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="#990410"/><text x="${width/2}" y="${height/2}" font-family="Arial, sans-serif" font-size="${Math.min(width, height)/10}" fill="white" text-anchor="middle">Hospital</text></svg>`)}`;
    
    if (!hospital?.foto) return placeholder;
    if (typeof hospital.foto !== 'string') return placeholder;
    if (hospital.foto.startsWith('data:') || hospital.foto.startsWith('http') || hospital.foto.startsWith('blob:')) {
      return hospital.foto;
    }
    
    const saved = sessionStorage.getItem('hospital_photo_blob');
    return saved || placeholder;
  };

  return { getPhotoUrl };
};