const express = require('express');
const { generateImage,storeImage } = require("../controller/user.controller")
const authMiddleware = require("../helpers/jwt")

const UserRouter = express.Router();

UserRouter.get("/generate", generateImage);
UserRouter.post("/storeImage", storeImage);

module.exports = UserRouter;
