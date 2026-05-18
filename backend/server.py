"""
Transparent API proxy: forwards every request under /api/* to the Next.js
dev server on http://localhost:3000. All actual backend logic now lives in
the Next.js application (`/app/frontend/src/app/api/...`).

This proxy exists ONLY because the Kubernetes ingress is hard-wired to send
/api/* traffic to port 8001. In production the proxy can be removed and
the Next.js server can serve /api/* directly.
"""

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
import logging

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

    response_headers = _filter_headers(upstream.headers)
    return Response(
        content=upstream.content,
        status_code=upstream.status_code,
        headers=response_headers,
        media_type=upstream.headers.get("content-type"),
    )


@app.get("/")
async def root():
    return {"message": "FastAPI proxy → Next.js (/api/* forwarded to :3000)"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)
