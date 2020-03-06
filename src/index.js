"use strict";
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { app, PORT } = require("./app");
const config = require("./config");
const DATE_NOW = new Date();

async function initializeMongo() {
  try {
    const client = await mongoose.connect(config.MONGO_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`[${DATE_NOW}]==> MongoDB was initialized`);
    process.on("SIGINT", async () => {
      console.log(`[${DATE_NOW}]==> Mongo was disconnected`);
    });
    startExpress();
  } catch (error) {
    console.log(`[${DATE_NOW}]==> ${error.message}`);
  }
}

function startExpress() {
  app.listen(PORT, () => {
    console.log(
      `[${DATE_NOW}] ==> This server is running on ${config.HOST_URL}:${PORT}`
    );
  });
}

initializeMongo();
