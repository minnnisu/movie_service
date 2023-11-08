const createError = require("http-errors");
const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql");
const db = require("./api/db/db_connect");
const app = express();

const port = 3000;

dotenv.config();

app.use((err, req, res, next) => {
  console.error(err);
  res.send(err.message);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
