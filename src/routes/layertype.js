const express = require('express');
const { saveLayer, getLayerTypes ,updateLayer} = require('../controller/layertype');
const authMiddleware = require('../helpers/jwt');

const layerTypeRouter = express.Router();

layerTypeRouter.post("/savelayer", authMiddleware, saveLayer);
layerTypeRouter.get("/layertypelist", authMiddleware, getLayerTypes);
layerTypeRouter.put("/updatelayer", authMiddleware, updateLayer);

module.exports = layerTypeRouter;
