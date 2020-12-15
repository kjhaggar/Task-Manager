const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const listCtrl = require("../../controllers/api/List");
const taskCtrl = require("../../controllers/api/Task");

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

router.get("/lists", verifyToken, listCtrl.getAllList);
router.post("/lists", verifyToken, listCtrl.postList);
router.get("/lists/:listId", verifyToken, listCtrl.getList);
router.patch("/lists/:listId", verifyToken, listCtrl.updateList);
router.delete("/lists/:listId", verifyToken, listCtrl.deleteList);

router.get("/lists/:listId/tasks", verifyToken, taskCtrl.getAllTask);
router.post("/lists/:listId/tasks", verifyToken, taskCtrl.postTask);
router.get("/lists/:listId/tasks/:taskId", verifyToken, taskCtrl.getTask);
router.patch("/lists/:listId/tasks/:taskId", verifyToken, taskCtrl.updateTask);
router.patch("/tasks/addUser", verifyToken, taskCtrl.addUserToTask);
router.patch("/tasks/removeUser", verifyToken, taskCtrl.removeUserFromTask);
router.delete("/lists/:listId/tasks/:taskId", verifyToken, taskCtrl.deleteTask);

module.exports = router;
