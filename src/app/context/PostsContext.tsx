import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export type PostType = "adoption" | "lost";
export interface Post {
  id: string; type: PostType; name: string; neighborhood: string; description: string;
  author: { id?: string; name: string; initial: string }; date: string; photo?: string; species?: string;
  gender?: string; breed?: string; age?: string; whatsapp?: string; color?: string; lastSeen?: string;
}
interface PostsContextValue { posts: Post[]; loading: boolean; addPost: (post: Omit<Post, "id" | "date" | "author">) => Promise<string | null>; deletePost: (postId: string) => Promise<void>; refreshPosts: () => Promise<void>; }
const PostsContext = createContext<PostsContextValue | null>(null);

function toPost(row: any): Post {
  const created = new Date(row.created_at);
  return { id: row.id, type: row.type, name: row.name || "Sem nome", neighborhood: row.neighborhood, description: row.description,
    author: { id: row.user_id || undefined, name: row.author_name || "Usuário", initial: (row.author_name || "U").charAt(0).toUpperCase() },
    date: created.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }), photo: row.photo_url || undefined,
    species: row.species || undefined, gender: row.gender || undefined, breed: row.breed || undefined, age: row.age || undefined,
    whatsapp: row.whatsapp, color: row.color || undefined, lastSeen: row.last_seen || undefined };
}

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]); const [loading, setLoading] = useState(true);
  const refreshPosts = async () => { setLoading(true); const { data, error } = await supabase.from("feed_posts").select("*").order("created_at", { ascending: false }); if (!error) setPosts((data || []).map(toPost)); setLoading(false); };
  useEffect(() => { refreshPosts(); }, []);
  const addPost = async (post: Omit<Post, "id" | "date" | "author">) => {
    const { data: userData } = await supabase.auth.getUser(); if (!userData.user) return null;
    const { data, error } = await supabase.from("posts").insert({ user_id: userData.user.id, type: post.type, name: post.name, neighborhood: post.neighborhood, description: post.description, photo_url: post.photo || null, species: post.species || null, gender: post.gender || null, breed: post.breed || null, age: post.age || null, whatsapp: post.whatsapp, color: post.color || null, last_seen: post.lastSeen || null }).select().single();
    if (error) throw error; await refreshPosts(); return data.id;
  };
  const deletePost = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (!error) await refreshPosts();
  };
  return <PostsContext.Provider value={{ posts, loading, addPost, deletePost, refreshPosts }}>{children}</PostsContext.Provider>;
}
export function usePosts() { const ctx = useContext(PostsContext); if (!ctx) throw new Error("usePosts must be used inside PostsProvider"); return ctx; }
