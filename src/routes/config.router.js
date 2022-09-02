const express = require('express');
const { getConfig,updateConfig } = require("../controller/config.controller");
const authMiddleware = require('../helpers/jwt');

const ConfigRouter = express.Router();

ConfigRouter.get("/getconfig", getConfig);

ConfigRouter.put("/updateconfig", updateConfig);

module.exports = ConfigRouter;
