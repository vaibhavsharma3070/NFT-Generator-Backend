const express = require('express');
const adminRouter = require('./admin.router');
const AuthRouter = require('./auth.router');
const ConfigRouter = require('./config.router');
const UserRouter = require("./user.router")

const mainRouter = express.Router();

mainRouter.use("/api/auth", AuthRouter);
mainRouter.use("/api/user", UserRouter);
mainRouter.use("/api/config", ConfigRouter);
mainRouter.use("/api/admin", adminRouter);

module.exports = mainRouter;
