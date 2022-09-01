const express = require('express');
const { StoreConfig } = require("../controller/config.controller");
const authMiddleware = require('../helpers/jwt');

const ConfigRouter = express.Router();

ConfigRouter.post("/configsave", authMiddleware, StoreConfig);

module.exports = ConfigRouter;
