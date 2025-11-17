import { Hono } from "hono";
import { createMcpHandler } from "mcp-handler";
import { withPayment } from "mcpay/handler";
import { z } from "zod";

type ResendSendResponse = { id?: string };
type ResendErrorPayload = { message?: string; error?: string };

const MODE = process.env.MODE || "testnet"; // testnet or mainnet
const DISABLE_PAYMENT = process.env.DISABLE_PAYMENT === "true"; // Set to "true" to disable payment requirement

// ENV (Bun auto-loads .env)
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "no-reply@example.com";
const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://facilitator.payai.network";
const TOOL_PRICE_SEND_EMAIL = process.env.TOOL_PRICE_SEND_EMAIL || "$0.005";

// Payout addresses from env with sensible defaults
const EVM_ADDRESS = process.env.EVM_ADDRESS || "0xc9343113c791cB5108112CFADa453Eef89a2E2A2";
const SVM_ADDRESS = process.env.SVM_ADDRESS || "4VQeAqyPxR9pELndskj38AprNj1btSgtaCrUci8N4Mdg";

// Comma-separated list is supported: "alice@example.com,bob@example.com"
const RECIPIENT_EMAILS = (process.env.RECIPIENT_EMAIL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// Optional Information section content
const INFO_TITLE = (process.env.TITLE || "").trim();
const IMAGE_URL = (process.env.IMAGE_URL || "").trim();
const INFO_DESCRIPTION = (process.env.DESCRIPTION || "").trim();
const INFO_URLS: string[] = (process.env.URLS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

if (RECIPIENT_EMAILS.length === 0) {
    console.warn(
        "[x402-mcp] Warning: RECIPIENT_EMAIL is not set. The send_email tool will throw until configured."
    );
}


const VERCEL_DEPLOY_URL = buildVercelDeployUrl();

async function sendEmailViaResend({
    to,
    subject,
    body,
    idempotencyKey,
}: {
    to: string[]; // allow multiple
    subject: string;
    body: string;
    idempotencyKey?: string;
}): Promise<ResendSendResponse> {
    if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
            ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
        },
        body: JSON.stringify({
            from: RESEND_FROM,
            to, // array supported by Resend
            subject,
            text: body,
        }),
    });

    const json = (await res.json().catch(() => ({}))) as unknown;
    if (!res.ok) {
        const err = (json || {}) as ResendErrorPayload;
        const msg = err.message || err.error || `Email provider error (${res.status})`;
        throw new Error(msg);
    }
    return (json as ResendSendResponse); // { id, ... }
}

const app = new Hono();

const base = createMcpHandler(
    (server) => {
        server.tool(
            "send_email",
            "Send an email to the preconfigured recipient(s) (paid).",
            {
                subject: z.string().min(1).max(200),
                body: z.string().min(1),
            },
            async ({ subject, body }) => {
                if (RECIPIENT_EMAILS.length === 0) {
                    throw new Error(
                        "Server not configured: set RECIPIENT_EMAIL in env (comma-separated for multiple)."
                    );
                }
                const idempotencyKey = crypto.randomUUID();
                const result = await sendEmailViaResend({
                    to: RECIPIENT_EMAILS,
                    subject,
                    body,
                    idempotencyKey,
                });

                return {
                    content: [
                        {
                            type: "text",
                            text: `Email queued to ${RECIPIENT_EMAILS.join(
                                ", "
                            )} with subject "${subject}". Provider id: ${result.id ?? "unknown"}.`,
                        },
                    ],
                };
            }
        );
    },
    {
        serverInfo: { name: `${INFO_TITLE} MCP Server`, version: "1.2.0" },
    }
);



const payTo = MODE === "testnet" ? {
    "base-sepolia": EVM_ADDRESS,
    "solana-devnet": SVM_ADDRESS,
} : {
    "base": EVM_ADDRESS,
    "solana": SVM_ADDRESS,
};

const paid = withPayment(base, {
    toolPricing: {
        send_email: TOOL_PRICE_SEND_EMAIL,
    },
    payTo,
    facilitator: { url: FACILITATOR_URL as `${string}://${string}` },
});

app.get("/", (c) => {
    return c.html(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${escapeHtml(INFO_TITLE || "x402mcp - Turn Spam Into Revenue")}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap" rel="stylesheet">
            
            <style>
                @tailwind base;
                @tailwind components;
                @tailwind utilities;

                body {
                    font-family: 'VT323', monospace;
                    background-color: #1a0b2e;
                    color: #d0f0d0;
                    overflow-x: hidden;
                }
                
                body::after {
                    content: "";
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: repeating-linear-gradient(
                        transparent,
                        transparent 1px,
                        rgba(0, 0, 0, 0.4) 1px,
                        rgba(0, 0, 0, 0.4) 3px
                    );
                    pointer-events: none;
                    z-index: 9999;
                    opacity: 0.3;
                }

                .text-glow-green {
                    text-shadow: 0 0 3px #39ff14, 0 0 5px #39ff14, 0 0 10px #39ff14;
                }
                .text-glow-pink {
                    text-shadow: 0 0 3px #ff007f, 0 0 5px #ff007f;
                }
                .text-glow-blue {
                    text-shadow: 0 0 3px #00bfff, 0 0 5px #00bfff;
                }

                .retro-window {
                    border: 2px solid #39ff14;
                    background: rgba(12, 5, 20, 0.5);
                    box-shadow: 4px 4px 0px #39ff14;
                    transition: all 0.2s ease;
                }

                .retro-window-titlebar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #39ff14;
                    color: #1a0b2e;
                    padding: 0.25rem 0.5rem;
                    font-family: 'Press Start 2P', sans-serif;
                    font-size: 0.75rem;
                    line-height: 1rem;
                }
                
                .retro-window-controls span {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border: 2px solid #1a0b2e;
                    margin-left: 4px;
                    background: #1a0b2e;
                    opacity: 0.5;
                }

                .retro-btn {
                    font-family: 'Press Start 2P', sans-serif;
                    font-size: 0.875rem;
                    border: 2px solid #ff007f;
                    background: transparent;
                    color: #ff007f;
                    padding: 0.75rem 1.25rem;
                    text-shadow: 0 0 5px #ff007f;
                    box-shadow: 3px 3px 0px #ff007f;
                    transition: all 0.1s ease-in-out;
                    cursor: pointer;
                }

                .retro-btn:hover {
                    background: #ff007f;
                    color: #1a0b2e;
                    text-shadow: none;
                    transform: translate(3px, 3px);
                    box-shadow: 0px 0px 0px #ff007f;
                }

                .typing {
                    width: 7ch;
                    white-space: nowrap;
                    overflow: hidden;
                    border-right: 4px solid #39ff14;
                    animation: typing 2s steps(7, end),
                                 blink-caret .75s step-end infinite;
                }
                
                @keyframes typing {
                    from { width: 0 }
                    to { width: 7ch }
                }

                @keyframes blink-caret {
                    from, to { border-color: transparent }
                    50% { border-color: #39ff14; }
                }

                .hidden-anim {
                    opacity: 0;
                    transform: translateY(40px);
                    filter: blur(5px);
                    transition: opacity 0.6s ease-out, transform 0.6s ease-out, filter 0.6s ease-out;
                }

                .show-anim {
                    opacity: 1;
                    transform: translateY(0);
                    filter: blur(0);
                }
            </style>

            <script>
                tailwind.config = {
                    theme: {
                        extend: {
                            fontFamily: {
                                display: ['"Press Start 2P"', 'sans-serif'],
                                terminal: ['VT323', 'monospace'],
                            },
                            colors: {
                                'retro-dark': '#1a0b2e',
                                'retro-green': '#39ff14',
                                'retro-pink': '#ff007f',
                                'retro-blue': '#00bfff',
                                'retro-text': '#d0f0d0',
                            },
                            animation: {
                                'text-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                'flicker': 'flicker 1s linear infinite',
                            },
                            keyframes: {
                                flicker: {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.8 },
                                }
                            }
                        }
                    }
                }
            </script>
        </head>

        <body class="min-h-screen p-4 sm:p-8">

            <div class="container mx-auto max-w-3xl flex flex-col items-center gap-12 sm:gap-16">

                <!-- HEADER -->
                <header class="flex flex-col items-center text-center mt-12 sm:mt-20">
                    <h1 class="typing font-display text-5xl sm:text-7xl text-retro-green text-glow-green mb-4">x402mcp</h1>
                    
                    <h2 class="font-terminal text-2xl sm:text-3xl text-retro-pink text-glow-pink animate-flicker mb-4">
                        Turn spam into revenue.
                    </h2>
                    
                    <p class="text-lg sm:text-xl max-w-lg mb-4">
                        Pay in <span class="text-retro-blue font-bold">USDC</span> to reach me via AI agents. Built with x402 protocol.
                    </p>
                    
                    <a href="https://x.com/x402mcp" target="_blank" rel="noopener" class="font-display text-retro-blue text-glow-blue text-lg hover:underline">
                        [x.com/x402mcp]
                    </a>
                </header>

                <!-- HOW IT WORKS -->
                <section class="retro-window w-full hidden-anim">
                    <div class="retro-window-titlebar">
                        <span>[== HOW_IT_WORKS.EXE ==]</span>
                        <div class="retro-window-controls"><span></span><span></span><span></span></div>
                    </div>
                    <div class="p-6 sm:p-8 text-lg">
                        <p class="mb-4">
                            AI agents pay <span class="text-retro-green font-bold text-glow-green text-xl">${TOOL_PRICE_SEND_EMAIL} in USDC</span> to send emails to ${escapeHtml(INFO_TITLE || "x402mcp")}.
                        </p>
                        <p class="mb-6">
                            Every message requires on-chain payment. No spam. Only paid attention.
                        </p>
                        <pre class="bg-black/50 border border-retro-green/50 p-4 rounded text-retro-green text-sm sm:text-base overflow-x-auto">
  [AI Agent]               [Your Inbox]
     |                         ^
     |---(${TOOL_PRICE_SEND_EMAIL} USDC)--------> |
     |                         |
  [x402mcp]--------------------|
  (Payment Verification)
    
  [Spammer]                  [Your Inbox]
     |                         |
     |---(No Pay)------------> X (Blocked)
     |                         
  [x402mcp]--------------------|
  (Payment Verification)
                        </pre>
                    </div>
                </section>

                <!-- TRY IT NOW -->
                <section class="retro-window w-full hidden-anim">
                    <div class="retro-window-titlebar">
                        <span>[== MCP_ENDPOINT_LIVE ==]</span>
                        <div class="retro-window-controls"><span></span><span></span><span></span></div>
                    </div>
                    <div class="p-6 sm:p-8">
                        <h3 class="font-display text-2xl text-retro-green text-glow-green mb-4">🧪 TEST IT LIVE (PAY ${TOOL_PRICE_SEND_EMAIL})</h3>
                        <p class="text-lg mb-6">
                            Connect your AI agent to this endpoint. Your payment lands on-chain in seconds.
                        </p>
                        
                        <p class="text-base mb-4 text-retro-blue font-bold">
                            💰 Payments go to:
                        </p>
                        <div class="bg-black border border-retro-blue/50 p-3 mb-4 text-sm text-retro-blue break-all">
                            <span class="text-retro-green">Solana:</span> ${escapeHtml(SVM_ADDRESS)}
                        </div>
                        
                        <p class="text-base mb-4">
                            Copy this endpoint and use it in your AI client:
                        </p>
                        
                        <div class="bg-black border-2 border-retro-blue p-4 relative group">
                            <pre class="text-retro-blue text-glow-blue text-lg break-all" id="endpoint-url"></pre>
                            <button id="copyButton" class="absolute top-2 right-2 bg-retro-dark border border-retro-blue text-retro-blue px-3 py-1 font-terminal text-sm transition-all duration-150 group-hover:bg-retro-blue group-hover:text-retro-dark">
                                <span id="copyButtonText">COPY</span>
                            </button>
                        </div>
                        <div id="copyMessage" class="h-4 text-retro-green mt-2 font-terminal"></div>
                    </div>
                </section>
                
                <!-- MONETIZE CTA -->
                <section class="text-center w-full hidden-anim flex flex-col items-center">
                    <h3 class="font-display text-3xl sm:text-4xl text-retro-green text-glow-green mb-4 animate-text-pulse">
                        💰 MONETIZE YOUR INBOX
                    </h3>
                    <p class="text-lg sm:text-xl max-w-md mb-8">
                        Deploy your own x402mcp server and start earning USDC for every AI message you receive.
                    </p>
                    
                    <a href="${VERCEL_DEPLOY_URL}" target="_blank" rel="noopener" class="retro-btn">
                        🚀 Deploy Your Own
                    </a>
                </section>

                <!-- FOOTER -->
                <footer class="w-full border-t-2 border-dashed border-retro-green/50 pt-8 pb-12 text-center hidden-anim">
                    <a href="https://github.com/NoahCohenNow/x402mcp" target="_blank" rel="noopener" class="font-display text-lg text-retro-pink text-glow-pink hover:underline">
                        [ GitHub ]
                    </a>
                </footer>

            </div>

            <script>
                // === Endpoint URL Setup ===
                (function(){
                    const base = window.location.origin + window.location.pathname;
                    const endpoint = (base.endsWith('/') ? base.slice(0, -1) : base) + '/mcp';
                    const urlEl = document.getElementById('endpoint-url');
                    if (urlEl) urlEl.textContent = endpoint;

                    // === Scroll-In Animation ===
                    const observer = new IntersectionObserver(
                        (entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting) {
                                    entry.target.classList.add('show-anim');
                                }
                            });
                        },
                        { threshold: 0.1 }
                    );

                    const hiddenElements = document.querySelectorAll('.hidden-anim');
                    hiddenElements.forEach((el) => observer.observe(el));

                    // === Copy to Clipboard ===
                    function copyToClipboard() {
                        const copyButton = document.getElementById('copyButton');
                        const copyButtonText = document.getElementById('copyButtonText');
                        const copyMessage = document.getElementById('copyMessage');

                        const textArea = document.createElement('textarea');
                        textArea.value = endpoint;
                        textArea.style.position = 'fixed';
                        textArea.style.opacity = '0';
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();

                        try {
                            const successful = document.execCommand('copy');
                            if (successful) {
                                copyButtonText.textContent = 'COPIED!';
                                copyMessage.textContent = '>> ENDPOINT COPIED TO CLIPBOARD';
                                copyButton.classList.add('bg-retro-green', 'text-retro-dark', 'border-retro-green');
                                copyButton.classList.remove('border-retro-blue', 'text-retro-blue');

                                setTimeout(() => {
                                    copyButtonText.textContent = 'COPY';
                                    copyMessage.textContent = '';
                                    copyButton.classList.remove('bg-retro-green', 'text-retro-dark', 'border-retro-green');
                                    copyButton.classList.add('border-retro-blue', 'text-retro-blue');
                                }, 2500);
                            } else {
                                copyMessage.textContent = '>> ERROR: COULD NOT COPY';
                            }
                        } catch (err) {
                            copyMessage.textContent = '>> ERROR: FAILED TO COPY';
                        }

                        document.body.removeChild(textArea);
                    }

                    document.getElementById('copyButton').addEventListener('click', copyToClipboard);
                })();
            </script>

        </body>
        </html>
    `);
});

// Serve MCP under /mcp/* to match client default
app.use("/mcp/*", (c) => DISABLE_PAYMENT ? base(c.req.raw) : paid(c.req.raw));
export default app;


function buildVercelDeployUrl({
    repositoryUrl = "https://github.com/NoahCohenNow/x402mcp",
    projectName = "x402-email-mcp",
    repositoryName = "x402-email-mcp",
    env = [
        "RECIPIENT_EMAIL",
        "RESEND_FROM",
        "RESEND_API_KEY",
        "EVM_ADDRESS",
        "SVM_ADDRESS",
        "TITLE",
        "DESCRIPTION",
        "IMAGE_URL",
        "URLS"
    ],
    // integrationIds = ["oac_KfIFnjXqCl4YJCHnt1bDTBI1"]
} = {}): string {
    const baseUrl = "https://vercel.com/new/clone";
    const params = new URLSearchParams({
        "repository-url": repositoryUrl,
        "project-name": projectName,
        "repository-name": repositoryName,
        "env": env.join(","),
        // "integration-ids": integrationIds.join(",")
    });
    return `${baseUrl}?${params.toString()}`;
}


function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function sanitizeUrl(url: string): string {
    try {
        const u = new URL(url);
        return u.protocol === "http:" || u.protocol === "https:" ? url : "#";
    } catch {
        return "#";
    }
}

function formatUrlLabel(url: string): string {
    try {
        const u = new URL(url);
        let label = `${u.hostname}${u.pathname}`.replace(/\/$/, "");
        if (label.length > 40) label = label.slice(0, 37) + "…";
        return label;
    } catch {
        return url.length > 40 ? url.slice(0, 37) + "…" : url;
    }
}

