const express = require('express');
const { generateImage } = require("../controller/user.controller")
const authMiddleware = require("../helpers/jwt")

const UserRouter = express.Router();

UserRouter.get("/generate", authMiddleware, generateImage);

module.exports = UserRouter;
