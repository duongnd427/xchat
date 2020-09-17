const express = require("express");
const apiRouter = express.Router();

const userRouter = require("./userRouter");
const authRouter = require("./authRouter");

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);

apiRouter.use("/", (req, res, next) => {
  console.log(" api middleware");
  next();
});

module.exports = apiRouter;
