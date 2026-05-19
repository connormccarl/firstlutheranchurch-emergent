/**
 * Zoho Mail Send-Email integration with OAuth2 refresh-token flow.
 * Server-only. Cached access tokens, region-aware URLs.
 *
 * Required env vars:
 *   ZOHO_CLIENT_ID
 *   ZOHO_CLIENT_SECRET
 *   ZOHO_REFRESH_TOKEN
 *   ZOHO_ACCOUNT_ID
 *   ZOHO_FROM_ADDRESS
 *   ZOHO_REGION (com | eu | in | au — defaults to "com")
 *
 * If any required var is missing, sendEmail() falls back to logging the
 * message to stdout and returns ok: true (so flows don't break in dev).
 */

type Region = "com" | "eu" | "in" | "au";

const ACCOUNTS_BASE: Record<Region, string> = {
  com: "https://accounts.zoho.com",
  eu: "https://accounts.zoho.eu",
  in: "https://accounts.zoho.in",
  au: "https://accounts.zoho.com.au",
};
const MAIL_BASE: Record<Region, string> = {
  com: "https://mail.zoho.com",
  eu: "https://mail.zoho.eu",
  in: "https://mail.zoho.in",
  au: "https://mail.zoho.com.au",
};

function getRegion(): Region {
  const r = (process.env.ZOHO_REGION || "com").toLowerCase() as Region;
  return r in ACCOUNTS_BASE ? r : "com";
}

let cachedToken: string | null = null;
let cachedExpiresAt = 0;

async function refreshAccessToken(): Promise<string> {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Zoho not configured");
  }
  const url = `${ACCOUNTS_BASE[getRegion()]}/oauth/v2/token`;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    throw new Error(`Zoho token refresh failed: HTTP ${res.status}`);
  }
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("Zoho token response missing access_token");
  cachedToken = data.access_token;
  cachedExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;
  return cachedToken;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedExpiresAt - 60_000) return cachedToken;
  return refreshAccessToken();
}

function zohoConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN &&
      process.env.ZOHO_ACCOUNT_ID &&
      process.env.ZOHO_FROM_ADDRESS,
  );
}

export interface SendEmailResult {
  ok: boolean;
  messageId?: string;
  fallback?: "logged";
  error?: string;
}

export interface SendEmailOptions {
  subject: string;
  body: string;
  to: string;
  cc?: string;
  bcc?: string;
  html?: boolean;
  askReceipt?: boolean;
}

export async function sendEmail(opts: SendEmailOptions): Promise<SendEmailResult> {
  if (!zohoConfigured()) {
    console.log("[nextos:email] Zoho not configured — logging only");
    console.log(`To: ${opts.to}`);
    console.log(`Subject: ${opts.subject}`);
    console.log(`Body: ${opts.body}`);
    return { ok: true, fallback: "logged" };
  }
  try {
    const accessToken = await getAccessToken();
    const accountId = process.env.ZOHO_ACCOUNT_ID!;
    const url = `${MAIL_BASE[getRegion()]}/api/accounts/${accountId}/messages`;
    const payload: Record<string, string> = {
      fromAddress: process.env.ZOHO_FROM_ADDRESS!,
      toAddress: opts.to,
      subject: opts.subject,
      content: opts.body,
      mailFormat: opts.html ? "html" : "plaintext",
      askReceipt: opts.askReceipt ? "yes" : "no",
      encoding: "UTF-8",
    };
    if (opts.cc) payload.ccAddress = opts.cc;
    if (opts.bcc) payload.bccAddress = opts.bcc;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || (data?.status?.code && data.status.code !== 200)) {
      const errMsg = data ? JSON.stringify(data) : `HTTP ${res.status}`;
      return { ok: false, error: errMsg };
    }
    return { ok: true, messageId: data?.data?.messageId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
