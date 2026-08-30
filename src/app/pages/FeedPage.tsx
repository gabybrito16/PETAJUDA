import { useState, type ReactNode, useEffect } from "react";
import { MapPin, MessageCircle, Heart, Home } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { usePosts, Post } from "../context/PostsContext";
import { ImageWithFallback } from "../components/media/ImageWithFallback";
import { logPageAccess } from "../../lib/accessLog";
type Filter = "todos" | "adoption" | "lost";
function Badge({type}:{type:Post["type"]}) { return <span className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full ${type==="adoption"?"bg-emerald-500":"bg-orange-500"}`}>{type==="adoption"?"Adoção":"Perdido"}</span>; }
function Contact({post,label,icon}:{post:Post;label:string;icon?:ReactNode}) { const url=post.whatsapp?`https://wa.me/55${post.whatsapp.replace(/\D/g,"")}`:"#"; return <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex justify-center items-center gap-1.5 bg-emerald-500 text-white text-sm font-semibold px-3 py-2.5 rounded-xl hover:bg-emerald-600">{icon}<span>{label}</span></a>; }
function Card({post}:{post:Post}) { return <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col"><div className="relative bg-slate-100 h-52 flex items-center justify-center overflow-hidden">{post.photo?<ImageWithFallback src={post.photo} alt={post.name} className="w-full h-full object-cover"/>:<span className="text-muted-foreground text-sm">Sem foto</span>}<Badge type={post.type}/></div><div className="p-4 flex flex-col gap-2 flex-1"><h3 className="text-lg font-extrabold">{post.name}</h3><div className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin size={14}/>{post.neighborhood}</div><p className="text-sm text-primary font-medium line-clamp-2">{post.description}</p><div className="text-xs text-muted-foreground mt-auto pt-2 border-t border-border"><b>{post.author.initial}</b> {post.author.name} · {post.date}</div></div><div className="flex flex-wrap gap-2 px-4 pb-4"><Contact post={post} label="Entrar em contato" icon={<MessageCircle size={15}/>}/>{post.type==="adoption"&&<><Contact post={post} label="Quero adotar" icon={<Heart size={15}/>}/><Contact post={post} label="Oferecer lar temporário" icon={<Home size={15}/>}/></>}</div></article>; }
export function FeedPage() {
  const { posts, loading } = usePosts();
  const [filter, setFilter] = useState<Filter>("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    void logPageAccess("/feed");
  }, []);

  const visible = posts.filter(
    (p) =>
      (filter === "todos" || p.type === filter) &&
      [p.name, p.neighborhood, p.species, p.breed, p.description]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(search.toLowerCase()))
  );

  return <div className="min-h-screen bg-background flex flex-col"><Navbar variant="app" searchValue={search} onSearchChange={setSearch}/><main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-8"><div className="flex items-start justify-between mb-6 flex-wrap gap-3"><div><h1 className="text-3xl font-black">Feed</h1><p className="text-sm text-muted-foreground mt-0.5">{posts.length} publicação(ões)</p></div><div className="flex gap-2">{([['todos','Todos'],['adoption','Adoção'],['lost','Perdidos']] as [Filter,string][]).map(([key,label])=><button key={key} onClick={()=>setFilter(key)} className={`px-4 py-2 rounded-full text-sm font-bold ${filter===key?"bg-primary text-white":"bg-white border border-border"}`}>{label}</button>)}</div></div>{loading?<p className="text-center py-20 text-muted-foreground">Carregando publicações...</p>:visible.length===0?<p className="text-center py-20 text-muted-foreground">Ainda não há publicações.</p>:<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{visible.map(post=><Card key={post.id} post={post}/>)}</div>}</main></div>;
}

