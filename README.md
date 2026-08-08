# Crop Tech AI Web Bundle

This directory contains the deployable web bundle as a single archive:

```bash
crop-tech-ai-web-bundle.tar.gz
```

## Unpack

```bash
tar -xzf crop-tech-ai-web-bundle.tar.gz
cd crop-tech-ai
```

## Run

```bash
AI_GATEWAY_API_KEY=your_key node server.js
```

Optional runtime variables:

```env
AI_MODEL=anthropic/claude-sonnet-4.6
SEARCH_API_KEY=
WEATHER_API_KEY=
EXCHANGE_RATE_API_KEY=
PORT=3000
```
