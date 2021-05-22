const express = require("express");
const roomController = require("../controllers/RoomController.js");
const roomRouter = express.Router();

roomRouter.post("/connect", roomController.ConnectToRoom);
roomRouter.post("/leave", roomController.RemoveUserFromRoom);
roomRouter.post("/userlist", roomController.GetAllUsersByRoom);

module.exports = roomRouter;
