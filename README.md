
# Mail Tracking MCP Server

An MCP server that lets you query mailpiece tracking data stored in MongoDB.

---

## What this server does

It exposes these tools:

- **search_mailpieces_by_cust_id**: Query mailpieces and their scans by Customer ID.
- **search_mailpieces_by_delivery_status**: Query mailpieces whose scans match a delivery status (e.g., `DELIVERED`, `IN_TRANSIT`; case-insensitive exact match).
- **search_mailpieces_by_tracking_number**: Query mailpieces and their scans by Tracking Number (IMB).
- **no_match_default_tool**: Fallback response (simple hello message) when no tool matches or when invoked without input.

---

## Quick Start (First-Time MCP User)

Follow these steps in order:

- To test this MCP server locally, pull the sample MongoDB migration repo and start its Docker Compose file:

   ```bash
   git pull https://github.com/koushikkarmakar99/mongodb-migration
   cd mongodb-migration
   docker compose up -d
   ```
- To insert ready made sample data run the below on a terminal:
   ```PowerShell
   Get-Content -Raw .\sql\seed_sample_data.sql | podman exec -i mongodb-migration-sqlserver-1 sqlcmd -S localhost -U sa -P <Password> -C -d master
   ```


1. **Install dependencies and build the server**

   ```bash
   npm install
   npm run build
   ```

2. **Configure Mongo connection (required)**

   The server requires these environment variables before it will start:

   ```bash
   # PowerShell
   $env:MONGO_URL="mongodb://your-ip:27017"
   $env:MONGO_DB="mailtracking"
   $env:MONGO_COLLECTION="mailpieces_with_scans"

   # Bash
   export MONGO_URL="mongodb://your-ip:27017"
   export MONGO_DB="mailtracking"
   export MONGO_COLLECTION="mailpieces_with_scans"
   ```

3. **Use in VS Code with MCP**

   This repo already includes VS Code MCP configuration. You only need the MCP extension:

   - Install the “MCP” extension in VS Code.
   - Open this folder in VS Code.
   - The server is configured in `.vscode/mcp.json` and will run using `build/index.js`.
   - Open Copilot Chat and start using the tool.

---

## How to Query

You can query mailpieces and scans with these tools:

- **search_mailpieces_by_cust_id**: Provide a customer ID (string or number) to retrieve all mailpieces and their scans for that customer.
- **search_mailpieces_by_delivery_status**: Provide a delivery status (for example `DELIVERED`, `RETURN_DELIVERED`, `IN_TRANSIT`, `RETURN_IN_TRANSIT`, `FORWARD_IN_TRANSIT`, `FORWARD_DELIVERED`) to fetch mailpieces whose scans have that status (case-insensitive exact match).
- **search_mailpieces_by_tracking_number**: Provide a tracking number (IMB string) to retrieve the mailpiece and its scans for that IMB.

Free-text inputs (containing spaces) skip MongoDB entirely and respond with the default messages: customer ID requests return a no-match notice, and tracking number requests return the hello fallback.

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
- "List all mailpieces with delivery status DELIVERED"
- "Export all scans for customer 100084 as CSV"

---

## Notes

- `search_mailpieces_by_cust_id` and `search_mailpieces_by_tracking_number` limit results to 50. The delivery status tool returns all matches by default, so responses for common statuses like `IN_TRANSIT` may be large.
- MongoDB must be reachable from the machine running the server.
- Responses remove internal IDs and format scan timestamps as `MM/DD/YYYY hh:mm:ss AM/PM` (UTC).
