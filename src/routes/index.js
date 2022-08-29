const express = require('express');
const AdminRouter = require("./auth.router");
const UserRouter = require("./user.router")

const mainRouter = express.Router();

mainRouter.use("/api/auth", AdminRouter);
mainRouter.use("/api/user", UserRouter);

module.exports = mainRouter;
