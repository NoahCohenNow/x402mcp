# Deploy Your Own x402mcp Server

Monetize your inbox in 3 minutes.

## Prerequisites

You'll need:
- GitHub account
- Vercel account (free)
- Resend API key (free)
- EVM address (MetaMask, etc.)
- Solana address (Phantom Wallet, etc.)

## Step 1: Get API Keys & Addresses

### Resend (Email)
1. Go to https://resend.com
2. Sign up (free)
3. Create API key
4. Verify your domain or use `onboarding@resend.dev`
5. Copy API key → save for later

### EVM Address
Use any EVM wallet (MetaMask, Coinbase Wallet, etc.):
- Network: Base, Ethereum, Polygon (any EVM chain)
- Copy your `0x...` address

### Solana Address
1. Install Phantom Wallet or use Solflare
2. Create/import a Solana wallet
3. Copy your address (starts with `9i...` or similar)

## Step 2: Deploy to Vercel

Click the magic button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NoahCohenNow/x402mcp&project-name=x402-email-mcp&repository-name=x402-email-mcp&env=RECIPIENT_EMAIL,RESEND_FROM,RESEND_API_KEY,EVM_ADDRESS,SVM_ADDRESS,TITLE,DESCRIPTION,IMAGE_URL,URLS)

### In the Vercel wizard, set:

| Variable | Value |
|----------|-------|
| `RECIPIENT_EMAIL` | Your email (where you want messages sent) |
| `RESEND_FROM` | `onboarding@resend.dev` or verified domain |
| `RESEND_API_KEY` | Your Resend API key |
| `EVM_ADDRESS` | Your MetaMask address `0x...` |
| `SVM_ADDRESS` | Your Solana address |
| `TITLE` | Your name or handle |
| `DESCRIPTION` | What you do (e.g., "Crypto dev, pay to email me") |
| `IMAGE_URL` | Your avatar/logo URL |
| `URLS` | Your Twitter/website (comma-separated) |

Hit **Deploy**.

## Step 3: Customize

After deploy:
1. You get a live URL: `https://x402mcp-xyz.vercel.app`
2. Your landing page is live
3. Your MCP endpoint: `https://x402mcp-xyz.vercel.app/mcp`

## Step 4: Test It

Use the example client:

```bash
git clone https://github.com/NoahCohenNow/x402mcp
cd x402mcp

# Update .env for testnet testing
cp .env.example .env
# Edit .env:
# - MCP_SERVER_URL=https://YOUR_VERCEL_URL/mcp
# - EVM_PRIVATE_KEY=your_testnet_pk
# - SVM_PRIVATE_KEY=your_testnet_pk

# Get testnet funds:
# - Base Sepolia USDC: https://www.alchemy.com/faucets/base-sepolia
# - Solana Devnet SOL: https://faucet.solana.com/

bun install
bun run example/client.ts
```

Check your inbox - you should see a test email arrive.

## Step 5: Share Your Live Endpoint

Give people your new landing page URL:
- They see YOUR wallet address (transparency builds trust)
- They can test sending you emails for $0.005
- They can deploy their own if they like it

## Customization

After deploy, you can change almost anything by updating Vercel environment variables:

- **Price**: Set `TOOL_PRICE_SEND_EMAIL="$0.01"` to charge more
- **Recipient**: Change `RECIPIENT_EMAIL` to send to multiple addresses
- **Branding**: Update `TITLE`, `DESCRIPTION`, `IMAGE_URL`, `URLS`
- **Networks**: Change to mainnet by setting `MODE=mainnet` (and using mainnet addresses)

## Mainnet (Real Money)

When ready to go live with real payments:

1. Get mainnet USDC (buy on Coinbase/Uniswap)
2. Update Vercel env:
   - `MODE=mainnet`
   - Use your mainnet wallet addresses
3. Redeploy
4. Your MCP endpoint now accepts real payments

## Troubleshooting

**Deploy fails?**
- Make sure you filled all required env variables
- Check Vercel build logs

**Emails not arriving?**
- Check spam folder
- Verify `RECIPIENT_EMAIL` is correct
- Check Resend dashboard for errors

**Payments not working?**
- Make sure you have testnet/mainnet funds
- Verify EVM and Solana addresses are correct
- Check `FACILITATOR_URL` (use default)

## Next Steps

- Test on testnet (see TESTING.md)
- Share with your network
- Monitor your earnings
- Adjust price if needed

---

**Questions?** Check README.md or USAGE.md for more details.
