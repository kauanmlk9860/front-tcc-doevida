const AZURE_CONFIG = {
  baseUrl: import.meta.env.VITE_AZURE_STORAGE_URL || 'https://doevidastorage.blob.core.windows.net/imagens-geral',
  sasToken: import.meta.env.VITE_AZURE_SAS_TOKEN || 'sp=racwdl&st=2024-12-20T00:00:00Z&se=2025-12-31T23:59:59Z&spr=https&sv=2024-11-04&sr=c&sig=PLACEHOLDER_TOKEN'
}

export const uploadImageToAzure = async (file, fileName) => {
  try {
    // Verificar se estamos em modo desenvolvimento
    if (import.meta.env.VITE_DEVELOPMENT_MODE === 'true') {
      console.log('Modo desenvolvimento: simulando upload')
      const timestamp = Date.now()
      const uniqueFileName = `dev_${timestamp}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      
      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        success: true,
        url: `https://via.placeholder.com/300x300/990410/ffffff?text=Foto+Perfil`,
        fileName: uniqueFileName
      }
    }
    
    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const uniqueFileName = `${timestamp}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    console.log('Iniciando upload:', uniqueFileName)
    
    // Verificar se o token SAS está válido
    if (!validateSasToken()) {
      throw new Error('Token SAS expirado ou inválido')
    }
    
    // URL completa com SAS token
    const uploadUrl = `${AZURE_CONFIG.baseUrl}/${uniqueFileName}?${AZURE_CONFIG.sasToken}`
    
    console.log('URL de upload:', uploadUrl.split('?')[0]) // Log sem o token
    
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type || 'image/jpeg',
        'x-ms-blob-content-type': file.type || 'image/jpeg'
      },
      body: file
    })
    
    console.log('Resposta do upload:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro detalhado:', errorText)
      
      // Tratar erros específicos
      if (response.status === 403) {
        throw new Error('Token SAS sem permissões ou expirado')
      } else if (response.status === 404) {
        throw new Error('Container não encontrado')
      } else {
        throw new Error(`Upload falhou: ${response.status} - ${errorText}`)
      }
    }
    
    // Retornar URL pública da imagem (sem SAS token)
    const publicUrl = `${AZURE_CONFIG.baseUrl}/${uniqueFileName}`
    console.log('Upload concluído:', publicUrl)
    
    return {
      success: true,
      url: publicUrl,
      fileName: uniqueFileName
    }
    
  } catch (error) {
    console.error('Erro no upload:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export const uploadBase64ToAzure = async (base64Data, fileName) => {
  try {
    // Converter base64 para blob
    const response = await fetch(base64Data)
    const blob = await response.blob()
    
    return await uploadImageToAzure(blob, fileName)
    
  } catch (error) {
    console.error('Erro ao converter base64:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Validar se o token SAS ainda está válido
export const validateSasToken = () => {
  try {
    // Em modo desenvolvimento, sempre retornar true
    if (import.meta.env.VITE_DEVELOPMENT_MODE === 'true') {
      return true
    }
    
    const params = new URLSearchParams(AZURE_CONFIG.sasToken)
    const expiryTime = params.get('se')
    
    if (!expiryTime) {
      console.warn('Token SAS sem data de expiração')
      return false
    }
    
    const expiry = new Date(expiryTime)
    const now = new Date()
    
    const isValid = expiry > now
    
    if (!isValid) {
      console.warn('Token SAS expirado:', {
        expiry: expiry.toISOString(),
        now: now.toISOString()
      })
    }
    
    return isValid
  } catch (error) {
    console.error('Erro ao validar token SAS:', error)
    return false
  }
}