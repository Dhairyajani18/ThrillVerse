import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from "react";

const API_URL = "http://127.0.0.1:8000";

interface AuthContextType {
  token: string | null;
  userProfile: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (payload: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  fetchWithAuth: (endpoint: string, options?: RequestInit) => Promise<Response>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [userProfile, setUserProfile] = useState<any | null>(() => {
    const stored = localStorage.getItem("user_profile");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Thread lock ref for token refresh queries in parallel
  const refreshPromiseRef = useRef<Promise<boolean> | null>(null);

  const verifyAndLoadProfile = useCallback(async (accessToken: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/profile/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
        localStorage.setItem("user_profile", JSON.stringify(data));
        const u = data.user || data;
        if (u.username) localStorage.setItem("username", u.username);
        if (u.email) localStorage.setItem("user_email", u.email);
        if (u.first_name) localStorage.setItem("first_name", u.first_name);
        if (u.last_name) localStorage.setItem("last_name", u.last_name);
        setToken(accessToken);
        return true;
      }
    } catch (e) {
      console.error("Error verifying profile:", e);
    }
    return false;
  }, []);

  const attemptRefresh = useCallback(async (): Promise<boolean> => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return false;

    const promise = (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        if (res.ok) {
          const data = await res.json();
          const newAccess = data.access;
          localStorage.setItem("token", newAccess);
          setToken(newAccess);

          return await verifyAndLoadProfile(newAccess);
        }
      } catch (e) {
        console.error("Error refreshing token:", e);
      } finally {
        refreshPromiseRef.current = null;
      }
      return false;
    })();

    refreshPromiseRef.current = promise;
    return promise;
  }, [verifyAndLoadProfile]);

  // Perform token verification on mount using try-catch-finally loading safeguard
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      try {
        if (storedToken) {
          const verified = await verifyAndLoadProfile(storedToken);
          if (verified) {
            return;
          }
          // Access token expired, attempt refresh
          const refreshed = await attemptRefresh();
          if (refreshed) {
            return;
          }
        }
        // No valid session
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        setToken(null);
        setUserProfile(null);
      } catch (e) {
        console.error("Auth initialization failed:", e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [verifyAndLoadProfile, attemptRefresh]);

  const refreshProfile = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      await verifyAndLoadProfile(currentToken);
    }
  }, [verifyAndLoadProfile]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.tokens.access);
        localStorage.setItem("refresh_token", data.tokens.refresh);
        setToken(data.tokens.access);

        await verifyAndLoadProfile(data.tokens.access);
        return { success: true };
      } else {
        return { success: false, error: data.detail || "Invalid credentials." };
      }
    } catch (e) {
      return { success: false, error: "Failed to connect to backend server." };
    }
  }, [verifyAndLoadProfile]);

  const register = useCallback(async (payload: any) => {
    try {
      const res = await fetch(`${API_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.tokens.access);
        localStorage.setItem("refresh_token", data.tokens.refresh);
        if (payload.username) localStorage.setItem("username", payload.username);
        if (payload.email) localStorage.setItem("user_email", payload.email);
        if (payload.first_name) localStorage.setItem("first_name", payload.first_name);
        if (payload.last_name) localStorage.setItem("last_name", payload.last_name);
        setToken(data.tokens.access);

        await verifyAndLoadProfile(data.tokens.access);
        return { success: true };
      } else {
        const errors = Object.entries(data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(" ") : val}`)
          .join(" ");
        return { success: false, error: errors || "Registration failed." };
      }
    } catch (e) {
      return { success: false, error: "Failed to connect to backend server." };
    }
  }, [verifyAndLoadProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");
    setToken(null);
    setUserProfile(null);
  }, []);

  const fetchWithAuth = useCallback(async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    let accessToken = localStorage.getItem("token");
    const headers = new Headers(options.headers || {});
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    options.headers = headers;

    let response = await fetch(`${API_URL}${endpoint}`, options);

    // If 401, attempt refresh token
    if (response.status === 401) {
      const refreshed = await attemptRefresh();
      if (refreshed) {
        const newAccess = localStorage.getItem("token");
        const retryHeaders = new Headers(options.headers);
        retryHeaders.set("Authorization", `Bearer ${newAccess}`);
        options.headers = retryHeaders;
        response = await fetch(`${API_URL}${endpoint}`, options);
      } else {
        logout();
      }
    }

    return response;
  }, [attemptRefresh, logout]);

  const contextValue = useMemo(() => ({
    token,
    userProfile,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    fetchWithAuth,
    refreshProfile,
  }), [
    token,
    userProfile,
    loading,
    login,
    register,
    logout,
    fetchWithAuth,
    refreshProfile,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
