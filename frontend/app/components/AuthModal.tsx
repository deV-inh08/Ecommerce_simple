"use client";
import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Mail, Lock, User, CheckCircle } from "lucide-react";

/* ─── Social button ──────────────────────────────────────── */
function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-3 py-2.5 text-sm font-medium rounded-xl transition-all hover:bg-gray-50 active:scale-[0.99]"
      style={{ border: "1.5px solid #e5e7eb", color: "#374151" }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─── Input field ────────────────────────────────────────── */
function InputField({
  id, label, type = "text", placeholder, value, onChange, icon, extra,
}: {
  id: string; label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  icon?: React.ReactNode; extra?: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-gray-600">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        )}
        <input
          id={id}
          type={isPass ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full py-2.5 text-sm rounded-xl outline-none transition-all"
          style={{
            border: "1.5px solid #e5e7eb",
            paddingLeft: icon ? "36px" : "14px",
            paddingRight: isPass ? "40px" : "14px",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#0d5c5c"; e.target.style.boxShadow = "0 0 0 3px rgba(13,92,92,0.08)"; }}
          onBlur={(e)  => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "none"; }}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {extra}
    </div>
  );
}

/* ─── Auth Modal ─────────────────────────────────────────── */
export default function AuthModal({
  initialMode = "login",
  onClose,
  onSuccess,
}: {
  initialMode?: "login" | "signup";
  onClose: () => void;
  onSuccess?: (user: { name: string; email: string }) => void;
}) {
  const [mode, setMode]           = useState<"login" | "signup">(initialMode);
  const [email, setEmail]         = useState("");
  const [name, setName]           = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [remember, setRemember]   = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [loading, setLoading]     = useState(false);

  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // Prevent scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const switchMode = (m: "login" | "signup") => {
    setMode(m); setError(""); setEmail(""); setPassword(""); setName(""); setConfirm("");
  };

  const validate = () => {
    if (!email.includes("@")) return "Please enter a valid email.";
    if (password.length < 6)  return "Password must be at least 6 characters.";
    if (mode === "signup") {
      if (!name.trim())         return "Please enter your name.";
      if (password !== confirm) return "Passwords do not match.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    // Simulate async auth (replace with real API call)
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      onSuccess?.({ name: name || email.split("@")[0], email });
      onClose();
    }, 1200);
  };

  const socialIcons = {
    facebook: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.93-1.956 1.886v2.286h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
    ),
    google: (
      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
    ),
    apple: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/></svg>
    ),
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        id="auth-modal"
        className="fixed z-50 bg-white rounded-2xl overflow-hidden"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(400px, 94vw)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.22)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #0d5c5c, #1a9090, #f5c518)" }} />

        {/* Close */}
        <button
          id="auth-close"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
          style={{ border: "1px solid #e5e7eb", backgroundColor: "#f5c518" }}
        >
          <X size={14} />
        </button>

        <div className="p-7">
          {/* Mode tabs */}
          <div className="flex items-center justify-between mb-6">
            {mode === "login" ? (
              <>
                <h2 className="text-lg font-extrabold text-gray-900">Sign In</h2>
                <button
                  id="switch-to-signup"
                  onClick={() => switchMode("signup")}
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: "#0d5c5c", color: "white" }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-extrabold text-gray-900">Create your account</h2>
                <button
                  id="switch-to-login"
                  onClick={() => switchMode("login")}
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-all"
                  style={{ border: "1.5px solid #0d5c5c", color: "#0d5c5c" }}
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <CheckCircle size={48} style={{ color: "#0d5c5c" }} />
              <p className="text-base font-bold text-gray-900">
                {mode === "login" ? "Welcome back!" : "Account created!"}
              </p>
              <p className="text-sm text-gray-400">Redirecting you now…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Fields */}
              <InputField
                id="auth-email" label="Email" type="email"
                placeholder="you@example.com"
                value={email} onChange={setEmail}
                icon={<Mail size={14} />}
              />

              {mode === "signup" && (
                <InputField
                  id="auth-name" label="Name"
                  placeholder="Your full name"
                  value={name} onChange={setName}
                  icon={<User size={14} />}
                />
              )}

              <InputField
                id="auth-password" label="Password" type="password"
                placeholder="At least 6 characters"
                value={password} onChange={setPassword}
                icon={<Lock size={14} />}
              />

              {mode === "signup" && (
                <InputField
                  id="auth-confirm" label="Confirm Password" type="password"
                  placeholder="Repeat your password"
                  value={confirm} onChange={setConfirm}
                  icon={<Lock size={14} />}
                />
              )}

              {/* Remember / Forgot */}
              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-[#0d5c5c]"
                    />
                    <span className="text-xs text-gray-500">Remember me</span>
                  </label>
                  <button type="button" className="text-xs font-semibold hover:underline" style={{ color: "#0d5c5c" }}>
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              {/* Submit */}
              <button
                id={mode === "login" ? "signin-btn" : "signup-btn"}
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-bold text-white rounded-xl transition-opacity hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ backgroundColor: "#0d5c5c" }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : mode === "login" ? "Sign In" : "Sign Up"}
              </button>

              {/* OR divider */}
              <div className="flex items-center gap-3">
                <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
              </div>

              {/* Social */}
              <div className="flex flex-col gap-2">
                <SocialBtn icon={socialIcons.facebook} label="Continue with Facebook" />
                <SocialBtn icon={socialIcons.google}   label="Continue with Google" />
                <SocialBtn icon={socialIcons.apple}    label="Continue with Apple" />
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
