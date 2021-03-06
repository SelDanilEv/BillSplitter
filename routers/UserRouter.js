const express = require("express");
const userController = require("../controllers/UserController");
const userRouter = express.Router();

userRouter.get("/userlist", userController.GetAllUsers);
userRouter.get("/:NAME", userController.GetUser);
userRouter.post("/create", userController.RegisterUser);
userRouter.post("/connectuser", userController.ConnectUser);
userRouter.post("/exist", userController.IsUserExist);
userRouter.post("/checkpassword", userController.VerifyPassword);
userRouter.post("/currentuser", userController.GetCurrentUser);
userRouter.put("/update", userController.UpdateUser);
userRouter.delete("/remove", userController.RemoveUser);

module.exports = userRouter;
