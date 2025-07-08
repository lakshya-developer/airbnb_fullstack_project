// External Module
const express = require('express');
const authRouter = express.Router();

// Local Module
const AuthController = require("../controller/authentication");

authRouter.get("/", AuthController.getLogin);

authRouter.post("/", AuthController.postLogin);


exports.authRouter = authRouter;