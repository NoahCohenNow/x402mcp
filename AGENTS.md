# AGENTS.md

## Build / Lint / Test Commands
- `bun install` — Install dependencies
- `bun run index.ts` or `bun run start` — Start the MCP server (serves at http://localhost:3000/mcp)
- `bun run dev` — Start server in watch mode (auto-reloads on changes)
- `bun run example/client.ts` — Run the example MCP client
- `bun test` — Run tests (use `bun:test` framework)

## Critical Version Requirements
⚠️ **IMPORTANT**: The AI SDK has strict version compatibility requirements:
- `ai`: Must use `4.2.11` (NOT v5.x - uses different API)
- `@ai-sdk/openai`: Must use `~1.3.24` (v1.x compatible with ai@4.x)
- Using `@ai-sdk/openai@2.x` with `ai@4.x` will cause tools to be silently ignored by OpenAI
- Symptoms of version mismatch: OpenAI returns empty responses even with `toolChoice: "required"`

## Architecture & Structure
- **index.ts**: Main MCP server (Hono + mcpay + mcp-handler), exposes payment-gated `send_email` tool
- **example/client.ts**: Example MCP client using Vercel AI SDK
- **Tech Stack**: Bun runtime, Hono web framework, mcpay (payment gates), x402 (on-chain payments), Resend (email API), Vercel AI SDK (client)
- **Environment**: Bun auto-loads `.env` (RESEND_API_KEY, RECIPIENT_EMAIL, EVM_ADDRESS, SVM_ADDRESS, etc.)
- **Payment Model**: MODE=testnet (base-sepolia/solana-devnet) or mainnet (base/solana)

## Code Style & Conventions
- **Runtime**: Use Bun, not Node.js (see .cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc)
- **TypeScript**: Strict mode enabled, bundler resolution, no emitting, use ESNext features
- **Imports**: Use ESM (`import`/`export`), no `.env` libraries (Bun auto-loads)
- **Types**: Explicit types for external data (e.g., `ResendSendResponse`, `ResendErrorPayload`)
- **Error Handling**: Throw descriptive errors, use idempotency keys for external calls
- **Formatting**: Consistent indentation (4 spaces), no trailing commas in objects
