const express = require("express");
const { initServer, emit } = require("./socket");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const router = require('./routes/products.js')
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./static"));
app.set("views", "./views");
app.set("view engine", "pug");

app.use('/api', router);

app.use((error, req, res, next) => {
  if (error.statusCode) {
    return res.status(error.statusCode).send(`Error ${error.statusCode}`);
  }
  console.log(error);
  res.status(500).json({ error: "Error"});
});

const server = http.createServer(app);
initServer(server);

server.listen(PORT, () => {
  console.log("Server conectado en puerto" + PORT);
});