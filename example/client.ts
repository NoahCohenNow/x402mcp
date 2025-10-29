import { makePaymentAwareClientTransport } from "mcpay/transport";
import { createSigner, type MultiNetworkSigner } from "x402/types";
import { experimental_createMCPClient, generateText, type Tool, jsonSchema } from "ai"
import { openai } from "@ai-sdk/openai";

export const getClient = async () => {
    const EVM_PRIVATE_KEY = process.env.EVM_PRIVATE_KEY as `0x${string}`;
    const SVM_PRIVATE_KEY = process.env.SVM_PRIVATE_KEY as `0x${string}`;
    const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:3000/mcp"
    const EVM_NETWORK = (process.env.EVM_NETWORK || "base") as "base" | "base-sepolia" | "avalanche" | "sei" | "iotex";
    const SVM_NETWORK = (process.env.SVM_NETWORK || "solana-devnet") as "solana-devnet" | "solana";

    const evmSigner = await createSigner(EVM_NETWORK, EVM_PRIVATE_KEY);
    const solanaSigner = await createSigner(SVM_NETWORK, SVM_PRIVATE_KEY);

    const client = await experimental_createMCPClient({
        name: 'example-client',
        transport: makePaymentAwareClientTransport(MCP_SERVER_URL, { evm: evmSigner, svm: solanaSigner } as unknown as MultiNetworkSigner)
    });

    return client
}

export const getClientResponse = async () => {
    const client = await getClient()
    const tools = await client.tools()

    const response = await generateText({
        model: openai("gpt-4o-mini"),
        messages: [{ role: "user", content: "Send an email saying there's a sale on at the local grocery store." }],
        tools: tools,
        toolChoice: "required",
        maxRetries: 10,
        maxSteps: 5,
        onStepFinish: (step) => {
            console.log("Step:", step.stepType, "Tool calls:", step.toolCalls.length);
            if (step.toolResults.length > 0) {
                console.log("Tool results:", step.toolResults.map(r => r.result));
            }
        }
    })

    return response
}

try {
    const response = await getClientResponse()
    console.log("✅ Email sent successfully!");
    console.log("Response:", response.text);
} catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    throw error;
}