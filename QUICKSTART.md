# Quick Start Guide

## 1. Install Dependencies

```bash
bun install
```

## 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set:
- `RESEND_API_KEY` - Get from [resend.com](https://resend.com)
- `RECIPIENT_EMAIL` - Your email address
- `OPENAI_API_KEY` - Get from [platform.openai.com](https://platform.openai.com)
- `DISABLE_PAYMENT=true` - For testing without payments

## 3. Run the Server

```bash
bun run start
```

Visit [http://localhost:3000](http://localhost:3000)

## 4. Test with Example Client

```bash
bun run example/client.ts
```

✅ Check your email inbox!

## Next Steps

- See [USAGE.md](./USAGE.md) for complete documentation
- Enable payments: Set `DISABLE_PAYMENT=false` and configure wallets
- Deploy to production: Use the Vercel button on homepage

---

**Need help?** Check [USAGE.md](./USAGE.md) for troubleshooting and advanced configuration.
