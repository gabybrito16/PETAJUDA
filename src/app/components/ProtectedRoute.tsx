import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-primary font-bold">Carregando...</div>;
  return user ? <>{children}</> : <Navigate to="/entrar" replace />;
}
