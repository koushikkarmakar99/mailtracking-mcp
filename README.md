
# Mail Tracking MCP Server

An MCP server that lets you query mailpiece tracking data stored in MongoDB.

---

## What this server does

It exposes two tools:

- **search_mailpieces_by_cust_id**: Query mailpieces and their scans by Customer ID.
- **search_mailpieces_by_tracking_number**: Query mailpieces and their scans by Tracking Number (IMB).

---

## Quick Start (First-Time MCP User)

Follow these steps in order:

1. **Install dependencies and build the server**

   ```bash
   npm install
   npm run build
   ```

2. **(Optional) Point to your MongoDB**

   If your database is not on the default local URL, set an environment variable before running:

   ```bash
   $env:MONGO_URL="mongodb://your-ip:27017"
   ```

3. **Use in VS Code with MCP**

   This repo already includes VS Code MCP configuration. You only need the MCP extension:

   - Install the “MCP” extension in VS Code.
   - Open this folder in VS Code.
   - The server is configured in `.vscode/mcp.json` and will run using `build/index.js`.
   - Open Copilot Chat and start using the tool.

---

## How to Query

You can query using either Customer ID or Tracking Number (IMB):

- **search_mailpieces_by_cust_id**: Provide a customer ID (string or number) to retrieve all mailpieces and their scans for that customer.
- **search_mailpieces_by_tracking_number**: Provide a tracking number (IMB string) to retrieve the mailpiece and its scans for that IMB.

Supported filters for advanced queries (if you extend the code) include:

- `imb` (exact match)
- `cust_id` (exact match)
- `delivery_sla_date` (date range)
- `print_sla_date` (date range)
- `scan_datetime` (date range)
- `address.city` (partial match using regex)
- `address.zip_code` (partial match using regex)
- `address.state` (abbreviation, e.g., CA)
- `scans.delivery_status` (exact match)
- `scans.is_returned` (boolean)
- `scans.return_start_date` (date range)
- `scans.is_forwarded` (boolean)
- `scans.forward_start_date` (date range)

---

## Example Prompts

Try these in Copilot Chat:

- "Get tracking details for customer 100001"
- "Get tracking details for IMB 0070012345600000008106202109999"
- "Get last scan for customer 100084"
- "Export all scans for customer 100084 as CSV"

---

## Notes

- By default, results are limited to 50.
- MongoDB must be reachable from the machine running the server.
