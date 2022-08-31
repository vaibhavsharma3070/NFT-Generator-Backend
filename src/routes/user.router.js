const express = require('express');
const { generateImage,storeImage } = require("../controller/user.controller")
const authMiddleware = require("../helpers/jwt")

const UserRouter = express.Router();

UserRouter.get("/generate", authMiddleware, generateImage);
UserRouter.get("/storeImage",authMiddleware, storeImage);

module.exports = UserRouter;
