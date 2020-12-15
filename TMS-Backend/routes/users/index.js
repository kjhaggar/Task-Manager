const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const userCtrl = require("../../controllers/users/user");

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorised request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token == "null") {
    return res.status(401).send("Unauthorised request. No token found");
  }

  let payload = jwt.verify(token, process.env.access_token_secret);
  if (!payload) {
    return res.status(401).send("Unauthorised request (!payload)");
  }
  req.userId = payload.id;
  next();
}

router.get("/", verifyToken, userCtrl.getAllUser);
router.get("/:userId", verifyToken, userCtrl.getUser);
router.post("/", verifyToken, userCtrl.postUser);
router.get("/list/:userId", verifyToken, userCtrl.getListByUser);
router.post("/login", userCtrl.loginUser);
router.delete("/:userId", verifyToken, userCtrl.deleteUser);

module.exports = router;
