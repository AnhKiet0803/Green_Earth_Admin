import { LucideIcon } from 'lucide-react';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'planned';
  startDate: string;
  endDate: string;
  goal: number;
  raised: number;
}

export interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  participants: number;
  status: 'upcoming' | 'ongoing' | 'past';
}

export interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  content: string;
  status: 'published' | 'draft';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
}

export interface Sponsor {
  id: string;
  name: string;
  type: 'company' | 'organization';
  contribution: string;
  logo: string;
}

export interface Celebrity {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  campaignId: string;
}

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
}
