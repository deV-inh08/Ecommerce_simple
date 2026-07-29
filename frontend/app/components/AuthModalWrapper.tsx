"use client";
import { useStore } from "../context/StoreContext";
import AuthModal from "./AuthModal";

export default function AuthModalWrapper() {
  const { authOpen, authMode, closeAuth, setCurrentUser } = useStore();
  if (!authOpen) return null;
  return (
    <AuthModal
      initialMode={authMode}
      onClose={closeAuth}
      onSuccess={(user) => {
        setCurrentUser(user);
        closeAuth();
      }}
    />
  );
}
