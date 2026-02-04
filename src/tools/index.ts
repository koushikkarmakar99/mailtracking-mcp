/**
 * Consolidates and registers all tools with the MCP server.
 *
 * Combines tools for components, documentation, and other features.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import z from 'zod';
import { Db, Long } from 'mongodb';

// 
import { formatDatetimeMsToMdYhmsUTC } from '../helpers/index.js';

export function registerTools(server: McpServer, db: Db, MONGO_COLLECTION: string) {

	// Register the tool
	server.registerTool(
		"search_mailpieces_by_cust_id",
		{
			description: "Get statement tracking data for a given customer ID.",
			inputSchema: z.object({ cust_id: z.coerce.string().max(100).min(1).describe("Customer ID to search for.") }),
		},
		async ({ cust_id }: { cust_id: string }) => {
			console.error("[tools] search_mailpieces_by_cust_id - received request", { cust_id });

			// If the incoming input looks like a free-text phrase (e.g., "whats the weather"),
			// treat it as unrelated and return the default no-match response instead of querying the DB.
			if (/\s/.test(cust_id)) {
				console.error("[tools] search_mailpieces_by_cust_id - input appears to be free-text, returning default response");
				return {
					content: [
						{
							type: "text",
							text: "The prompt you provided does not match any tools. Please provide a valid customer ID or tracking number.",
						},
					],
				};
			}

			try {
				const collection = db.collection(MONGO_COLLECTION);
				let query: object;
				// If cust_id looks like digits, include MongoDB Long and Number equivalents in the query
				if (/^\d+$/.test(cust_id)) {
					const longId = Long.fromString(cust_id);
					const numId = Number(cust_id);
					query = { cust_id: { $in: [cust_id, longId, numId] } };
				} else {
					query = { cust_id: cust_id };
				}
				console.error("[tools] search_mailpieces_by_cust_id - query", JSON.stringify(query));
				const results = await collection.find(query).limit(50).toArray();
				console.error("[tools] search_mailpieces_by_cust_id - results count", results.length);

				// sanitize results: remove internal IDs and format datetime
				const sanitized = results.map((r: any) => {
					const { mailpiece_id, ...rest } = r; // drop mailpiece_id
					const scans = (r.scans || []).map((s: any) => {
						const { delivery_scan_id, forwarded_address, ...srest } = s; // drop delivery_scan_id
						const scan_datetime = s.scan_datetime ? formatDatetimeMsToMdYhmsUTC(s.scan_datetime) : s.scan_datetime;
						const forwarded = s.is_forwarded ? "Yes" : "No";
						const returned = s.is_returned ? "Yes" : "No";
						const scanObj: any = { ...srest, scan_datetime, forwarded, returned };
						if (s.is_forwarded && forwarded_address) {
							scanObj.forwarded_address = forwarded_address;
						}
						return scanObj;
					});
					return { ...rest, scans };
				});

				console.error("[tools] search_mailpieces_by_cust_id - returning sanitized results");
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(sanitized, null, 2),
						},
					],
				};
			} catch (err) {
				console.error("[tools] search_mailpieces_by_cust_id - error", err);
				throw err;
			}
		}
	);

	server.registerTool(
		"search_mailpieces_by_delivery_status",
		{
			description: "Get statement tracking data for mailpieces with a given delivery status.",
			inputSchema: z.object({ status: z.coerce.string().max(100).min(1).describe("Delivery status to search for (e.g., 'Delivered', 'In Transit').") }),
		},
		async ({ status }: { status: string }) => {
			console.error("[tools] search_mailpieces_by_delivery_status - received request", { status });
			try {
				const collection = db.collection(MONGO_COLLECTION);
				// match delivery_status inside the scans array; use case-insensitive exact match
				const query = { 'scans.delivery_status': { $regex: `^${status}$`, $options: 'i' } };
				console.error("[tools] search_mailpieces_by_delivery_status - query", JSON.stringify(query));
				const results = await collection.find(query).toArray();
				console.error("[tools] search_mailpieces_by_delivery_status - results count", results.length);

				// sanitize results: remove internal IDs and format datetime
				const sanitized = results.map((r: any) => {
					const { mailpiece_id, ...rest } = r; // drop mailpiece_id
					const scans = (r.scans || []).map((s: any) => {
						const { delivery_scan_id, forwarded_address, ...srest } = s; // drop delivery_scan_id
						const scan_datetime = s.scan_datetime ? formatDatetimeMsToMdYhmsUTC(s.scan_datetime) : s.scan_datetime;
						const forwarded = s.is_forwarded ? "Yes" : "No";
						const returned = s.is_returned ? "Yes" : "No";
						const scanObj: any = { ...srest, scan_datetime, forwarded, returned };
						if (s.is_forwarded && forwarded_address) {
							scanObj.forwarded_address = forwarded_address;
						}
						return scanObj;
					});
					return { ...rest, scans };
				});

				console.error("[tools] search_mailpieces_by_delivery_status - returning sanitized results");
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(sanitized, null, 2),
						},
					],
				};
			} catch (err) {
				console.error("[tools] search_mailpieces_by_delivery_status - error", err);
				throw err;
			}
		}

	)

	server.registerTool(
		"search_mailpieces_by_tracking_number",
		{
			description: "Get statement tracking data for a given tracking number (IMB).",
			inputSchema: z.object({ imb: z.coerce.string().max(100).min(1).describe("Tracking number (IMB) to search for.") }),
		},
		async ({ imb }: { imb: string }) => {
			console.error("[tools] search_mailpieces_by_tracking_number - received request", { imb });

			// If the incoming input looks like free-text (contains spaces), treat as unrelated
			// and return the default no-match response rather than querying the DB.
			if (/\s/.test(imb)) {
				console.error("[tools] search_mailpieces_by_tracking_number - input appears to be free-text, returning default response");
				return {
					content: [
						{
							type: "text",
							text: "Hello from the MCP server!",
						},
					],
				};
			}

			try {
				const collection = db.collection(MONGO_COLLECTION);
				const query = { imb: imb };
				console.error("[tools] search_mailpieces_by_tracking_number - query", JSON.stringify(query));
				const results = await collection.find(query).limit(50).toArray();
				console.error("[tools] search_mailpieces_by_tracking_number - results count", results.length);
				// sanitize results: remove internal IDs and format datetime
				const sanitized = results.map((r: any) => {
					const { mailpiece_id, ...rest } = r; // drop mailpiece_id
					const scans = (r.scans || []).map((s: any) => {
						const { delivery_scan_id, forwarded_address, ...srest } = s; // drop delivery_scan_id
						const scan_datetime = s.scan_datetime ? formatDatetimeMsToMdYhmsUTC(s.scan_datetime) : s.scan_datetime;
						const forwarded = s.is_forwarded ? "Yes" : "No";
						const returned = s.is_returned ? "Yes" : "No";
						const scanObj: any = { ...srest, scan_datetime, forwarded, returned };
						if (s.is_forwarded && forwarded_address) {
							scanObj.forwarded_address = forwarded_address;
						}
						return scanObj;
					});
					return { ...rest, scans };
				});

				console.error("[tools] search_mailpieces_by_tracking_number - returning sanitized results");
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(sanitized, null, 2),
						},
					],
				};
			} catch (err) {
				console.error("[tools] search_mailpieces_by_tracking_number - error", err);
				throw err;
			}
		}
	);

	server.registerTool(
		"no_match_default_tool",
		{
			description: "When MCP is called with no specific tool or no input, this default tool responds.",
			inputSchema: z.object({}),
		},
		async () => {	
			console.error("[tools] no_match_default_tool - received request");
			return {
				content: [
					{
						type: "text",
						text: "Hello from the MCP server!",
					},
				],
			};
		}
	);
}