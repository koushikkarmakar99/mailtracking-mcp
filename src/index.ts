import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

import { connectToMongoDB } from "./resources/index.js";
import { registerTools } from "./tools/index.js";

// Load environment variables from .env file
dotenv.config();
// Debug: Log after dotenv loads
console.error('After dotenv.config:', {
	MONGO_URL: process.env.MONGO_URL,
	MONGO_DB: process.env.MONGO_DB,
	MONGO_COLLECTION: process.env.MONGO_COLLECTION
});
const MONGO_URL = process.env.MONGO_URL;
const MONGO_DB = process.env.MONGO_DB;
const MONGO_COLLECTION = process.env.MONGO_COLLECTION;

let client: MongoClient;

const server = new McpServer(
	{
		name: "mailtracking-mcp",
		version: "1.0.0",
	}
);
// Start server with top-level await
async function main() {
	console.error("Starting MCP server...");
	
	if (MONGO_URL) {
		console.error(`Using MongoDB URL: ${MONGO_URL}`);
	} else {
		throw new Error("MONGO_URL environment variable is required");
	}

	if (MONGO_DB) {
		console.error(`Using MongoDB Database: ${MONGO_DB}`);
	} else {
		throw new Error("MONGO_DB environment variable is required");
	}
	
	if (MONGO_COLLECTION) {
		console.error(`Using MongoDB Collection: ${MONGO_COLLECTION}`);
	} else {
		throw new Error("MONGO_COLLECTION environment variable is required");
	}
	
	client = new MongoClient(MONGO_URL);
	const db: Db = await connectToMongoDB(client, MONGO_DB);
	registerTools(server, db, MONGO_COLLECTION);
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("MCP server started and listening for requests...");
}

try {
	await main();
} catch (error) {
	console.error("Fatal error in main():", error);
	process.exit(1);
}

// Cleanup on exit
process.on("SIGINT", async () => {
	console.error("Shutting down...");
	await client?.close();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.error("Shutting down...");
	await client?.close();
	process.exit(0);
});