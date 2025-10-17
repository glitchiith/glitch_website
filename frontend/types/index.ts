// types/project.ts



import { ChromaItem } from "@/components/ui/chroma-grid";

export interface Project extends ChromaItem {
  slug: string;
  year: string;
  genre: string;
}

export interface TeamMember {
  slug: string;
  name: string;
  tag: string;
  image: string;
  bio: string;
  email: string;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}



// types/blog.ts
export interface Blog {
  id: string;
  title: string;
  thumbnail: string;
  publishDate: string;
  readTime: string;
  categories: string[];
  description: string;
  slug: string; // URL slug for the blog post
  markdownFile: string; // Path to the markdown file
}

// For the individual blog page with parsed markdown
export interface BlogWithContent extends Blog {
  content: string; // Parsed markdown content
  frontmatter?: {
    [key: string]: any;
  };
}