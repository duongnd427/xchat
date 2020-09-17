const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt-nodejs");

const UserModel = require("../models/userModel");

authRouter.use("/", (req, res, next) => {
  console.log("Authorization router em ei");
  next();
});

authRouter.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(400)
      .send({ status: 500, message: "Thiếu usernam hoặc password" });
  } else {
    UserModel.findOne({ username })
      .then((accountFound) => {
        if (!accountFound) {
          res
            .status(404)
            .send({ status: 500, message: "Không tìm thấy tài khoản" });
        } else {
          const compare = bcrypt.compareSync(password, accountFound.hashpw);
          if (compare) {
            req.session.user = {
              username: accountFound.username,
              displayName: accountFound.displayName,
              id: accountFound._id,
            };
            console.log("A", req.session);
            res.send({ status: 200, message: "Logged in!", accountFound });
          } else
            res.status(401).send({ status: 500, message: "Wrong password" });
        }
      })
      .catch((error) => res.status(500).send({ status: 500, error }));
  }
});

authRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(500).send({ status: 500, err });
    else res.send({ status: 200, message: "logged out!" });
  });
});

authRouter.get("/login/check", (req, res) => {
  if (req.session.user)
    res.send({ status: 200, message: "success", user: req.session.user });
  else res.send({ status: 500, message: "failed" });
});

// function isLoggedin(req, res, next){
//     if(req.isAuthenticated()){
//         return next()
//     }
// }

module.exports = authRouter;
