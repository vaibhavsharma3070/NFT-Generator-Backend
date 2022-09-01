const express = require('express');
const AdminRouter = require("./auth.router");
const ConfigRouter = require('./config.router');
const UserRouter = require("./user.router")

const mainRouter = express.Router();

mainRouter.use("/api/auth", AdminRouter);
mainRouter.use("/api/user", UserRouter);
mainRouter.use("/api/config", ConfigRouter);

module.exports = mainRouter;
