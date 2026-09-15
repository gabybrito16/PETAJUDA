import { ArrowLeft, Edit3, Mail, PawPrint, Plus, Save, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";
import { logPageAccess } from "../../lib/accessLog";
import { supabase } from "../../lib/supabase";

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { posts, deletePost } = usePosts();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [form, setForm] = useState({ full_name: "", whatsapp: "", cpf: "", cep: "" });

  useEffect(() => {
    void logPageAccess("/perfil");
  }, []);
  const name = profile?.full_name || user?.user_metadata?.full_name || "Usuário";
  const initials = name.split(" ").map((word: string) => word[0]).join("").slice(0, 2).toUpperCase();
  const ownPosts = posts.filter((post) => post.author.id === user?.id);
  const handleDelete = async (postId: string) => {
    setDeletingId(postId);
    await deletePost(postId);
    setDeletingId(null);
  };
  const startEditing = () => {
    setForm({ full_name: profile?.full_name || name, whatsapp: profile?.whatsapp || "", cpf: profile?.cpf || "", cep: profile?.cep || "" });
    setProfileError("");
    setEditing(true);
  };
  const handleProfileChange = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (!form.full_name.trim()) {
      setProfileError("Informe seu nome.");
      return;
    }
    setSaving(true);
    setProfileError("");
    const { error } = await supabase.from("profiles").update({ full_name: form.full_name.trim(), whatsapp: form.whatsapp.trim(), cpf: form.cpf.trim(), cep: form.cep.trim() }).eq("id", user.id);
    if (error) setProfileError("Não foi possível salvar as alterações.");
    else {
      await refreshProfile();
      setEditing(false);
    }
    setSaving(false);
  };
  return <div className="min-h-screen bg-background"><Navbar />
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <section className="bg-white border border-border rounded-3xl p-7 md:p-10 flex flex-col sm:flex-row sm:items-center gap-6 shadow-sm">
        <div className="rounded-full bg-secondary text-primary grid place-items-center text-3xl font-black" style={{width: "6.25rem", height: "6.25rem"}}>{initials}</div>
        {editing ? <form onSubmit={saveProfile} className="flex-1 grid gap-3 sm:grid-cols-2">
          {([['full_name', 'Nome'], ['whatsapp', 'WhatsApp'], ['cpf', 'CPF'], ['cep', 'CEP']] as [keyof typeof form, string][]).map(([field, label]) => <label key={field} className="text-sm font-bold">{label}<input value={form[field]} onChange={(event) => handleProfileChange(field, event.target.value)} className="mt-1 w-full rounded-xl border border-border px-3 py-2 font-normal" /></label>)}
          {profileError && <p className="text-sm text-red-600 sm:col-span-2">{profileError}</p>}
          <div className="flex flex-wrap gap-2 sm:col-span-2"><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-bold text-white disabled:opacity-60"><Save size={17}/>{saving ? "Salvando..." : "Salvar"}</button><button type="button" onClick={() => setEditing(false)} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 font-bold hover:bg-muted"><X size={17}/>Cancelar</button></div>
        </form> : <><div className="flex-1"><h1 className="text-2xl font-black">{name}</h1><p className="mt-2 flex items-center gap-2 text-muted-foreground"><Mail size={19}/>{user?.email}</p></div><button onClick={startEditing} className="inline-flex items-center justify-center gap-3 border border-border rounded-xl px-5 py-3 font-bold hover:bg-muted"><Edit3 size={18}/>Editar perfil</button></>}
      </section>
      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">Minhas publicações</h2>
            <p className="mt-2 text-muted-foreground">Gerencie os posts que você publicou e volte para o feed quando quiser.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate("/feed")} className="inline-flex items-center gap-2 border border-border rounded-xl px-5 py-3 font-bold hover:bg-muted"><ArrowLeft size={18}/>Voltar ao feed</button>
            <button onClick={() => navigate("/nova-publicacao")} className="inline-flex items-center gap-2 bg-accent text-white font-bold rounded-xl px-5 py-3"><Plus size={18}/>Nova</button>
          </div>
        </div>
        <div className="mt-5 grid gap-4">
          {ownPosts.length ? ownPosts.map((post) => (
            <article key={post.id} className="bg-white border border-border rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{post.type === "adoption" ? "Adoção" : "Perdido"}</p>
                <h3 className="text-lg font-bold mt-2">{post.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{post.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => navigate("/feed")} className="inline-flex items-center gap-2 border border-border rounded-xl px-4 py-2 text-sm font-bold hover:bg-muted">Ver no feed</button>
                <button onClick={() => handleDelete(post.id)} disabled={deletingId === post.id} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white bg-destructive hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60">
                  <Trash size={16}/>{deletingId === post.id ? "Removendo" : "Apagar"}
                </button>
              </div>
            </article>
          )) : (
            <div className="min-h-69 bg-white border border-border rounded-3xl grid place-items-center p-8 text-center">
              <div className="mx-auto mb-4 rounded-full bg-secondary text-primary grid place-items-center" style={{width:"4.25rem",height:"4.25rem"}}><PawPrint size={31}/></div>
              <p className="text-muted-foreground">Você ainda não criou nenhuma publicação.</p>
              <button onClick={() => navigate("/nova-publicacao")} className="mt-5 bg-primary text-white font-bold px-5 py-3 rounded-xl">Criar primeira publicação</button>
            </div>
          )}
        </div>
      </section>
    </main>
  </div>;
}
