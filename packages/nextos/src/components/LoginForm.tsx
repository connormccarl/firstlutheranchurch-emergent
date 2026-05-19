"use client";
import React, { useState } from "react";
import { LockKeyhole, Loader2 } from "lucide-react";

export interface LoginFormProps {
  /** Defaults to /api/auth/login */
  endpoint?: string;
  /** Where to redirect after success. Defaults to reloading the page. */
  onSuccess?: (user: { id: string; email: string; role: string }) => void;
  title?: string;
  subtitle?: string;
  /** Show "Forgot password?" link to this URL */
  forgotHref?: string;
  /** Show "Sign up" link to this URL */
  registerHref?: string;
}

export function LoginForm({
  endpoint = "/api/auth/login",
  onSuccess,
  title = "Sign in",
  subtitle = "Use your account credentials.",
  forgotHref,
  registerHref,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || "Login failed");
      onSuccess?.(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="nextos-login" className="min-h-screen flex items-center justify-center bg-slate-900 px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <LockKeyhole className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">{title}</h1>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>

        <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          data-testid="nextos-login-email"
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="you@example.com"
        />

        <label className="block text-xs font-medium text-slate-300 mt-4 mb-1">Password</label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          data-testid="nextos-login-password"
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="••••••••"
        />

        {error && (
          <p className="mt-3 text-sm text-red-400" data-testid="nextos-login-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email || !password}
          data-testid="nextos-login-submit"
          className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-medium py-2 transition-colors"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <div className="mt-4 flex justify-between text-xs text-slate-400">
          {forgotHref ? (
            <a href={forgotHref} className="hover:text-amber-400">Forgot password?</a>
          ) : <span />}
          {registerHref && (
            <a href={registerHref} className="hover:text-amber-400">Create account</a>
          )}
        </div>
      </form>
    </div>
  );
}
