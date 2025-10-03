import { defineCollection, z } from 'astro:content';

// Schema pour les items FAQ
const faqItemSchema = z.object({
  q: z.string().describe('Question'),
  a: z.string().describe('Réponse'),
  id: z.string().optional().describe('ID auto-généré pour les ancres')
});

// Schema pour les items du glossaire
const glossaryItemSchema = z.object({
  term: z.string().describe('Terme à définir'),
  definition: z.string().describe('Définition du terme'),
  synonyms: z.array(z.string()).optional().describe('Synonymes du terme'),
  relatedTerms: z.array(z.string()).optional().describe('Termes liés')
});

// Schema enrichi pour la collection blog
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // Champs obligatoires
    title: z.string()
      .min(10, 'Le titre doit faire au moins 10 caractères')
      .max(60, 'Le titre ne doit pas dépasser 60 caractères pour le SEO'),
    
    description: z.string()
      .min(120, 'La description doit faire au moins 120 caractères')
      .max(160, 'La description ne doit pas dépasser 160 caractères pour le SEO'),
    
    pubDate: z.date().describe('Date de publication'),
    
    tags: z.array(z.string())
      .min(1, 'Au moins un tag est requis')
      .max(5, 'Maximum 5 tags par article'),
    
    author: z.string().default('Régis Rolnin'),
    
    // Champs optionnels de base
    image: z.string().url().optional().describe('URL de l\'image principale'),
    
    excerpt: z.string()
      .max(300, 'L\'extrait ne doit pas dépasser 300 caractères')
      .optional()
      .describe('Résumé court de l\'article'),
    
    draft: z.boolean().default(false).describe('Article en brouillon'),
    
    // Enrichissements SEO/AEO
    quickAnswer: z.string()
      .max(200, 'La réponse rapide ne doit pas dépasser 200 caractères')
      .optional()
      .describe('Réponse courte pour AEO (Answer Engine Optimization)'),
    
    seoKeywords: z.array(z.string())
      .max(10, 'Maximum 10 mots-clés SEO')
      .optional()
      .describe('Mots-clés SEO spécifiques'),
    
    metaTitle: z.string()
      .max(60, 'Le meta titre ne doit pas dépasser 60 caractères')
      .optional()
      .describe('Titre SEO différent du titre d\'affichage'),
    
    // Contenu enrichi pour AEO/AIO
    faq: z.array(faqItemSchema)
      .max(10, 'Maximum 10 questions FAQ par article')
      .optional()
      .describe('Questions/réponses pour rich snippets'),
    
    glossary: z.array(glossaryItemSchema)
      .max(20, 'Maximum 20 termes de glossaire par article')
      .optional()
      .describe('Définitions de termes techniques'),
    
    relatedPosts: z.array(z.string())
      .max(5, 'Maximum 5 articles liés')
      .optional()
      .describe('Slugs des articles recommandés'),
    
    // Métadonnées techniques (auto-générées)
    readingTime: z.number()
      .positive()
      .optional()
      .describe('Temps de lecture en minutes (auto-calculé)'),
    
    wordCount: z.number()
      .positive()
      .optional()
      .describe('Nombre de mots (auto-calculé)'),
    
    lastModified: z.date()
      .optional()
      .describe('Date de dernière modification'),
    
    // Optimisations et configuration
    featured: z.boolean()
      .default(false)
      .describe('Article mis en avant'),
    
    priority: z.enum(['low', 'medium', 'high'])
      .default('medium')
      .describe('Priorité pour le sitemap'),
    
    locale: z.string()
      .default('fr-FR')
      .describe('Langue de l\'article'),
    
    // Configuration SEO avancée
    canonical: z.string().url()
      .optional()
      .describe('URL canonique si différente'),
    
    noindex: z.boolean()
      .default(false)
      .describe('Exclure des moteurs de recherche'),
    
    // Catégorisation avancée
    category: z.enum([
      'strategie',
      'marketing',
      'automatisation',
      'ia',
      'croissance',
      'outils',
      'etudes-cas',
      'guides'
    ]).optional().describe('Catégorie principale de l\'article'),
    
    difficulty: z.enum(['debutant', 'intermediaire', 'avance'])
      .default('intermediaire')
      .describe('Niveau de difficulté'),
    
    // Métadonnées régionales (GEO)
    geoTargeting: z.array(z.string())
      .default(['france'])
      .describe('Ciblage géographique'),
    
    // Schema.org enrichi
    schemaType: z.enum([
      'Article',
      'BlogPosting', 
      'NewsArticle',
      'TechArticle',
      'HowTo'
    ]).default('BlogPosting').describe('Type de schema.org')
    
  }).transform((data) => {
    // Transformations automatiques
    
    // Génération de l'excerpt si absent
    if (!data.excerpt && data.description) {
      data.excerpt = data.description.length > 200 
        ? data.description.substring(0, 197) + '...'
        : data.description;
    }
    
    // Génération du metaTitle si absent
    if (!data.metaTitle) {
      data.metaTitle = data.title.length > 60 
        ? data.title.substring(0, 57) + '...'
        : data.title;
    }
    
    // Génération automatique d'IDs pour FAQ
    if (data.faq) {
      data.faq = data.faq.map((item, index) => ({
        ...item,
        id: item.id || `faq-${index + 1}`
      }));
    }
    
    // Normalisation des tags (lowercase, sans espaces)
    data.tags = data.tags.map(tag => 
      tag.toLowerCase().replace(/\s+/g, '-')
    );
    
    // Mise à jour automatique de lastModified
    data.lastModified = new Date();
    
    return data;
  })
});

// Export des collections
export const collections = { 
  blog
};