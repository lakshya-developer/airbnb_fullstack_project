// Core Modules
const path = require('path');

// External Module
const express = require('express');
const userRouter = express.Router();

// Local Module
const rootDir = require('../utils/pathUtil');
const HomesController = require('../controller/homes');

userRouter.get("/", HomesController.getUserProfile);

module.exports = userRouter;