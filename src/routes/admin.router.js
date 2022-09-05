const express = require('express');
const { storeImage } = require('../controller/user.controller');
const { saveLayer, getLayerTypes, updateLayer } = require("../controller/layertype")
const authMiddleware = require('../helpers/jwt');

const adminRouter = express.Router();

adminRouter.post("/storeImage", authMiddleware, storeImage);
adminRouter.post("/savelayer", authMiddleware, saveLayer);
adminRouter.get("/layertypelist", authMiddleware, getLayerTypes);
adminRouter.put("/updatelayer", authMiddleware, updateLayer);

module.exports = adminRouter;
