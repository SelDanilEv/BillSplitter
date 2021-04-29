const express = require("express");
const requestController = require("../controllers/RequestController");
const roomRouter = express.Router();

roomRouter.post("/create", requestController.CreateRequest);
roomRouter.post("/accept", requestController.AcceptRequest);
roomRouter.post("/remove", requestController.RemoveRequest);
roomRouter.post("/requestsfrom", requestController.GetAllUserRequestFrom);
roomRouter.post("/requeststo", requestController.GetAllUserRequestTo);
roomRouter.post("/debts", requestController.GetAllUserDebts);

module.exports = roomRouter;
