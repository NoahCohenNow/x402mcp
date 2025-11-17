# x402mcp

> Turn spam into revenue. AI agents pay to email you.

A paid MCP (Model Context Protocol) server that monetizes your inbox by requiring AI agents to pay in USDC for every email they send. Built with the x402 protocol for trustless, on-chain payments.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NoahCohenNow/x402mcp)

## 🎯 What is this?

x402mcp is an MCP server that exposes a `send_email` tool protected by on-chain payment gates. AI agents must pay **$0.005 in USDC** (configurable) to send you an email. No payment = no spam. Only paid attention.

**Key Features:**
- 💰 Earn USDC from every AI-generated email
- 🔒 Payment-gated MCP tool via [mcpay](https://github.com/payai-network/mcpay)
- ⚡ Instant on-chain payment verification (Base/Solana)
- 🚫 Zero spam - only paid messages get through
- 🎨 Beautiful landing page with payment endpoint
- 🧪 Testnet support for risk-free testing

## 📋 Prerequisites

- [Bun](https://bun.sh) runtime (v1.0+)
- [Resend](https://resend.com) API key (free tier works)
- Wallet addresses for payments (EVM/Solana)
- (Optional) MCP-compatible AI client for testing

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/NoahCohenNow/x402mcp.git
cd x402mcp
bun install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```bash
# Mode: "testnet" for testing, "mainnet" for real USDC
MODE=testnet
DISABLE_PAYMENT=false

# Your info (shown on landing page)
TITLE=YourName
DESCRIPTION="Pay in USDC to reach me via AI agents."
IMAGE_URL=https://your-image-url.com/photo.jpg
URLS=https://x.com/yourhandle

# Email setup (get API key from resend.com)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM=noreply@yourdomain.com
RECIPIENT_EMAIL=you@example.com

# Payment settings
TOOL_PRICE_SEND_EMAIL="$0.005"
FACILITATOR_URL=https://facilitator.payai.network

# Your payout wallets
EVM_ADDRESS=0xYourEthereumAddress
SVM_ADDRESS=YourSolanaAddress
```

### 3. Run the Server

```bash
# Development mode (auto-reload on changes)
bun run dev

# Production mode
bun run start
```

Server runs at `http://localhost:3000`

- Landing page: `http://localhost:3000`
- MCP endpoint: `http://localhost:3000/mcp`

## 🧪 Testing

### Option 1: Use the Example Client

Configure client environment variables in `.env`:

```bash
# Client settings
MCP_SERVER_URL=http://localhost:3000/mcp
EVM_PRIVATE_KEY=0xYourPrivateKeyWithTestnetUSDC
SVM_PRIVATE_KEY=YourSolanaPrivateKeyWithTestnetUSDC
EVM_NETWORK=base-sepolia
SVM_NETWORK=solana-devnet
```

Run the example client:

```bash
bun run example/client.ts
```

This will:
1. Connect to your MCP server
2. Pay $0.005 in testnet USDC
3. Send an email via the `send_email` tool
4. Show payment confirmation

### Option 2: Use Cline or Other MCP Clients

Add your endpoint to Cline's MCP settings:

```json
{
  "mcpServers": {
    "x402-email": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

See [TESTING.md](TESTING.md) for detailed testing instructions.

## 📦 Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | API key from resend.com | `re_abc123...` |
| `RECIPIENT_EMAIL` | Your email (comma-separated for multiple) | `you@example.com` |
| `EVM_ADDRESS` | Your Ethereum/Base wallet | `0x123...` |
| `SVM_ADDRESS` | Your Solana wallet | `ABC123...` |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `MODE` | `testnet` | `testnet` or `mainnet` |
| `DISABLE_PAYMENT` | `false` | Set to `true` to disable payment (testing only) |
| `TOOL_PRICE_SEND_EMAIL` | `$0.005` | Price per email |
| `RESEND_FROM` | `no-reply@example.com` | From address |
| `FACILITATOR_URL` | `https://facilitator.payai.network` | Payment facilitator |
| `TITLE` | `x402mcp` | Name shown on landing page |
| `DESCRIPTION` | - | Description shown on landing page |
| `IMAGE_URL` | - | Profile image URL |
| `URLS` | - | Comma-separated links (Twitter, etc.) |

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NoahCohenNow/x402mcp)

1. Click the button above
2. Configure environment variables during setup
3. Deploy!

Your endpoint will be: `https://your-app.vercel.app/mcp`

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.

### Self-Hosting

You can run this on any platform that supports Bun:

```bash
# Install dependencies
bun install

# Set environment variables
export RESEND_API_KEY=...
export RECIPIENT_EMAIL=...
# ... (other vars)

# Run
bun run start
```

## 🎨 Landing Page

When users visit your deployed URL, they see a retro-styled landing page that displays:

- Your payment endpoint URL
- Price per email ($0.005 USDC)
- Your payout wallet addresses
- How the payment system works
- A "Deploy Your Own" button

The landing page is fully responsive and includes copy-to-clipboard functionality.

## 🔧 How It Works

```
[AI Agent] ---> [Your MCP Server] ---> [x402 Payment Gate] ---> [Resend Email]
                       |
                       v
              [On-chain Payment]
                       |
                       v
                 [Your Wallet]
```

1. AI agent calls `send_email` tool on your MCP endpoint
2. mcpay intercepts the request and requires payment
3. Agent pays $0.005 USDC to your wallet via x402 protocol
4. Payment is verified on-chain (Base or Solana)
5. Email is sent via Resend API
6. Agent receives confirmation

## 📖 MCP Tool API

### `send_email`

Sends an email to your configured recipient(s). Requires payment.

**Parameters:**
- `subject` (string, required): Email subject (1-200 chars)
- `body` (string, required): Email body

**Returns:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "Email queued to you@example.com with subject \"Hello\". Provider id: abc123"
    }
  ]
}
```

**Cost:** Configurable via `TOOL_PRICE_SEND_EMAIL` (default: $0.005)

## 💡 Use Cases

- **Personal inbox monetization**: Get paid for AI agent outreach
- **Premium support tier**: Charge for high-priority AI assistance
- **API monetization**: Turn any MCP tool into a paid service
- **Spam prevention**: Economic barrier stops low-value requests
- **Micropayment testing**: Experiment with pay-per-use AI tools

## 🛠️ Development

### Project Structure

```
x402mcp/
├── index.ts              # Main MCP server
├── example/
│   └── client.ts         # Example MCP client
├── package.json          # Dependencies
├── .env.example          # Environment template
├── AGENTS.md            # AI agent instructions
├── DEMO.md              # Demo script
├── DEPLOY.md            # Deployment guide
└── TESTING.md           # Testing guide
```

### Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Web Framework**: [Hono](https://hono.dev)
- **MCP Handler**: [mcp-handler](https://github.com/wong2/mcp-handler)
- **Payment Gates**: [mcpay](https://github.com/payai-network/mcpay)
- **Email**: [Resend](https://resend.com)
- **Blockchain**: [x402](https://github.com/payai-network/x402)

### Build Commands

```bash
# Install dependencies
bun install

# Start dev server (auto-reload)
bun run dev

# Start production server
bun run start

# Run example client
bun run example/client.ts

# Run tests
bun test
```

## 🔒 Security Notes

- **Private keys**: Never commit `.env` file. Use environment variables in production.
- **Testnet first**: Always test on testnet before mainnet.
- **Rate limiting**: Consider adding rate limits for production.
- **Email validation**: Resend validates email addresses automatically.
- **Idempotency**: Email sending uses idempotency keys to prevent duplicates.

## ⚠️ Version Requirements

**CRITICAL**: The AI SDK has strict version compatibility:
- `ai`: Must use `4.2.11` (NOT v5.x)
- `@ai-sdk/openai`: Must use `~1.3.24` (v1.x compatible with ai@4.x)
- Using incompatible versions will cause tools to be silently ignored

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test thoroughly (testnet + mainnet)
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **GitHub**: https://github.com/NoahCohenNow/x402mcp
- **Twitter**: https://x.com/x402mcp
- **x402 Protocol**: https://github.com/payai-network/x402
- **mcpay**: https://github.com/payai-network/mcpay
- **MCP Spec**: https://modelcontextprotocol.io

## 💬 Support

- Open an issue on GitHub
- DM [@x402mcp](https://x.com/x402mcp) on Twitter

---

**Made with ⚡ by the x402 community**
