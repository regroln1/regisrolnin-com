import { defineCollection, z } from 'astro:content';

// 🧩 Schéma pour les items FAQ (aligné avec FAQ.astro)
const faqItemSchema = z.object({
  question: z.string().describe('Question'),
  answer: z.string().describe('Réponse'),
});

// 🧩 Schéma pour les items du glossaire (aligné avec Glossary.astro)
const glossaryItemSchema = z.object({
  term: z.string().describe('Terme à définir'),
  definition: z.string().describe('Définition du terme'),
});

// 🧩 Schéma pour les réseaux sociaux de l'auteur
const authorSocialSchema = z.object({
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  website: z.string().url().optional(),
});

// 📰 Schéma principal pour la collection "blog"
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    // --- Champs de base obligatoires ---
    title: z.string()
      .min(10, 'Le titre doit faire au moins 10 caractères')
      .max(60, 'Le titre ne doit pas dépasser 60 caractères pour le SEO'),
    
    description: z.string()
      .min(120, 'La description doit faire au moins 120 caractères')
      .max(160, 'La description ne doit pas dépasser 160 caractères pour le SEO'),
    
    pubDate: z.coerce.date().describe('Date de publication'),
    
    tags: z.array(z.string())
      .min(1, 'Au moins un tag est requis')
      .max(5, 'Maximum 5 tags par article')
      .default([]),

    author: z.string().default('Régis Rolnin'),

    // --- Informations auteur (pour AuthorBio.astro) ---
    authorBio: z.string().optional().describe('Biographie de l\'auteur'),
    authorImage: z.string().optional().describe('Image de l\'auteur'),
    authorRole: z.string().optional().describe('Rôle/titre de l\'auteur'),
    authorSocial: authorSocialSchema.optional().describe('Réseaux sociaux de l\'auteur'),

    // --- Champs média et résumé ---
    image: z.string().optional().describe('URL de l\'image principale'),
    excerpt: z.string().max(300).optional().describe('Résumé court de l\'article'),

    // --- Draft / Publication ---
    draft: z.boolean().default(false).describe('Article en brouillon'),

    // --- Enrichissements de contenu ---
    faq: z.array(faqItemSchema)
      .max(10, 'Maximum 10 questions FAQ par article')
      .optional()
      .default([])
      .describe('Questions/réponses pour rich snippets'),
    
    glossary: z.array(glossaryItemSchema)
      .max(20, 'Maximum 20 termes de glossaire par article')
      .optional()
      .default([])
      .describe('Définitions de termes techniques'),

    // ✅ --- Réponse rapide pour AEO (nouvel ajout) ---
    quickAnswer: z.string()
      .max(200, 'La réponse rapide ne doit pas dépasser 200 caractères')
      .optional()
      .describe('Réponse courte (TL;DR) pour AEO / Answer Engine Optimization'),

    // --- SEO ---
    seoKeywords: z.array(z.string())
      .max(10)
      .optional()
      .describe('Mots-clés SEO spécifiques'),

    metaTitle: z.string()
      .max(60)
      .optional()
      .describe('Titre SEO différent du titre principal'),

    relatedPosts: z.array(z.string())
      .max(5)
      .optional()
      .describe('Slugs des articles recommandés'),

    // --- Métadonnées techniques ---
    readingTime: z.number().positive().optional().describe('Temps de lecture auto-calculé'),
    wordCount: z.number().positive().optional().describe('Nombre de mots auto-calculé'),
    lastModified: z.coerce.date().optional().describe('Date de dernière modification'),

    // --- Visibilité et priorité ---
    featured: z.boolean().default(false).describe('Article mis en avant'),
    priority: z.enum(['low', 'medium', 'high']).default('medium').describe('Priorité dans le sitemap'),

    // --- Localisation / langue ---
    locale: z.string().default('fr-FR').describe('Langue de l\'article'),
    geoTargeting: z.array(z.string()).default(['france']).describe('Ciblage géographique'),

    // --- SEO avancé ---
    canonical: z.string().optional().describe('URL canonique personnalisée'),
    noindex: z.boolean().default(false).describe('Exclure des moteurs de recherche'),

    // --- Catégorisation ---
    category: z.enum([
      'strategie',
      'marketing',
      'automatisation',
      'ia',
      'croissance',
      'outils',
      'etudes-cas',
      'guides'
    ]).optional().describe('Catégorie principale'),

    difficulty: z.enum(['debutant', 'intermediaire', 'avance'])
      .default('intermediaire')
      .describe('Niveau de difficulté de lecture'),

    // --- Schema.org ---
    schemaType: z.enum([
      'Article',
      'BlogPosting',
      'NewsArticle',
      'TechArticle',
      'HowTo'
    ]).default('BlogPosting').describe('Type de contenu schema.org'),
  }),
});

// 🚀 Export des collections
export const collections = { blog };
