"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || "Request failed");
      setSent(true);
      // In dev (no Zoho creds), the server returns the token so we can copy it
      if (data?.devToken) setDevToken(data.devToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-6">
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Forgot password?</h1>
            <p className="text-xs text-slate-400">We'll email you a reset link.</p>
          </div>
        </div>

        {sent ? (
          <div data-testid="forgot-sent" className="text-sm text-slate-300 space-y-3">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              If an account exists for <strong className="text-white">{email}</strong>, a reset link has been sent.
            </div>
            {devToken && (
              <div className="bg-slate-900 border border-amber-500/40 rounded-lg p-3 text-xs">
                <div className="text-amber-400 font-medium mb-1">Development mode</div>
                <p className="text-slate-400 mb-2">SMTP isn't configured, so here's the reset link directly:</p>
                <a
                  href={`/reset-password?token=${encodeURIComponent(devToken)}`}
                  className="text-amber-400 underline break-all"
                  data-testid="forgot-dev-link"
                >
                  /reset-password?token={devToken.slice(0, 12)}…
                </a>
              </div>
            )}
            <Link href="/admin" className="block text-center text-amber-400 hover:underline mt-3">
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="forgot-email-input"
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="you@example.com"
            />
            {error && (
              <p className="mt-3 text-sm text-red-400" data-testid="forgot-error">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !email}
              data-testid="forgot-submit"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-medium py-2 transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Sending…" : "Send reset link"}
            </button>
            <Link href="/admin" className="mt-4 block text-center text-xs text-slate-400 hover:text-amber-400">
              ← Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
