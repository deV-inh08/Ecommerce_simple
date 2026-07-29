"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api-client";
import { getToken, setToken, clearToken } from "../lib/token-store";
import { useStore } from "../store/useStoreZustand";
import type { AuthResponse, UserProfile } from "../lib/types";

/* ── Query keys ─────────────────────────────────────────── */
export const identityKeys = {
  me: ["me"] as const,
};

/* ── useMe ───────────────────────────────────────────────── */
export function useMe() {
  return useQuery<UserProfile>({
    queryKey: identityKeys.me,
    queryFn: async () => {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");
      return apiFetch<UserProfile>("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    enabled: !!getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

/* ── useLogin ────────────────────────────────────────────── */
export function useLogin() {
  const queryClient = useQueryClient();
  const setCurrentUser = useStore((s) => s.setCurrentUser);

  return useMutation<
    AuthResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: (body) =>
      apiFetch<AuthResponse>("/api/identity?action=login", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: async (data) => {
      setToken(data.accessToken);
      // Fetch user profile and update Zustand
      try {
        const profile = await apiFetch<UserProfile>("/api/auth/me", {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        setCurrentUser({ name: `${profile.firstName} ${profile.lastName}`, email: profile.email });
        queryClient.setQueryData(identityKeys.me, profile);
      } catch {
        // profile fetch failed, token still valid
      }
    },
  });
}

/* ── useRegister ─────────────────────────────────────────── */
export function useRegister() {
  const queryClient = useQueryClient();
  const setCurrentUser = useStore((s) => s.setCurrentUser);

  return useMutation<
    AuthResponse,
    Error,
    { email: string; password: string; firstName: string; lastName: string; phoneNumber?: string }
  >({
    mutationFn: (body) =>
      apiFetch<AuthResponse>("/api/identity?action=register", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: async (data) => {
      setToken(data.accessToken);
      try {
        const profile = await apiFetch<UserProfile>("/api/auth/me", {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        setCurrentUser({ name: `${profile.firstName} ${profile.lastName}`, email: profile.email });
        queryClient.setQueryData(identityKeys.me, profile);
      } catch {
        // ignore
      }
    },
  });
}

/* ── useLogout ───────────────────────────────────────────── */
export function useLogout() {
  const queryClient = useQueryClient();
  const setCurrentUser = useStore((s) => s.setCurrentUser);

  return useMutation<void, Error, void>({
    mutationFn: () =>
      apiFetch("/api/identity?action=logout", { method: "POST" }),
    onSettled: () => {
      clearToken();
      setCurrentUser(null);
      queryClient.removeQueries({ queryKey: identityKeys.me });
      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.removeQueries({ queryKey: ["orders"] });
    },
  });
}

/* ── useRefreshToken ─────────────────────────────────────── */
export function useRefreshToken() {
  return useMutation<AuthResponse, Error, void>({
    mutationFn: () =>
      apiFetch<AuthResponse>("/api/identity?action=refresh", { method: "POST" }),
    onSuccess: (data) => {
      setToken(data.accessToken);
    },
    onError: () => {
      clearToken();
    },
  });
}
