import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { PawPrint } from "lucide-react";
import { supabase } from "../../lib/supabase";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    navigate("/feed", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background grid place-items-center p-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl border border-border shadow-sm p-7 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xl font-black">
          <span className="w-10 h-10 rounded-full bg-primary text-white grid place-items-center"><PawPrint size={21}/></span>
          PET <span className="text-accent -ml-2">AJUDA</span>
        </div>

        <h1 className="text-3xl font-black mt-2">Entrar</h1>

        <label className="text-sm font-bold">E-mail
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1.5 w-full p-3 border border-border rounded-xl font-normal" />
        </label>

        <label className="text-sm font-bold">Senha
          <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1.5 w-full p-3 border border-border rounded-xl font-normal" />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={busy} className="bg-primary text-white font-bold py-3 rounded-xl">{busy ? "Entrando..." : "Entrar"}</button>

        <p className="text-sm text-center">Não tem conta? <Link className="text-primary font-bold" to="/cadastro">Criar uma conta</Link></p>
      </form>
    </main>
  );
}
