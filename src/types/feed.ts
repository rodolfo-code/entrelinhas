export interface Post {
  id: string;
  author: string;
  initials: string;
  role: string;
  time: string;
  text: string;
  quote?: string;
  book?: string;
  likes: number;
  comments: number;
  reposts: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export type CreatePostInput = Omit<
  Post,
  "id" | "time" | "likes" | "comments" | "reposts" | "isLiked" | "isSaved"
>;

export interface ReadingCircle {
  name: string;
  readers: number;
}
