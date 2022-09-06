const express = require('express');
const { storeImage } = require('../controller/user.controller');
const { saveLayer, getLayerTypes, updateLayer, deleteLayer } = require("../controller/layertype")
const authMiddleware = require('../helpers/jwt');
const { listOfUser } = require('../controller/auth.controller');

const adminRouter = express.Router();

adminRouter.post("/storeImage", authMiddleware, storeImage);
adminRouter.post("/savelayer", authMiddleware, saveLayer);
adminRouter.get("/layertypelist", authMiddleware, getLayerTypes);
adminRouter.put("/updatelayer", authMiddleware, updateLayer);
adminRouter.delete("/deletelayer/:layertype_id", authMiddleware, deleteLayer);
adminRouter.get("/userlist", authMiddleware, listOfUser);

module.exports = adminRouter;
