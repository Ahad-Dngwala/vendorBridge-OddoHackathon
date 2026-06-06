require("dotenv").config();

const express = require("express");
const app = express();

const { connectDB } = require("./db/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    await connectDB();

    app.use(express.json()); //Middleware to parse JSON bodies

 

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}` //server start only after successful DB connection if failed server stops
      );
    });

  } catch (error) {

    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();