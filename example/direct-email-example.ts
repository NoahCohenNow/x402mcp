import { makePaymentAwareClientTransport } from "mcpay/transport";
import { createSigner, type MultiNetworkSigner } from "x402/types";
import { experimental_createMCPClient } from "ai"

// Setup client
const EVM_PRIVATE_KEY = process.env.EVM_PRIVATE_KEY as `0x${string}`;
const SVM_PRIVATE_KEY = process.env.SVM_PRIVATE_KEY as `0x${string}`;
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:3000/mcp"
const EVM_NETWORK = (process.env.EVM_NETWORK || "base") as "base" | "base-sepolia" | "avalanche" | "sei" | "iotex";
const SVM_NETWORK = (process.env.SVM_NETWORK || "solana-devnet") as "solana-devnet" | "solana";

const evmSigner = await createSigner(EVM_NETWORK, EVM_PRIVATE_KEY);
const solanaSigner = await createSigner(SVM_NETWORK, SVM_PRIVATE_KEY);

const client = await experimental_createMCPClient({
    name: 'direct-client',
    transport: makePaymentAwareClientTransport(MCP_SERVER_URL, { evm: evmSigner, svm: solanaSigner } as unknown as MultiNetworkSigner)
});

// Get the send_email tool
const tools = await client.tools();
const sendEmailTool = tools.send_email;

try {
    // Call the tool directly with exact subject and body
    const result = await sendEmailTool.execute({
        subject: "🚀 My Custom Subject Line",
        body: `Hey there!

This is a completely custom email with exactly the content I want.

I have full control over:
- The subject line
- The body content
- Formatting
- Links: https://example.com

Best regards,
Your Name`
    });

    console.log("✅ Email sent successfully!");
    console.log("Result:", result);
} catch (error) {
    console.error("❌ Error:", error);
}

await client.close();
