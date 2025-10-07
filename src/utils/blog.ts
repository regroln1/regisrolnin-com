import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

// Type principal basé sur Astro
export type BlogPost = CollectionEntry<'blog'>;

// Interfaces pour TOC
export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

// Interfaces pour les nouveaux composants
export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AuthorSocial {
  linkedin?: string;
  twitter?: string;
  website?: string;
}

// Configuration
const WORDS_PER_MINUTE = 200;

/**
 * Formate une date en français
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Calcule le temps de lecture en minutes
 */
export function getReadingTime(content: string): number {
  if (!content || content.trim().length === 0) return 1;
  
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const wordCount = cleanContent.split(' ').filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/**
 * Génère la table des matières
 */
export function generateTableOfContents(content: string): TOCItem[] {
  if (!content) return [];
  
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const toc: TOCItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level: number = match[1].length;
    const text: string = match[2].trim();
    
    const id: string = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    toc.push({ id, text, level });
  }

  return toc;
}

/**
 * Récupère tous les articles publiés
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog');
  const publishedPosts = posts.filter((post: BlogPost) => !post.data.draft);
  return publishedPosts.sort((a: BlogPost, b: BlogPost) => 
    b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/**
 * Récupère les X derniers articles
 */
export async function getLatestPosts(count: number = 3): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}
/**
 * Récupère tous les tags uniques
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  posts.forEach((post: BlogPost) => {
    if (post.data.tags) {
      post.data.tags.forEach((tag: string) => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}