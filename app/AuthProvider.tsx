"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { User } from "@/lib/types";

type Role = User["role"];

export interface AuthUser
  extends Pick<User, "id" | "email" | "name" | "role"> {}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: { email: string; password: string }) => Promise<{
    ok: boolean;
    error?: string;
    user?: AuthUser;
    rolePath?: string;
  }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({
  preToken,
  initialUser,
  children,
}: {
  preToken: string | null;
  initialUser: AuthUser | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [token, setToken] = useState<string | null>(preToken);
  const [isLoading, setIsLoading] = useState(false);

  
  const normalizeRolePath = useCallback((r?: string | null) => {
    if (!r) return undefined;
    const s = String(r).toLowerCase();
    if (s === "event coordinator" || s === "coordinator") return "coordinator";
    if (s === "evaluator head" || s === "head") return "head";
    return s;
  }, []);

  const login = useCallback<AuthContextValue["login"]>(
    async ({ email, password }) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { ok: false, error: data?.message || "Invalid credentials" };
        }

        const receivedToken = data.data.token;
        // console.log("Login response data:", data);
        const receivedUser = data.data.user;
        if (!receivedToken || !receivedUser?.email) {
          return { ok: false, error: "Malformed login response" };
        }

        const nextUser: AuthUser = {
          id: receivedUser.id || "",
          email: receivedUser.email,
          name: receivedUser.name || receivedUser.email.split("@")[0],
          role: receivedUser.role as Role,
        };


        setUser(nextUser);
        setToken(receivedToken);

        const rolePath = normalizeRolePath(nextUser.role);
        return { ok: true, user: nextUser, rolePath };
      } catch (e) {
        return { ok: false, error: "Network error" };
      } finally {
        setIsLoading(false);
      }
    },
    [normalizeRolePath]
  );

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      setUser(null);
      setToken(null);
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  }, []);

  

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
