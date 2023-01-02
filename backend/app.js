const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const AuthRoutes = require("./routes/AuthRoutes");
const chatRoutes = require("./routes/chatRoute");
const server = () => {
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.json());
  app.use("/api/v1", AuthRoutes);
  app.use("/api/v1", chatRoutes);

  return app;
};

module.exports = { server };
