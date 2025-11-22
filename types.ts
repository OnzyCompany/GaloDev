export enum MediaType {
  VIDEO = 'video',
  IMAGE = 'image',
  GIF = 'gif'
}

export interface ProjectMedia {
  id: string;
  url: string;
  type: MediaType;
  description?: string;
  isMain: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon name
  active: boolean;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  categoryId: string;
  description: string;
  descriptionDetailed?: string;
  featured: boolean;
  createdAt: string;
  media: ProjectMedia[];
}

export interface Profile {
  name: string;
  title: string;
  shortBio: string;
  fullBio: string;
  avatarUrl: string;
  skills: string[];
  experienceYears: number;
}

export interface Contact {
  id: string;
  platform: string;
  username: string;
  link: string;
}