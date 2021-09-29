const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");
const cors = require('cors');
dotenv.config();
//database connection
mongoose.connect("mongodb://127.0.0.1:27017/dummy?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true}, ()=>{
    console.log("Connected to DATABASE")
});

//middleware
app.use("/images", express.static(path.join(__dirname,"public/images")));
app.use(cors());
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
  });
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);
// assigning port to this web app
port = process.env.PORT || 5000


app.listen(port,()=>{
    console.log('server started on ',port);
});