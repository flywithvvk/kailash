"""Shared auth dependency — validates X-Platform-Token header."""
from __future__ import annotations

import os
from fastapi import Header, HTTPException, status


def require_internal_token(
    x_platform_token: str | None = Header(default=None, alias="X-Platform-Token"),
) -> None:
    expected = os.environ.get("PLATFORM_INTERNAL_TOKEN")
    if not expected:
        return  # dev mode: no token configured
    if not x_platform_token or x_platform_token != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid or missing X-Platform-Token",
        )
