import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

export interface Profile {
  id: string;
  full_name: string;
  whatsapp: string;
  cpf: string;
  cep: string;
  avatar_url: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (!error) setProfile(data as Profile | null);
      else setProfile(null);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    let ignore = false;

    const hydrateSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!ignore) {
          setSession(currentSession);
          setLoading(false);
        }
      } catch {
        if (!ignore) {
          setSession(null);
          setLoading(false);
        }
      }
    };

    hydrateSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!ignore) {
        setSession(nextSession);
        setLoading(false);
      }
    });

    return () => {
      ignore = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [session?.user.id]);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        profile,
        loading,
        refreshProfile,
        signOut: async () => {
          try {
            await supabase.auth.signOut();
          } finally {
            setSession(null);
            setProfile(null);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
