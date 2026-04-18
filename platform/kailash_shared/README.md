# kailash-platform-shared

Shared library every KAILASH-AI service depends on.

```python
from kailash_shared import (
    BaseServiceSettings, build_app, ApiResponse, ErrorDetail,
    PlatformError, NotFoundError, ValidationError, UpstreamError,
    require_internal_token, configure_logging, get_logger,
)
```

`build_app(settings, routers=[...])` returns a FastAPI app with CORS,
request-id middleware, `/health`, `/`, `/metrics` and a platform error
handler already wired.
