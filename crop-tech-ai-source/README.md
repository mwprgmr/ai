# Crop Tech AI Vercel Web Bundle

Use this bundle for Vercel deployments. Upload or import the `crop-tech-ai-source` folder, not the standalone `server.js` bundle.

## Deploy On Vercel

1. Create a new Vercel project from `crop-tech-ai-source`.
2. Keep the default framework preset as Next.js.
3. Set environment variables before deploying:

```env
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
AI_MODEL=anthropic/claude-sonnet-4.6
SEARCH_API_KEY=
WEATHER_API_KEY=
EXCHANGE_RATE_API_KEY=
```

Only `AI_GATEWAY_API_KEY` is required for chat. The other keys enable optional tools.

## Build Locally

```bash
npm install
npm run build
```

This source bundle intentionally excludes `node_modules`, `.next`, and standalone runtime output.
