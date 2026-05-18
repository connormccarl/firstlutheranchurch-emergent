"use client";
import React, { useState } from "react";
import { LockKeyhole, Loader2 } from "lucide-react";

export interface PasswordGateProps {
  /** Endpoint that accepts { password } and returns { ok: true } on success */
  loginEndpoint?: string;
  /** Where to send the user after a successful login */
  onSuccess?: () => void;
  /** Header text */
  title?: string;
  /** Subtitle / hint */
  subtitle?: string;
}

export function PasswordGate({
  loginEndpoint = "/api/admin/login",
  onSuccess,
  title = "Admin Access",
  subtitle = "Enter the admin password to continue.",
}: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(loginEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || "Incorrect password");
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-testid="cms-password-gate"
      className="min-h-screen flex items-center justify-center bg-slate-900 px-6"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <LockKeyhole className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">{title}</h1>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>

        <label className="block text-xs font-medium text-slate-300 mb-2">
          Password
        </label>
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid="cms-password-input"
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="••••••••"
        />

        {error && (
          <p
            className="mt-3 text-sm text-red-400"
            data-testid="cms-password-error"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          data-testid="cms-password-submit"
          className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-medium py-2 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? "Verifying…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}
