const express = require("express");

const router = express.Router();

const ApiRouter = require("./api");
const UserRouter = require("./users");

router.use("/api", ApiRouter);
router.use("/user", UserRouter);

module.exports = router;
