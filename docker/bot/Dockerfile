FROM python:3.13-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

ENV UV_COMPILE_BYTECODE=1

COPY pyproject.toml uv.lock ./

# Install dependencies without the project itself
# This creates a layer with just dependencies
RUN uv sync --frozen --no-install-project --no-dev --no-cache

COPY . .

RUN uv sync --frozen --no-dev --no-cache

ENV PYTHONUNBUFFERED=1
ENV SHOWDOWN_WS_URL=ws://ps-server:8000/showdown/websocket
ENV SHOWDOWN_AUTH_URL=http://login:3001/api/action.php?
ENV SHOWDOWN_USERNAME=Bot

# Use the virtualenv created by uv
ENV PATH="/app/.venv/bin:$PATH"

CMD ["python", "src/rl_player.py"]
