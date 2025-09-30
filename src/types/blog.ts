import type { CollectionEntry } from 'astro:content';

// Type principal pour les articles du blog
export type BlogPost = CollectionEntry<'blog'>;

// FAQ pour AEO (Answer Engine Optimization)
export interface FAQItem {
  q: string; // Question
  a: string; // Réponse
  id?: string; // Auto-généré pour les ancres
}

// Glossaire pour AIO (AI Optimization)
export interface GlossaryItem {
  term: string;
  definition: string;
  synonyms?: string[];
  relatedTerms?: string[];
}

// Structure pour la table des matières
export interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

// Navigation entre articles
export interface ArticleNavigation {
  previous?: {
    slug: string;
    title: string;
  };
  next?: {
    slug: string;
    title: string;
  };
}

// Métadonnées calculées pour un article
export interface ArticleMetadata {
  readingTime: number;
  wordCount: number;
  publishedISO: string;
  modifiedISO?: string;
  socialImage: string;
  canonicalURL: string;
}

// Données pour les articles liés/recommandés
export interface RelatedPost {
  slug: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  readingTime: number;
  pubDate: Date;
}

// Structure pour le partage social
export interface SocialShare {
  url: string;
  title: string;
  description: string;
  image?: string;
}

// Paramètres pour la génération automatique
export interface AutoGenerationConfig {
  generateReadingTime: boolean;
  generateExcerpt: boolean;
  generateRelatedPosts: boolean;
  generateKeywords: boolean;
  maxRelatedPosts: number;
  excerptLength: number;
}

// Types pour les callouts/composants Markdown
export type CalloutType = 
  | 'tip' 
  | 'warning' 
  | 'example' 
  | 'quote' 
  | 'stats' 
  | 'actionable'
  | 'note'
  | 'info';

// JSON-LD Schema structures
export interface BlogPostingSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image?: string;
  author: PersonSchema;
  publisher: OrganizationSchema;
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage: WebPageSchema;
  keywords: string;
  articleSection: string;
  inLanguage: string;
}

export interface PersonSchema {
  '@type': string;
  name: string;
  url?: string;
  image?: string;
}

export interface OrganizationSchema {
  '@type': string;
  name: string;
  logo: ImageSchema;
  url?: string;
}

export interface ImageSchema {
  '@type': string;
  url: string;
  width?: number;
  height?: number;
}

export interface WebPageSchema {
  '@type': string;
  '@id': string;
}

export interface FAQPageSchema {
  '@context': string;
  '@type': string;
  mainEntity: FAQSchema[];
}

export interface FAQSchema {
  '@type': string;
  name: string;
  acceptedAnswer: {
    '@type': string;
    text: string;
  };
}

// Configuration globale du blog
export interface BlogConfig {
  siteName: string;
  siteUrl: string;
  defaultAuthor: string;
  defaultImage: string;
  postsPerPage: number;
  enableRSS: boolean;
  enableSitemap: boolean;
  autoGeneration: AutoGenerationConfig;
}