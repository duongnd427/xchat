const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { registerValidation, loginValidation } = require("../auth/validation");
const verify = require("../auth/checkToken");
const { KEY } = require("../config");

router.post("/register", async function (req, res) {
  // Validate user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Kiểm tra email có tồn tại hay không
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send({ code: 401, detail: "Email đã được đăng ký" });

  // Mã hóa password
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.password, salt);

  // Tạo user
  const newuser = new User();
  newuser.name = req.body.name;
  newuser.email = req.body.email;
  newuser.password = hashPass;

  try {
    const User = await newuser.save();
    res.send(User);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async function (req, res) {
  // Validate user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Kiểm tra email
  const userLogin = await User.findOne({ email: req.body.email });
  if (!userLogin)
    return res.status(400).send({ code: 401, detail: "Sai email" });

  // Kiểm tra password
  const passLogin = await bcrypt.compare(req.body.password, userLogin.password);
  if (!passLogin)
    return res.status(400).send({ code: 402, detail: "Sai mật khẩu" });

  // Ký và tạo token
  const token = jwt.sign({ _id: userLogin._id }, process.env.SECRET_TOKEN);
  res.header("auth-token", token).send({ code: 200, token: token });
});

router.get("/", verify, function (req, res) {
  res.send("Chào mừng bạn đến với website của mình. Chúc bạn một ngày vui vẻ");
});

router.delete("/", async (req, res) => {
  try {
    let userDeleted = await userModel.findOneAndRemove({
      user: req.query.username,
    });
    if (!userDeleted)
      res.status(404).send({ code: 404, message: "user not found" });
    else res.status(200).send({ code: 200, message: "deleted" });
  } catch (error) {
    res.status(500).send({ code: 500, error });
  }
});

// router.put("/", async (req, res) => {
//   try {
//     const { password, phone, avatar, displayName } = req.body;
//     const updateInfo = { password, phone, avatar, displayName };
//     console.log(req.body);
//     console.log(updateInfo);
//     let userInfo = await userModel.find({ username: req.query.username });
//     if (!userInfo)
//       res.status(404).send({ code: 404, message: "User not found" });
//     else {
//       for (let key in updateInfo) {
//         if (key == "password" && updateInfo[key]) {
//           let compare = bcrypt.compareSync(
//             updateInfo.password,
//             userInfo.hashPassword
//           );
//           if (!compare) {
//             userInfo.hashPassword = bcrypt.hashSync(
//               updateInfo.password,
//               bcrypt.genSaltSync()
//             );
//           }
//         } else if (updateInfo[key]) {
//           userInfo[key] = updateInfo[key];
//         }
//       }
//       let dataSaved = await userInfo.save();
//       res.status(200).send({ code: 200, dataSaved });
//     }
//   } catch (error) {
//     res.status(500).send({ code: 500, error });
//   }
// });

module.exports = router;
