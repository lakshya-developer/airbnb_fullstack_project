
// External Module
const express = require('express');
const hostRouter = express.Router();

// Local Module
const HomesController = require('../controller/homes');

hostRouter.get("/", HomesController.getHost);

hostRouter.get("/host-home", HomesController.getHostHomes);

hostRouter.post("/edit-home/", HomesController.editHostHomes);

hostRouter.post('/edit-home-submit/', HomesController.submitEditHomes);

hostRouter.post("/delete/:id", HomesController.deleteHomes);

hostRouter.use("/add-home", HomesController.useAddHome)

hostRouter.post("/home-added", HomesController.postHomesAdded);

exports.hostRouter = hostRouter;