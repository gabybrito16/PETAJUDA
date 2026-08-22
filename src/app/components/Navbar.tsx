import { PawPrint, Search, Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  variant?: "landing" | "app";
  searchValue?: string;
  onSearchChange?: (v: string) => void;
}

function Logo() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 shrink-0"
    >
      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
        <PawPrint size={20} className="text-white" />
      </div>
        <span className="text-xl font-black tracking-tight">
        <span className="text-foreground">PET</span>
        <span className="text-accent"> AJUDA</span>
      </span>
    </button>
  );
}

export function Navbar({ variant = "app", searchValue = "", onSearchChange }: NavbarProps) {
  const navigate = useNavigate();
  const { signOut, profile, user } = useAuth();
  const initials = (profile?.full_name || user?.email || "U").split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();

  if (variant === "landing") {
    return (
      <header className="w-full bg-white px-6 py-4 flex items-center justify-between">
        <Logo />
        <button
          onClick={() => navigate(user ? "/feed" : "/entrar")}
          className="bg-primary text-primary-foreground text-sm font-bold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors"
        >
          Ir para o Feed
        </button>
      </header>
    );
  }

  return (
    <header className="w-full bg-white border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
      <button
        type="button"
        onClick={() => navigate(user ? "/feed" : "/")}
        className="flex items-center gap-2 shrink-0"
      >
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
          <PawPrint size={20} className="text-white" />
        </div>
        <span className="text-xl font-black tracking-tight">
          <span className="text-foreground">PET</span>
          <span className="text-accent"> AJUDA</span>
        </span>
      </button>
      <div className="flex-1 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nome, bairro, espécie..."
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-muted rounded-full border border-border outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
      </div>
      <button
        onClick={() => navigate("/nova-publicacao")}
        className="flex items-center gap-1.5 bg-accent text-accent-foreground text-sm font-bold px-4 py-2 rounded-full hover:bg-orange-600 transition-colors shrink-0"
      >
        <Plus size={16} />
        Nova Publicação
      </button>
      <button onClick={() => navigate("/perfil")} title="Meu perfil" className="w-9 h-9 rounded-full bg-secondary text-primary flex items-center justify-center font-extrabold text-xs hover:bg-blue-100 transition-colors shrink-0">
        {initials}
      </button>
      <button onClick={async () => { await signOut(); navigate("/entrar", { replace: true }); }} title="Sair" className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors shrink-0">
        <LogOut size={18} />
      </button>
    </header>
  );
}
