const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on("connect", () => {
  console.log("PostgreSQL Connected");
});

pool.on("error", (err) => {
  console.error("PostgreSQL Error:", err);
});


const connectDB = async () => {
  try {

    const result = await pool.query(
      "SELECT NOW()" //real connection stablish after first query
    );

    console.log("Connection Test Successful");

  } catch (error) {

    console.error(
      "Database Connection Failed",
      error.message
    );

    process.exit(1);

  }
};

module.exports = {
  pool,
  connectDB,
};
