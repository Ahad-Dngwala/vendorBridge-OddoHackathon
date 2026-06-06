require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { pool } = require("../db/db");

async function printUsers() {
  try {
    const resUsers = await pool.query("SELECT id, org_id, name, email, role, vendor_id FROM users");
    console.log("--- Users ---");
    console.log(resUsers.rows);

    const resOrgs = await pool.query("SELECT id, name FROM organizations");
    console.log("--- Orgs ---");
    console.log(resOrgs.rows);

    const resVendors = await pool.query("SELECT id, company_name, email FROM vendors");
    console.log("--- Vendors ---");
    console.log(resVendors.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
printUsers();
