import { makePaymentAwareClientTransport } from "mcpay/transport";
import { createSigner, type MultiNetworkSigner } from "x402/types";
import { experimental_createMCPClient, generateText } from "ai"
import { openai } from "@ai-sdk/openai";

const EVM_PRIVATE_KEY = process.env.EVM_PRIVATE_KEY as `0x${string}`;
const SVM_PRIVATE_KEY = process.env.SVM_PRIVATE_KEY as `0x${string}`;
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:3000/mcp"
const EVM_NETWORK = (process.env.EVM_NETWORK || "base") as "base" | "base-sepolia" | "avalanche" | "sei" | "iotex";
const SVM_NETWORK = (process.env.SVM_NETWORK || "solana-devnet") as "solana-devnet" | "solana";

const evmSigner = await createSigner(EVM_NETWORK, EVM_PRIVATE_KEY);
const solanaSigner = await createSigner(SVM_NETWORK, SVM_PRIVATE_KEY);

const client = await experimental_createMCPClient({
    name: 'custom-client',
    transport: makePaymentAwareClientTransport(MCP_SERVER_URL, { evm: evmSigner, svm: solanaSigner } as unknown as MultiNetworkSigner)
});

const tools = await client.tools();

// EXAMPLE 1: Business inquiry
console.log("\n📧 Example 1: Business Inquiry");
const response1 = await generateText({
    model: openai("gpt-4o-mini"),
    messages: [{ 
        role: "user", 
        content: "Send a professional email asking about collaboration opportunities in the AI space" 
    }],
    tools: tools,
    maxSteps: 3
});
console.log("✅ Sent:", response1.text);

// EXAMPLE 2: Custom subject and body via AI
console.log("\n📧 Example 2: Event Invitation");
const response2 = await generateText({
    model: openai("gpt-4o-mini"),
    messages: [{ 
        role: "user", 
        content: "Send an email inviting them to a blockchain conference next month in Miami" 
    }],
    tools: tools,
    maxSteps: 3
});
console.log("✅ Sent:", response2.text);

// EXAMPLE 3: Direct control with explicit instructions
console.log("\n📧 Example 3: Specific Content");
const response3 = await generateText({
    model: openai("gpt-4o-mini"),
    messages: [{ 
        role: "user", 
        content: `Send an email with:
Subject: "Check out my new product!"
Body: "Hey! I just launched an amazing new AI tool. Would love to get your feedback. Check it out at https://myproduct.com"` 
    }],
    tools: tools,
    maxSteps: 3
});
console.log("✅ Sent:", response3.text);

await client.close();
