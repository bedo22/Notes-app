import { createContext, useContext, useEffect, useState } from "react";
import type { AuthResponse, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<AuthResponse>;
    signOut: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<AuthResponse>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function init() {
            const {data: {user: currentUser},} = await supabase.auth.getUser();

            if(!mounted) return;
            setUser(currentUser ?? null);
            setLoading(false);
        }
    init();
    const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
    });
    return () => {
        mounted = false;
        listener?.subscription.unsubscribe();
    };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
    };

    const signInWithEmail = async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({email, password});
    };

    return (
    <AuthContext.Provider value={{ user, loading, signOut, signInWithEmail,signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};