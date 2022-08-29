const express = require('express');
const { Login ,SignUp} = require("../controller/auth.controller")

const AdminRouter = express.Router();

AdminRouter.post("/login", Login);
AdminRouter.post("/signup", SignUp);

module.exports = AdminRouter;
