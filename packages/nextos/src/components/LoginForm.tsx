"use client";

/**
 * @module LoginForm
 *
 * Drop-in login UI for Auth.js v5 Credentials provider. Calls the
 * canonical Auth.js endpoint `/api/auth/callback/credentials` with a
 * `redirect: false` flag so the form can show inline errors instead of
 * forcing a full page navigation.
 *
 * `onSuccess` is invoked after a successful sign-in. The session cookie
 * is set by Auth.js itself — this component persists nothing on the client.
 */
import React, { useState } from "react";
import { LockKeyhole, Loader2 } from "lucide-react";

export interface LoginFormProps {
  /** Where to redirect after success. Optional — defaults to no redirect. */
  onSuccess?: () => void;
  /** Optional override for the Auth.js callback endpoint. Almost never needed. */
  endpoint?: string;
  title?: string;
  subtitle?: string;
  /** Show "Forgot password?" link to this URL. */
  forgotHref?: string;
  /** Show "Sign up" link to this URL. */
  registerHref?: string;
}

export function LoginForm({
  endpoint = "/api/auth/callback/credentials",
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
      // Auth.js POST flow:
      // 1. Fetch a CSRF token (Auth.js double-submits this).
      // 2. POST credentials + csrfToken as form-urlencoded with redirect=false.
      // 3. Auth.js sets `authjs.session-token` cookie on success.
      const csrfRes = await fetch("/api/auth/csrf", { credentials: "include" });
      const { csrfToken } = (await csrfRes.json()) as { csrfToken: string };

      const body = new URLSearchParams({
        csrfToken,
        email,
        password,
        redirect: "false",
        callbackUrl: "/admin",
        json: "true",
      });

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      // Auth.js returns { url } on success and { error, url } on failure
      // (with the error in the URL's `?error=` query param too).
      const data = await res.json().catch(() => ({}));
      if (!res.ok || (data && data.error)) {
        // Auth.js wraps server errors as "CredentialsSignin" by default.
        // Our authorize() throws a friendlier Error message — but Auth.js
        // hides it in production for safety, so we surface a generic
        // message client-side.
        throw new Error(
          data?.error === "CredentialsSignin"
            ? "Invalid email or password"
            : data?.error || "Login failed",
        );
      }
      // Force a full navigation so the freshly set HttpOnly session cookie
      // is sent with the next request. Calling `onSuccess()` and refetching
      // /api/auth/session via the same React render cycle can race the
      // cookie being committed to the browser jar.
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.assign("/admin");
      }
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
