# Demo Script: How to Pitch x402mcp to Degens

## The Pitch (1 minute)

> "Your inbox gets spammed by bots. What if people had to **pay to email you**?"
>
> "x402mcp is a paid MCP server - AI agents pay $0.005 in stablecoin every time they send you an email. No payment = no spam. Only paid attention."
>
> "Watch: I'll send myself an email through my own endpoint, and you'll see the payment land on-chain in real-time."

## Live Demo (5 minutes)

### Setup (before the demo)
1. Have your Vercel deployment running
2. Have your landing page open in one browser tab
3. Have a block explorer (Solscan or Basescan) open in another tab with your wallet pre-loaded
4. Have `bun run example/client.ts` ready to run

### During Demo

**Step 1: Show the landing page**
```
"Here's my live MCP endpoint. Notice it shows:
- How much people pay ($0.005)
- Which wallet gets the money (that's mine, transparent)
- A button to test it live"
```

**Step 2: Run the client**
```bash
bun run example/client.ts
```
Say: "I'm sending myself an email right now through my AI agent. This triggers a payment."

**Step 3: Watch the payment appear**
- Email arrives in 2-5 seconds → check inbox
- Payment appears in block explorer in 10-30 seconds → refresh and show it

```
"See? Email landed. Now watch the blockchain..."
[refresh block explorer]
"There it is - $0.005 USDC from the facilitator to my wallet. 
No spam, no fake accounts, no attention without payment."
```

**Step 4: The ask**
```
"Want to monetize YOUR inbox? I can deploy this for you in 3 minutes.
Or if you want to learn how it works, here's the docs.

In testnet you pay fake USDC (free). You can see it work risk-free."
```

## Key Points to Emphasize

| Point | Why It Matters |
|-------|----------------|
| **On-chain payment** | Trustless, verifiable, no middleman |
| **Transparent wallet** | Shows you're not hiding who gets paid |
| **Instant** | Payment lands in seconds, not days |
| **$0.005 is cheap** | Degens don't mind paying this, spammers won't |
| **Testnet first** | They can try risk-free before mainnet |
| **Deploy their own** | Turns them from users into monetizers |

## Common Questions & Answers

**Q: Will I get spam once people know my endpoint?**
A: No. The $0.005 barrier stops spam bots. Humans will only email if they have a real reason.

**Q: What if someone pays $0.005 and sends me garbage?**
A: You're making money off their garbage. Plus you can change the price to $0.05 or $1 if needed.

**Q: Can I use mainnet instead of testnet?**
A: Yes. But start on testnet first to verify everything works. Mainnet means real money.

**Q: How do I deploy my own?**
A: Click "Deploy Your Own" on my site. It's a 3-minute Vercel setup. See DEPLOY.md.

**Q: Will my email address leak?**
A: It's on the landing page, so they'll see it anyway. The privacy is in the payment barrier.

**Q: Can I charge more than $0.005?**
A: Yes. $0.005 is just the default. You can set any price in the environment variables.

## Demo Variations

### For builders
Focus on the tech:
- Show them the MCP protocol
- Explain mcpay payment gating
- Talk about how to extend it (multiple tools, different prices)
- Reference the code: https://github.com/NoahCohenNow/x402mcp

### For crypto degens
Focus on the money:
- "You're farming USDC from your inbox"
- "Show me your wallet - I'll send you a test payment"
- "Let's see how much you can make if 10 people a day email you"
- "This works on mainnet with real USDC"

### For product people
Focus on the concept:
- "This is a paid API tier, but for your inbox"
- "It's spam prevention + monetization in one"
- "Think of it as a captcha that pays you"

## Gotchas to Avoid

❌ **Don't demo with mainnet USDC first**
- Use testnet to prove it works
- Then mention mainnet as the next step

❌ **Don't promise passive income**
- You make money per email, not passive
- Set expectations correctly

❌ **Don't assume they want to deploy**
- Some people just want to use your endpoint
- Tell them: "Test mine first, then decide if you want your own"

❌ **Don't forget to show the payment**
- The payment in the block explorer is the whole point
- If you don't show it, they might think it's fake

## Follow-Up (After Demo)

Send them:
1. Link to your live endpoint
2. DEPLOY.md (if they want their own)
3. TESTING.md (if they want to test on testnet)
4. Your Twitter/Discord (to stay in touch)

Checklist:
- [ ] They tested it and saw payment on-chain
- [ ] They understand the concept
- [ ] They know how to deploy their own (if interested)
- [ ] You have their Twitter/Discord to follow up

---

**Pro tip:** Record a 30-second video of the demo (landing page → send email → payment appears). Post on Twitter. That's your best marketing.
