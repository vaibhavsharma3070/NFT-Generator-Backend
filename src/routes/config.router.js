const express = require('express');
const { getConfig, updateConfig } = require("../controller/config.controller");
const authMiddleware = require('../helpers/jwt');

const ConfigRouter = express.Router();

ConfigRouter.get("/getconfig", authMiddleware, getConfig);

ConfigRouter.put("/updateconfig", authMiddleware, updateConfig);

module.exports = ConfigRouter;
