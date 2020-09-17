const express = require("express");
const userRouter = express.Router();
const helper = require("../helper");

const userModel = require("../models/userModel");

userRouter.use("/", (req, res, next) => {
  console.log("user router middleware");
  next();
});

userRouter.post("/signup", (req, res) => {
  const { username, password, repassword, phone, avatar } = req.body;
  if (password === repassword) {
    let hashpw = helper.EnXxtea(password);
    userModel.create(
      { username, hashpw, phone, avatar },
      (err, userCreated) => {
        if (err) {
          res.status(500).send({ code: 500, err });
        } else {
          let userInfo = helper.EnXxtea({
            id: userCreated._id,
            username: userCreated.username,
            phone: userCreated.phone,
          });
          res.status(200).send({ code: 200, userInfo });
        }
      }
    );
  } else {
    res.status(404).send({ code: 404, message: "wrong password" });
  }
});

userRouter.get("/login", async (req, res) => {
  try {
    let user = await userModel.findOne({
      username: req.query.username,
      hashpw: helper.EnXxtea(req.query.password),
    });
    if (!user) {
      res.status(404).send({ code: 404, message: "user not found" });
    } else {
      let userInfo = helper.EnXxtea({
        id: user._id,
        username: user.username,
        phone: user.phone,
      });
      res.status(200).send({ code: 200, userInfo });
    }
  } catch (error) {
    res.status(500).send({ code: 500 });
  }
});

userRouter.delete("/", async (req, res) => {
  try {
    let userDeleted = await userModel.findOneAndRemove({
      username: req.query.username,
    });
    if (!userDeleted)
      res.status(404).send({ code: 404, message: "user not found" });
    else res.status(200).send({ code: 200, message: "deleted" });
  } catch (error) {
    res.status(500).send({ code: 500, error });
  }
});

userRouter.put("/", async (req, res) => {
  try {
    const { password, phone, avatar, displayName } = req.body;
    const updateInfo = { password, phone, avatar, displayName };
    console.log(req.body);
    console.log(updateInfo);
    let userInfo = await userModel.find({ username: req.query.username });
    if (!userInfo)
      res.status(404).send({ code: 404, message: "User not found" });
    else {
      for (let key in updateInfo) {
        if (key == "password" && updateInfo[key]) {
          let compare = bcrypt.compareSync(
            updateInfo.password,
            userInfo.hashPassword
          );
          if (!compare) {
            userInfo.hashPassword = bcrypt.hashSync(
              updateInfo.password,
              bcrypt.genSaltSync()
            );
          }
        } else if (updateInfo[key]) {
          userInfo[key] = updateInfo[key];
        }
      }
      let dataSaved = await userInfo.save();
      res.status(200).send({ code: 200, dataSaved });
    }
  } catch (error) {
    res.status(500).send({ code: 500, error });
  }
});

module.exports = userRouter;
