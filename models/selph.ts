import { User } from "./user";

export interface Selph {
  id: number;
  name: string;
  user: User;
  description: string;
  handle: string;
  JID: string;
  published: boolean;
  thumbnail?: string;
  created_at: Date;
  updated_at: Date;
}
