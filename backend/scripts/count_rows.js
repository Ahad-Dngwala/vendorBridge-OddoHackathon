require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { pool } = require("../db/db");

async function checkCounts() {
  try {
    const tables = [
      "organizations", "users", "vendors", "rfqs", "rfq_items",
      "rfq_vendors", "quotations", "quotation_items", "approval_requests",
      "purchase_orders", "po_items", "invoices", "invoice_items",
      "activity_logs", "notifications"
    ];
    for (const table of tables) {
      const res = await pool.query(`SELECT COUNT(*) FROM "${table}"`);
      console.log(`${table.padEnd(20)}: ${res.rows[0].count}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
checkCounts();
