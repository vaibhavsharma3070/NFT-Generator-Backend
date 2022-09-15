const express = require('express');
const { login, signUp, ChangePassword } = require("../controller/auth.controller")
const authMiddleware = require('../helpers/jwt');
const AuthRouter = express.Router();

AuthRouter.post("/login", login);
AuthRouter.post("/signup", signUp);
AuthRouter.post("/changepassword", authMiddleware, ChangePassword);
module.exports = AuthRouter;
