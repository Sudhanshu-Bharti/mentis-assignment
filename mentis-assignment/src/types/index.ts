import type { PostFormInput } from "@/lib/validations/post";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export type PostFormData = PostFormInput;
