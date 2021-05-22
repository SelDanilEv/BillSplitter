const express = require("express");
const HomeController = require("../controllers/HomeController");
const homeRouter = express.Router();

homeRouter.get("/about", HomeController.about);
homeRouter.get("/", HomeController.index);
homeRouter.get("/login", HomeController.login);
homeRouter.get("/newBill", HomeController.newBill);
homeRouter.get("/logout", HomeController.logout);

module.exports = homeRouter;
