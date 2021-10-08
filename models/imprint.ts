export interface Imprint {
  id: number;
  selph: Selph;
  user: User;
  type: string;
  prompt: string;
  transcript?: string;
  published: boolean;
  JID?: string;
  created_at: string;
  updated_at: string;
  sequence: Sequence;
  caption?: Caption;
  thumbnail?: string;
  transcription_status: string;
  reviewed: boolean;
}

interface Caption {
  id: number;
  name: string;
  alternativeText?: any;
  caption?: any;
  width?: any;
  height?: any;
  formats?: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: any;
  provider: string;
  provider_metadata?: any;
  created_at: string;
  updated_at: string;
}

interface Sequence {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width?: any;
  height?: any;
  formats?: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: any;
  provider: string;
  provider_metadata?: any;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  role: number;
  created_at: string;
  updated_at: string;
}

interface Selph {
  id: number;
  name: string;
  user: number;
  Description: string;
  JID: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  description?: any;
}
