// src/services/newsApi.js - API UOL (RSS Feed)
import axios from 'axios';

// URLs dos feeds RSS do UOL
const UOL_FEEDS = {
  geral: 'https://rss.uol.com.br/feed/noticias.xml',
  saude: 'https://rss.uol.com.br/feed/saude.xml',
  ciencia: 'https://rss.uol.com.br/feed/cienciaesaude.xml',
  tecnologia: 'https://rss.uol.com.br/feed/tecnologia.xml',
  ultimas: 'https://rss.uol.com.br/feed/ultimas.xml'
};

// Proxy CORS para acessar RSS
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Notícias de fallback caso a API não funcione
const FALLBACK_NEWS = [
  {
    id: 1,
    title: "Importância da Doação de Sangue Regular",
    description: "Doar sangue regularmente pode salvar até 4 vidas por doação. Entenda a importância deste ato solidário e como você pode ajudar.",
    url: "https://www.saude.gov.br/",
    image: "https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=800&q=80",
    published_at: new Date().toISOString(),
    source: { name: "Ministério da Saúde" }
  },
  {
    id: 2,
    title: "Campanha Nacional de Doação de Sangue",
    description: "Junho Vermelho mobiliza população para aumentar estoques de sangue em todo o país. Participe desta corrente do bem.",
    url: "https://www.saude.gov.br/",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80",
    published_at: new Date().toISOString(),
    source: { name: "Saúde Brasil" }
  },
  {
    id: 3,
    title: "Requisitos para Ser Doador de Sangue",
    description: "Conheça os critérios necessários para doar sangue e tire suas dúvidas sobre o processo de doação.",
    url: "https://www.saude.gov.br/",
    image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80",
    published_at: new Date().toISOString(),
    source: { name: "Portal Saúde" }
  },
  {
    id: 4,
    title: "Tecnologia Melhora Processo de Doação",
    description: "Novos equipamentos tornam doação de sangue mais rápida e segura para doadores e receptores.",
    url: "https://www.saude.gov.br/",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
    published_at: new Date().toISOString(),
    source: { name: "Inovação em Saúde" }
  },
  {
    id: 5,
    title: "Mitos e Verdades sobre Doação de Sangue",
    description: "Descubra os principais mitos sobre doação de sangue e entenda por que é seguro e importante doar.",
    url: "https://www.saude.gov.br/",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80",
    published_at: new Date().toISOString(),
    source: { name: "Educação em Saúde" }
  },
  {
    id: 6,
    title: "Hospitais Precisam de Doadores Urgentemente",
    description: "Estoques de sangue estão em níveis críticos. Sua doação pode fazer a diferença na vida de muitas pessoas.",
    url: "https://www.saude.gov.br/",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80",
    published_at: new Date().toISOString(),
    source: { name: "Rede Hospitalar" }
  }
];

/**
 * Função para parsear XML do RSS e converter para JSON
 */
function parseRSStoJSON(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  const items = xmlDoc.querySelectorAll('item');
  const news = [];
  
  items.forEach((item, index) => {
    const title = item.querySelector('title')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    
    // Extrair imagem do conteúdo encoded ou description
    let imageUrl = '';
    const content = item.querySelector('content\\:encoded, encoded')?.textContent || description;
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      imageUrl = imgMatch[1];
    }
    
    news.push({
      id: index + 1,
      title: title.trim(),
      description: description.replace(/<[^>]*>/g, '').trim().substring(0, 200) + '...',
      url: link.trim(),
      image: imageUrl || `https://images.unsplash.com/photo-${1584515933487 + index}?w=800&q=80`,
      published_at: pubDate,
      source: { name: 'UOL Notícias' }
    });
  });
  
  return news;
}

/**
 * Busca notícias do UOL por categoria
 * @param {string} category - Categoria (saude, ciencia, tecnologia, etc)
 * @returns {Promise} Resposta com as notícias
 */
export async function buscarNoticias(category = 'saude') {
  try {
    const feedUrl = UOL_FEEDS[category] || UOL_FEEDS.saude;
    const url = `${CORS_PROXY}${encodeURIComponent(feedUrl)}`;
    
    console.log('🌐 Buscando notícias do UOL:', category);
    console.log('🔗 Feed URL:', feedUrl);

    const response = await axios.get(url, { 
      timeout: 20000,
      headers: {
        'Accept': 'application/xml, text/xml, */*',
      }
    });
    
    console.log('✅ RSS recebido com sucesso');
    
    const news = parseRSStoJSON(response.data);
    console.log('📰 Notícias parseadas:', news.length);

    return {
      success: true,
      data: news,
      nextPage: null,
      totalResults: news.length,
      currentPage: 1,
      hasMore: false
    };
  } catch (error) {
    console.error('❌ Erro ao buscar notícias do UOL:', error);
    console.warn('⚠️ Usando notícias de fallback');
    return {
      success: true,
      data: FALLBACK_NEWS,
      nextPage: null,
      totalResults: FALLBACK_NEWS.length,
      currentPage: 1,
      hasMore: false,
      isFallback: true
    };
  }
}

/**
 * Busca notícias com query específica (mapeia para categorias do UOL)
 * @param {string} query - Termo de busca
 * @param {number} page - Número da página (não usado no RSS)
 * @returns {Promise} Resposta com as notícias
 */
export async function buscarNoticiasPorTermo(query, page = 1) {
  try {
    console.log('🔍 Buscando notícias por termo:', query);
    
    // Mapear query para categoria do UOL
    let category = 'geral';
    const queryLower = query?.toLowerCase() || '';
    
    if (queryLower.includes('saúde') || queryLower.includes('saude') || queryLower.includes('health') || queryLower.includes('medicine')) {
      category = 'saude';
    } else if (queryLower.includes('ciência') || queryLower.includes('ciencia') || queryLower.includes('science')) {
      category = 'ciencia';
    } else if (queryLower.includes('tecnologia') || queryLower.includes('technology')) {
      category = 'tecnologia';
    } else if (queryLower === '' || !query) {
      category = 'ultimas';
    }
    
    console.log('📂 Categoria mapeada:', category);
    
    const feedUrl = UOL_FEEDS[category] || UOL_FEEDS.geral;
    const url = `${CORS_PROXY}${encodeURIComponent(feedUrl)}`;
    
    console.log('🔗 Feed URL:', feedUrl);

    const response = await axios.get(url, { 
      timeout: 30000,
      headers: {
        'Accept': 'application/xml, text/xml, */*',
      }
    });
    
    console.log('✅ RSS recebido com sucesso');
    
    const news = parseRSStoJSON(response.data);
    console.log('📰 Notícias parseadas:', news.length);
    
    // Filtrar por termo de busca se fornecido
    let filteredNews = news;
    if (query && query.trim() && !['health', 'medicine', 'science', 'technology'].includes(queryLower)) {
      filteredNews = news.filter(n => 
        n.title.toLowerCase().includes(queryLower) || 
        n.description.toLowerCase().includes(queryLower)
      );
      console.log('🔎 Notícias filtradas:', filteredNews.length);
    }

    return {
      success: true,
      data: filteredNews.length > 0 ? filteredNews : news,
      nextPage: null,
      totalResults: filteredNews.length > 0 ? filteredNews.length : news.length,
      currentPage: 1,
      hasMore: false
    };
  } catch (error) {
    console.error('❌ Erro ao buscar notícias:', error);
    console.warn('⚠️ Usando notícias de fallback');
    return {
      success: true,
      data: FALLBACK_NEWS,
      nextPage: null,
      totalResults: FALLBACK_NEWS.length,
      currentPage: 1,
      hasMore: false,
      isFallback: true
    };
  }
}

/**
 * Busca notícias por categoria do UOL
 * @param {string} category - Categoria (saude, ciencia, tecnologia, etc)
 * @param {number} page - Número da página (não usado no RSS)
 * @returns {Promise} Resposta com as notícias
 */
export async function buscarNoticiasPorCategoria(category = 'saude', page = 1) {
  console.log('📂 Buscando notícias por categoria:', category);
  return buscarNoticias(category);
}

export default {
  buscarNoticias,
  buscarNoticiasPorTermo,
  buscarNoticiasPorCategoria
};
