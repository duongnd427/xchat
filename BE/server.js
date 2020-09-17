const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const apiRouter = require("./routers/apiRouter");
const Config = require("./config");
let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: ["http://localhost:3001"], credentials: true }));

app.use(
  session({
    secret: "xchat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);

mongoose.connect("mongodb://localhost/xchat", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect("mongodb://balo11044:nblong1997@ds145072.mlab.com:45072/quanlynhahang",(err)=>{
//   if (err) console.error(err)
//   else console.log("DB connect success!")
// })

app.use((req, res, next) => {
  console.log(req.session);
  next();
});

app.use("/xchat", apiRouter);

app.use(express.static("./build"));

app.get("/", (req, res) => {
  res.sendFile("./build/index.html");
});

app.listen(Config.PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Sever running at ${Config.PORT}`);
});
