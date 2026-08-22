import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PostsProvider } from "./context/PostsContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { FeedPage } from "./pages/FeedPage";
import { NewPostPage } from "./pages/NewPostPage";
import { NewPostFormPage } from "./pages/NewPostFormPage";
import { ProfilePage } from "./pages/ProfilePage";
import { supabase } from "../lib/supabase";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-primary font-bold">Carregando...</div>;
  return user ? <Navigate to="/feed" replace /> : <>{children}</>;
}

function RootRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-primary font-bold">Carregando...</div>;
  return user ? <Navigate to="/feed" replace /> : <LandingPage />;
}

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const finalize = async () => {
      try {
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const search = new URLSearchParams(window.location.search);

        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");
        const code = search.get("code");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (!error) {
            navigate("/entrar", { replace: true });
            return;
          }
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            navigate("/entrar", { replace: true });
            return;
          }
        }

        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate("/entrar", { replace: true });
          return;
        }
      } catch {
        // noop
      }

      navigate("/entrar", { replace: true });
    };

    void finalize();
  }, [navigate]);

  return <div className="min-h-screen grid place-items-center text-primary font-bold">Confirmando conta...</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/entrar" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/cadastro" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
            <Route path="/nova-publicacao" element={<ProtectedRoute><NewPostPage /></ProtectedRoute>} />
            <Route path="/nova-publicacao/:tipo" element={<ProtectedRoute><NewPostFormPage /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </PostsProvider>
    </AuthProvider>
  );
}
