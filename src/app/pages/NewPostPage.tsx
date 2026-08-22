import { Heart, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";

export function NewPostPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="app" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 py-10">
        <div className="mb-8 flex items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-foreground">Nova publicação</h1>
          <button
            type="button"
            onClick={() => navigate("/feed", { replace: false })}
            className="inline-flex items-center gap-2 border border-border rounded-xl px-4 py-2 text-sm font-bold hover:bg-muted"
          >
            Voltar ao feed
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Adoption card */}
          <button
            onClick={() => navigate("/nova-publicacao/adocao")}
            className="bg-white rounded-2xl border border-border p-7 text-left flex flex-col gap-4 hover:shadow-md hover:border-emerald-200 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <Heart size={24} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-foreground mb-1.5">Animal para adoção</h2>
              <p className="text-sm text-emerald-600 leading-relaxed">
                Divulgue um pet que procura um lar.
              </p>
            </div>
          </button>

          {/* Lost pet card */}
          <button
            onClick={() => navigate("/nova-publicacao/perdido")}
            className="bg-white rounded-2xl border border-border p-7 text-left flex flex-col gap-4 hover:shadow-md hover:border-orange-200 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
              <Search size={24} className="text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-foreground mb-1.5">Animal perdido</h2>
              <p className="text-sm text-orange-500 leading-relaxed">
                Ajude a encontrar um animal desaparecido.
              </p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
