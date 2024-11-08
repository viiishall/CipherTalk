
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const encryptRouter = express.Router();

const { checkKeyStatus } = require("../services/userService");
const tokenAuthenticationMiddleware = require("../middleware/tokenAuthenticationMiddleware");

encryptRouter.post(
  "/verifyKetStatus",
  tokenAuthenticationMiddleware,
  async (req, res) => {
    try {
      const token = req.body.usertoken;
   
      const user = jwt.verify(token, process.env.jwtPassword);
      const userkeystatus = await checkKeyStatus(user.id);

      if (!userkeystatus) {
        return res.status(404).json({ msg: "User not found!" });
      }

      return res.status(200).json({ keystatus: userkeystatus.keyStatus });
    } catch (error) {
        console.log("Error while Verifying key status",error)
    }
  }
);
module.exports = encryptRouter;
