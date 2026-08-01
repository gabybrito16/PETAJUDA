import { Edit3, Mail, PawPrint, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";

export function ProfilePage() {
  const { user, profile } = useAuth();
  const { posts } = usePosts();
  const navigate = useNavigate();
  const name = profile?.full_name || user?.user_metadata?.full_name || "Usuário";
  const initials = name.split(" ").map((word: string) => word[0]).join("").slice(0, 2).toUpperCase();
  const ownPosts = posts.filter((post) => post.author.name === name);
  return <div className="min-h-screen bg-background"><Navbar />
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <section className="bg-white border border-border rounded-3xl p-7 md:p-10 flex flex-col sm:flex-row sm:items-center gap-6 shadow-sm">
        <div className="rounded-full bg-secondary text-primary grid place-items-center text-3xl font-black" style={{width: "6.25rem", height: "6.25rem"}}>{initials}</div>
        <div className="flex-1"><h1 className="text-2xl font-black">{name}</h1><p className="mt-2 flex items-center gap-2 text-muted-foreground"><Mail size={19}/>{user?.email}</p></div>
        <button className="inline-flex items-center justify-center gap-3 border border-border rounded-xl px-5 py-3 font-bold hover:bg-muted"><Edit3 size={18}/>Editar perfil</button>
      </section>
      <section className="mt-10"><div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-black">Minhas publicações</h2><button onClick={() => navigate("/nova-publicacao")} className="inline-flex items-center gap-2 bg-accent text-white font-bold rounded-xl px-5 py-3"><Plus size={18}/>Nova</button></div>
        <div className="mt-5 min-h-69 bg-white border border-border rounded-3xl grid place-items-center p-8 text-center">
          {ownPosts.length ? <p className="text-muted-foreground">Você possui {ownPosts.length} publicação(ões). Veja-as no feed.</p> : <div><div className="mx-auto mb-4 rounded-full bg-secondary text-primary grid place-items-center" style={{width:"4.25rem",height:"4.25rem"}}><PawPrint size={31}/></div><p className="text-muted-foreground">Você ainda não criou nenhuma publicação.</p><button onClick={() => navigate("/nova-publicacao")} className="mt-5 bg-primary text-white font-bold px-5 py-3 rounded-xl">Criar primeira publicação</button></div>}
        </div>
      </section>
    </main>
  </div>;
}
