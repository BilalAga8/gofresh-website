"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  adminLoading: boolean;
  isClientLoggedIn: boolean;
  user: User | null;
  logout: () => Promise<void>;
  authLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  setIsAdmin: () => null,
  adminLoading: true,
  isClientLoggedIn: false,
  user: null,
  logout: async () => {},
  authLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdminState] = useState<boolean>(false);
  const [adminLoading, setAdminLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsAdminState(localStorage.getItem("isAdmin") === "true");
    setAdminLoading(false);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setIsAdmin = (value: boolean) => {
    localStorage.setItem("isAdmin", String(value));
    setIsAdminState(value);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAdmin,
      setIsAdmin,
      adminLoading,
      isClientLoggedIn: !!user,
      user,
      logout,
      authLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAdmin, adminLoading, user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
