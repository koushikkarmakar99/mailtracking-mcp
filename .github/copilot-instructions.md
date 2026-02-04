# MCP Server for Mail Tracking

This server connects to a MongoDB database named `mailtracking` and queries the `mailpieces_with_scans` collection.

## Tools
- `search_mailpieces_by_cust_id`: Accepts a MongoDB `filter` object, which is Customer ID (string). Copilot should generate queries based on user requests.
- `search_mailpieces_by_tracking_number`: Accepts a MongoDB `filter` object, which is Tracking Number (IMB) string. Copilot should generate queries based on user requests.
- `search_mailpieces_by_delivery_status`: Accepts a MongoDB `filter` object, which is Delivery Status (string). Copilot should generate queries based on user requests. Possible delivery statuses are "DELIVERED", "RETURN_DELIVERED", "IN_TRANSIT", "RETURN_IN_TRANSIT", 'FORWARD_IN_TRANSIT" and "FORWARD_DELIVERED".
- `no_match_default_tool`: Accepts a mongoDB `filter` object, which is an empty object. This tool is invoked when no other tool matches the user request. It should respond with "I'm sorry, I couldn't find any information related to your request."
