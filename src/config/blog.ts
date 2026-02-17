import type { BlogConfig } from '../types/blog';

/**
 * Configuration globale du système de blog
 */
export const blogConfig: BlogConfig = {
  // Informations du site
  siteName: 'Régis Rolnin | Consultant en Stratégie, Croissance Digitale & Automatisation',
  siteUrl: 'https://regisrolnin.com',
  defaultAuthor: 'Régis Rolnin',
  defaultImage: '/images/regis.png',

  // Pagination
  postsPerPage: 12,

  // Fonctionnalités
  enableRSS: true,
  enableSitemap: true,

  // Configuration auto-génération
  autoGeneration: {
    generateReadingTime: true,
    generateExcerpt: true,
    generateRelatedPosts: true,
    generateKeywords: false,
    maxRelatedPosts: 4,
    excerptLength: 150,
  },
};


/**
 * Configuration des catégories/tags avec couleurs
 */
export const categoryConfig = {
  'marketing': {
    name: 'Marketing',
    color: '#3B82F6',
    description: 'Stratégies marketing digitales'
  },
  'automatisation': {
    name: 'Automatisation', 
    color: '#8B5CF6',
    description: 'Processus d\'automatisation'
  },
  'ia': {
    name: 'Intelligence Artificielle',
    color: '#EC4899',
    description: 'IA appliquée aux entreprises'
  },
  'conversion': {
    name: 'Conversion',
    color: '#F59E0B',
    description: 'Optimisation des conversions'
  },
  'acquisition': {
    name: 'Acquisition',
    color: '#EF4444',
    description: 'Acquisition de clients'
  },
  'strategie': {
    name: 'Stratégie',
    color: '#10B981', 
    description: 'Stratégies de croissance'
  }
};

export default blogConfig;