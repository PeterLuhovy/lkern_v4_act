"""
Minimal FastAPI app for testing Dockerfile.backend.dev
"""
from fastapi import FastAPI

app = FastAPI(title="Test Service")

@app.get("/health")
async def health():
    return {"status": "ok", "service": "test-dockerfile"}
