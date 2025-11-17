# Testing Guide

Test x402mcp locally and on testnet before demoing to degens.

## Phase 1: Local Testing (No Payments)

### 1. Start the MCP server
```bash
bun run index.ts
```
Server runs at `http://localhost:3000/mcp`

### 2. Run the example client
In a second terminal:
```bash
bun run example/client.ts
```

### 3. Verify
- Check your email inbox (`faceless20000pm@gmail.com`) - should receive a test email
- If you see the email, basic functionality works

## Phase 2: Testnet Payments (Real On-Chain Transactions)

### Prerequisites

**Get testnet funds:**

- **Base Sepolia USDC**: 
  1. Get Base Sepolia ETH from https://www.alchemy.com/faucets/base-sepolia
  2. Bridge USDC using Bridg3 or Superbridge
  
- **Solana Devnet SOL**: 
  1. Go to https://faucet.solana.com/
  2. Paste your Solana address: `9iA2rGG3b6vu4vCbvodi2qFh455CRu6cWEXirJPKmoeL`
  3. Airdrop 2 SOL

### Enable Payments

Edit `.env`:
```bash
DISABLE_PAYMENT=false
```

### Run Test with Real Payments
```bash
bun run example/client.ts
```

### Verify On-Chain Payments

**Base Sepolia:**
- Go to https://sepolia.basescan.org/
- Search for your address: `0x964Bf92a98871E475C40a5C5F3b39a7f0270dA48`
- Look for incoming USDC transactions (should see ~$0.005)

**Solana Devnet:**
- Go to https://explorer.solana.com/?cluster=devnet
- Search for your address: `9iA2rGG3b6vu4vCbvodi2qFh455CRu6cWEXirJPKmoeL`
- Look for incoming SOL transactions

## What to Test

- [ ] Email arrives correctly
- [ ] Subject line is preserved
- [ ] Body text is sent
- [ ] On-chain payment appears in block explorer within 30 seconds
- [ ] Payment amount matches `$0.005`
- [ ] Payment goes to correct wallet address

## Troubleshooting

**Email not arriving?**
- Check spam folder
- Verify `RECIPIENT_EMAIL` in `.env`
- Check Resend logs via `RESEND_API_KEY`

**Payment not showing?**
- Verify you have testnet funds
- Check `FACILITATOR_URL` is correct
- Look at server logs for payment errors

**Client errors?**
- Make sure server is running (`bun run index.ts`)
- Verify `MCP_SERVER_URL` points to running server
- Check private keys are valid
