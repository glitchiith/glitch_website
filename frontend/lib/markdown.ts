// lib/markdown.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { blogs } from '@/data/blogs';
import { Blog, BlogWithContent } from '@/types';

const postsDirectory = path.join(process.cwd(), 'content/blogs');

export async function getMarkdownContent(slug: string): Promise<BlogWithContent | null> {
  // Find the blog in our data
  const blog = blogs.find(b => b.slug === slug);
  if (!blog) return null;

  try {
    // Read the markdown file
    const fullPath = path.join(postsDirectory, blog.markdownFile);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    
    const contentHtml = processedContent.toString();

    // Combine the data with the id and contentHtml
    return {
      ...blog,
      content: contentHtml,
      frontmatter: matterResult.data,
    };
  } catch (error) {
    console.error(`Error reading markdown file for slug ${slug}:`, error);
    return null;
  }
}

export function getAllBlogSlugs(): string[] {
  return blogs.map(blog => blog.slug);
}

export function getBlogBySlug(slug: string): Blog | null {
  return blogs.find(blog => blog.slug === slug) || null;
}

export function getAllBlogs(): Blog[] {
  return blogs;
}

export function getBlogsByCategory(category: string): Blog[] {
  return blogs.filter(blog => 
    blog.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
  );
}

export function getPaginatedBlogs(page: number, limit: number = 6): {
  blogs: Blog[];
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBlogs = blogs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(blogs.length / limit);

  return {
    blogs: paginatedBlogs,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}