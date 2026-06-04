"""
Transparent /api proxy — Emergent preview ONLY.

This FastAPI server exists for a single reason: the Emergent Kubernetes
ingress is hard-wired to forward every request matching `/api/*` to port
8001. The actual application is a Next.js 15 App Router project living in
/app/frontend (port 3000), and ALL backend logic — database access, auth,
sessions, CSRF, password reset, Zoho mail, CMS CRUD — has been migrated
into Next.js API route handlers under `/app/frontend/src/app/api/`.

So in the preview environment we run this minimal proxy that forwards
`/api/*` from :8001 → :3000.

# PRODUCTION (Vercel)
This file is NOT deployed. Vercel runs `next start` (or serverless) and
serves `/api/*` directly with no proxy. The `/app/backend` folder is
outside Vercel's project root (`/app/frontend`) so it's excluded by
default. See `/app/frontend/.vercelignore` for the explicit exclusion list.

# PRESERVED env keys (DO NOT REMOVE)
`/app/backend/.env` still contains `MONGO_URL` and `DB_NAME` because the
Emergent platform's protected-variable rules require these keys to exist
even when unused. The proxy itself never reads them.
"""

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
import logging

# Where the Next.js app is listening inside the same pod.
NEXT_ORIGIN = "http://localhost:3000"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api-proxy")

# A single shared client for connection re-use.
_client = httpx.AsyncClient(timeout=120.0, follow_redirects=False)


@app.on_event("shutdown")
async def _shutdown() -> None:
    await _client.aclose()


HOP_BY_HOP = {
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
    "host",
    "content-length",
    "content-encoding",
}


def _filter_headers(headers) -> dict:
    return {k: v for k, v in headers.items() if k.lower() not in HOP_BY_HOP}


@app.api_route(
    "/api/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
)
async def proxy(path: str, request: Request) -> Response:
    target = f"{NEXT_ORIGIN}/api/{path}"
    if request.url.query:
        target = f"{target}?{request.url.query}"

    body = await request.body()
    headers = _filter_headers(request.headers)
    # Auth.js consults `x-forwarded-host` / `x-forwarded-proto` to build the
    # callback URL it returns in 302 Location headers. Ingress already sets
    # these for inbound HTTP traffic, but FastAPI strips them when we
    # re-emit. Restore them explicitly so the upstream sees the *public*
    # host (e.g. miami-lutheran-app.preview.emergentagent.com), not the
    # internal `0.0.0.0:3000`.
    public_host = request.headers.get("x-forwarded-host") or request.headers.get("host")
    if public_host:
        headers["x-forwarded-host"] = public_host
    public_proto = request.headers.get("x-forwarded-proto") or "https"
    headers["x-forwarded-proto"] = public_proto

    try:
        upstream = await _client.request(
            request.method,
            target,
            content=body,
            headers=headers,
        )
    except Exception as e:  # noqa: BLE001
        logger.error("Proxy upstream failed for %s: %s", target, e)
        return Response(
            content=b'{"detail":"Upstream Next.js server unreachable"}',
            status_code=502,
            media_type="application/json",
        )

    # Preserve every header — including multiple Set-Cookie entries — by
    # writing the raw header list directly onto the FastAPI Response. A
    # plain dict would collapse repeated Set-Cookie headers into a single
    # comma-joined string, which breaks Auth.js (it sets the csrf-token,
    # callback-url, AND session-token cookies in a single response).
    response = Response(
        content=upstream.content,
        status_code=upstream.status_code,
        media_type=upstream.headers.get("content-type"),
    )
    raw_headers = []
    for key, value in upstream.headers.multi_items():
        if key.lower() in HOP_BY_HOP:
            continue
        raw_headers.append((key.encode("latin-1"), value.encode("latin-1")))
    response.raw_headers = raw_headers
    return response


@app.get("/")
async def root():
    return {"message": "FastAPI proxy → Next.js (/api/* forwarded to :3000)"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)
