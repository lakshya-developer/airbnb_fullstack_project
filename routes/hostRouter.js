// Core Modules
const path = require('path');

// External Module
const express = require('express');
const hostRouter = express.Router();

// Local Module
const rootDir = require('../utils/pathUtil');
const HomesController = require('../controller/homes');

hostRouter.get("/", HomesController.getHostHome);

hostRouter.use("/add-home", HomesController.useAddHome)

hostRouter.post("/home-added", HomesController.postHomesAdded);

exports.hostRouter = hostRouter;