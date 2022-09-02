const express = require('express');
const { saveLayer, getLayerTypes ,updateLayer} = require('../controller/layertype');
const authMiddleware = require('../helpers/jwt');

const layerTypeRouter = express.Router();

layerTypeRouter.post("/savelayer", saveLayer);
layerTypeRouter.get("/layertypelist", getLayerTypes);
layerTypeRouter.put("/updatelayer", updateLayer);

module.exports = layerTypeRouter;
