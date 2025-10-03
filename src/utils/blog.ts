import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

// Types redéfinis localement
export type BlogPost = CollectionEntry<'blog'>;

export interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

export interface ArticleMetadata {
  readingTime: number;
  wordCount: number;
  publishedISO: string;
  modifiedISO?: string;
  socialImage: string;
  canonicalURL: string;
}

export interface RelatedPost {
  slug: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  readingTime: number;
  pubDate: Date;
}

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

export interface FAQItem {
  q: string;
  a: string;
  id?: string;
}

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
}

export interface OrganizationSchema {
  '@type': string;
  name: string;
  logo: {
    '@type': string;
    url: string;
  };
}

export interface WebPageSchema {
  '@type': string;
  '@id': string;
}

export interface FAQPageSchema {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

// Configuration globale
const WORDS_PER_MINUTE = 200;
const EXCERPT_LENGTH = 150;
const MAX_RELATED_POSTS = 4;

/**
 * Récupère tous les articles publiés triés par date décroissante
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
 * Récupère un article par son slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllPosts();
  return posts.find((post: BlogPost) => post.slug === slug);
}

/**
 * Calcule le temps de lecture estimé en minutes
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
 * Calcule le nombre de mots
 */
export function getWordCount(content: string): number {
  if (!content || content.trim().length === 0) return 0;
  
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleanContent.split(' ').filter(word => word.length > 0).length;
}

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
 * Génère la table des matières à partir du contenu Markdown
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
 * Génère un extrait automatiquement
 */
export function generateExcerpt(content: string, length: number = EXCERPT_LENGTH): string {
  if (!content) return '';
  
  const lines = content.split('\n');
  const firstParagraph = lines.find(line => 
    line.trim() && 
    !line.startsWith('#') && 
    !line.startsWith('---') &&
    !line.startsWith(':::') &&
    line.length > 50
  );
  
  if (!firstParagraph) return '';
  
  const cleaned = firstParagraph
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`[^`]*`/g, '')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .trim();
  
  if (cleaned.length <= length) return cleaned;
  
  const truncated = cleaned.substring(0, length);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > length * 0.8 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}

/**
 * Récupère tous les tags uniques
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  posts.forEach((post: BlogPost) => {
    post.data.tags.forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Filtre les articles par tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post: BlogPost) => 
    post.data.tags.map((t: string) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

/**
 * Recherche d'articles
 */
export async function searchPosts(query: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const lowercaseQuery = query.toLowerCase();
  
  return posts.filter((post: BlogPost) =>
    post.data.title.toLowerCase().includes(lowercaseQuery) ||
    post.data.description.toLowerCase().includes(lowercaseQuery) ||
    post.data.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery)) ||
    (post.data.excerpt && post.data.excerpt.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Trouve des articles liés basés sur les tags
 */
export async function getRelatedPosts(
  currentPost: BlogPost, 
  maxResults: number = MAX_RELATED_POSTS
): Promise<RelatedPost[]> {
  const allPosts = await getAllPosts();
  
  const otherPosts = allPosts.filter((post: BlogPost) => post.slug !== currentPost.slug);
  
  const scoredPosts = otherPosts.map((post: BlogPost) => {
    const commonTags = post.data.tags.filter((tag: string) => 
      currentPost.data.tags.includes(tag)
    );
    return {
      post,
      score: commonTags.length
    };
  });
  
  const topPosts = scoredPosts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.post);
  
  if (topPosts.length < maxResults) {
    const remaining = maxResults - topPosts.length;
    const recentPosts = otherPosts
      .filter((post: BlogPost) => !topPosts.includes(post))
      .slice(0, remaining);
    topPosts.push(...recentPosts);
  }
  
  return topPosts.map((post: BlogPost) => ({
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    image: post.data.image,
    tags: post.data.tags,
    readingTime: post.data.readingTime || getReadingTime(post.body),
    pubDate: post.data.pubDate
  }));
}

/**
 * Génère la navigation article précédent/suivant
 */
export async function getArticleNavigation(currentSlug: string): Promise<ArticleNavigation> {
  const posts = await getAllPosts();
  const currentIndex = posts.findIndex((post: BlogPost) => post.slug === currentSlug);
  
  if (currentIndex === -1) return {};
  
  const navigation: ArticleNavigation = {};
  
  if (currentIndex > 0) {
    const nextPost = posts[currentIndex - 1];
    navigation.next = {
      slug: nextPost.slug,
      title: nextPost.data.title
    };
  }
  
  if (currentIndex < posts.length - 1) {
    const prevPost = posts[currentIndex + 1];
    navigation.previous = {
      slug: prevPost.slug,
      title: prevPost.data.title
    };
  }
  
  return navigation;
}

/**
 * Calcule les métadonnées complètes d'un article
 */
export function calculateArticleMetadata(
  post: BlogPost, 
  siteUrl: string = 'https://regisrolnin.com'
): ArticleMetadata {
  const readingTime = post.data.readingTime || getReadingTime(post.body);
  const wordCount = getWordCount(post.body);
  const publishedISO = post.data.pubDate.toISOString();
  const modifiedISO = post.data.lastModified?.toISOString();
  
  const socialImage = post.data.image || `${siteUrl}/images/regis.png`;
  const canonicalURL = post.data.canonical || `${siteUrl}/blog/${post.slug}`;
  
  return {
    readingTime,
    wordCount,
    publishedISO,
    modifiedISO,
    socialImage,
    canonicalURL
  };
}

/**
 * Génère le schema JSON-LD BlogPosting
 */
export function generateBlogPostingSchema(
  post: BlogPost,
  metadata: ArticleMetadata,
  siteUrl: string = 'https://regisrolnin.com'
): BlogPostingSchema {
  return {
    '@context': 'https://schema.org',
    '@type': post.data.schemaType || 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    image: metadata.socialImage,
    author: {
      '@type': 'Person',
      name: post.data.author,
      url: `${siteUrl}/a-propos`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Growth Expert',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/regis.png`
      }
    },
    datePublished: metadata.publishedISO,
    dateModified: metadata.modifiedISO || metadata.publishedISO,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': metadata.canonicalURL
    },
    keywords: post.data.tags.join(', '),
    articleSection: 'Business Growth',
    inLanguage: post.data.locale || 'fr-FR'
  };
}

/**
 * Génère le schema JSON-LD FAQ
 */
export function generateFAQSchema(faq: FAQItem[]): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item: FAQItem) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };
}