const express = require('express');
const { login, signUp } = require("../controller/auth.controller")

const AuthRouter = express.Router();

AuthRouter.post("/login", login);
AuthRouter.post("/signup", signUp);

module.exports = AuthRouter;
