# x402 Email MCP - Usage Guide

## Overview

This is a Model Context Protocol (MCP) server that monetizes email sending using on-chain payments. It allows AI agents to send emails, with each email requiring payment in USDC on either Base (EVM) or Solana networks.

**Turn spam into revenue** - Anyone who wants to send you an email through this service must pay first.

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) runtime installed
- [Resend](https://resend.com/) API key
- OpenAI API key
- (Optional) Crypto wallets with USDC for payments

### Installation

```bash
# Clone or download the repository
cd x402-email-mcp

# Install dependencies
bun install
```

---

## Configuration

### 1. Create `.env` file

Copy the example file and configure it:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your settings:

```bash
# Mode: testnet (base-sepolia/solana-devnet) or mainnet (base/solana)
MODE=testnet

# Set to "true" to disable payment requirement (for testing)
DISABLE_PAYMENT=false

# Your profile information (displayed on the web page)
TITLE="Your Name"
DESCRIPTION="Pay me to contact me via email"
IMAGE_URL=https://yourimage.com/photo.jpg
URLS=https://twitter.com/yourhandle,https://yourwebsite.com

# Email settings
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM=noreply@yourdomain.com
RECIPIENT_EMAIL=your.email@gmail.com

# Payment settings
FACILITATOR_URL=https://facilitator.payai.network
TOOL_PRICE_SEND_EMAIL="$0.005"

# Your payout addresses (where you receive payments)
EVM_ADDRESS=0xYourEthereumAddress
SVM_ADDRESS=YourSolanaAddress

# Example client configuration (for testing)
MCP_SERVER_URL=http://localhost:3000/mcp
EVM_PRIVATE_KEY=0xYourTestPrivateKey
SVM_PRIVATE_KEY=YourTestSolanaPrivateKey
EVM_NETWORK=base-sepolia
SVM_NETWORK=solana-devnet

# AI Services
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### 3. Get API Keys

**Resend API Key:**
1. Sign up at [resend.com](https://resend.com/)
2. Create an API key
3. Verify your domain or use their test domain: `onboarding@resend.dev`

**OpenAI API Key:**
1. Sign up at [platform.openai.com](https://platform.openai.com/)
2. Create an API key
3. Add credits to your account

---

## Running the Server

### Start the MCP Server

```bash
# Production mode
bun run start

# Development mode (auto-reload on changes)
bun run dev
```

The server will start at: `http://localhost:3000`

Visit `http://localhost:3000` in your browser to see your profile page with:
- Your profile information
- Payment-gated email service description
- MCP endpoint URL for clients

---

## Testing

### Option 1: Disable Payments (Recommended for Initial Testing)

1. Set in `.env`:
   ```bash
   DISABLE_PAYMENT=true
   ```

2. Restart the server:
   ```bash
   bun run start
   ```

3. Run the example client:
   ```bash
   bun run example/client.ts
   ```

You should see:
```
Step: initial Tool calls: 1
✅ Email sent successfully!
```

Check your `RECIPIENT_EMAIL` inbox for the test email.

### Option 2: Test with Payments (Testnet)

1. Set in `.env`:
   ```bash
   MODE=testnet
   DISABLE_PAYMENT=false
   EVM_NETWORK=base-sepolia
   SVM_NETWORK=solana-devnet
   ```

2. Fund your client wallets with testnet USDC:

   **Base Sepolia:**
   - Get Base Sepolia ETH: [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia)
   - Get Base Sepolia USDC: [Circle Faucet](https://faucet.circle.com/)
   
   **Solana Devnet:**
   ```bash
   solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet
   ```

3. Run the client with your funded wallet private keys:
   ```bash
   bun run example/client.ts
   ```

---

## Production Deployment

### Option 1: Deploy to Vercel

1. Click the deploy button on the homepage at `http://localhost:3000`
2. Or visit: [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/microchipgnu/x402-email-mcp)
3. Add all environment variables from your `.env` file
4. Deploy!

### Option 2: Self-Host

1. Set `MODE=mainnet` in `.env`
2. Configure mainnet addresses and networks:
   ```bash
   EVM_NETWORK=base
   SVM_NETWORK=solana
   EVM_ADDRESS=0xYourMainnetAddress
   SVM_ADDRESS=YourMainnetSolanaAddress
   ```
3. Deploy to your preferred hosting platform (VPS, Cloud Run, etc.)

---

## Using the Service

### As a Service Provider (Receiving Emails)

1. Deploy your MCP server
2. Share your public URL
3. People pay to send you emails
4. Payments go directly to your `EVM_ADDRESS` or `SVM_ADDRESS`

### As a Client (Sending Emails)

Use the MCP client in your AI application:

```typescript
import { makePaymentAwareClientTransport } from "mcpay/transport";
import { createSigner } from "x402/types";
import { experimental_createMCPClient, generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// Create signers for payments
const evmSigner = await createSigner("base", process.env.EVM_PRIVATE_KEY);
const solanaSigner = await createSigner("solana", process.env.SVM_PRIVATE_KEY);

// Connect to MCP server
const client = await experimental_createMCPClient({
    name: 'my-client',
    transport: makePaymentAwareClientTransport(
        "https://your-mcp-server.com/mcp",
        { evm: evmSigner, svm: solanaSigner }
    )
});

// Get available tools
const tools = await client.tools();

// Send email via AI
const response = await generateText({
    model: openai("gpt-4o-mini"),
    messages: [{ 
        role: "user", 
        content: "Send an email with subject 'Hello' and body 'Testing the service'" 
    }],
    tools: tools,
    toolChoice: "required"
});
```

---

## Pricing Configuration

Configure pricing in `.env`:

```bash
# Price per email (in USD)
TOOL_PRICE_SEND_EMAIL="$0.005"
```

The actual on-chain amount will be:
- `5000` (representing $0.005 in smallest units)
- Paid in USDC on your chosen network

---

## Troubleshooting

### Tools Not Being Called

**Symptom:** OpenAI returns empty responses with no tool calls

**Solution:** Version mismatch between AI SDK packages
```bash
# Check versions
bun pm ls | grep -E "(ai|@ai-sdk/openai)"

# Should show:
# ai@4.2.11
# @ai-sdk/openai@1.3.24

# If not, reinstall:
bun remove ai @ai-sdk/openai
bun add ai@4.2.11 @ai-sdk/openai@~1.3.24
```

### Payment Errors (HTTP 402)

**Symptom:** `Error: insufficient_funds`

**Solution:** Fund your client wallet with USDC
- Testnet: Use faucets (see "Test with Payments" section)
- Mainnet: Purchase USDC and transfer to your wallet

### Email Not Sending

**Symptom:** No errors but email doesn't arrive

**Checklist:**
1. Verify Resend API key is correct
2. Check `RESEND_FROM` domain is verified in Resend
3. Check spam folder
4. Look at Resend dashboard for delivery logs

---

## Architecture

### Tech Stack
- **Runtime:** Bun
- **Web Framework:** Hono
- **MCP:** mcp-handler
- **Payments:** mcpay + x402
- **Email:** Resend API
- **AI:** Vercel AI SDK

### Payment Flow
1. AI agent calls `send_email` tool
2. MCP server returns HTTP 402 with payment request
3. Client wallet signs and sends USDC transaction
4. Server verifies payment on-chain
5. Email is sent via Resend
6. Success response returned

---

## Support & Resources

- **GitHub Issues:** Report bugs or request features
- **MCP Documentation:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Resend Docs:** [resend.com/docs](https://resend.com/docs)
- **x402 Protocol:** Payment protocol for AI services

---

## License

See LICENSE file for details.
