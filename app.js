// Core Modules
const path = require("path");
// External Module
const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose"); 
const MongoDBStore = require('connect-mongodb-session')(session); 
const multer = require("multer");
const urlDB = "mongodb+srv://root:iamadminlakshya@lakshyadeveloper.nkcqqvp.mongodb.net/airbnb?retryWrites=true&w=majority&appName=LakshyaDeveloper";

// Local Module Routes
const userRouter = require("./routes/userRouter");
const  {hostRouter}  = require("./routes/hostRouter");
const {authRouter} = require("./routes/authRouter");
const { registerdHomes, Home } = require("./models/home");
const rootDir = require("./utils/pathUtil");
const HomeController = require("./controller/homes");
const ErrorController = require("./controller/error");
const AuthController = require("./controller/authentication");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const store = new MongoDBStore({
  uri: urlDB,
  collection: 'session'
})

app.use(express.static(path.join(rootDir, "public")));
app.use('/uploads/',express.static(path.join(rootDir, "uploads")));
app.use('/host/uploads/',express.static(path.join(rootDir, "uploads")));
app.use('/homes/uploads/',express.static(path.join(rootDir, "uploads")));
app.use('/rules/',express.static(path.join(rootDir, "rules")));


app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

const randomString = (length) => {
  const char = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for(let i=0; i<length; i++){
    result += char.charAt(Math.floor(Math.random() * char.length));
  }
  console.log(result);
  return result;
}
 
const fileFilter = (req, file, cb) => {
  if(['image/jpeg', 'image/png', 'image/webp' ].includes(file.mimetype)){
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
});


app.use(express.urlencoded());
app.use(multer({storage, fileFilter}).single("photo"));

app.use(session({
  secret: "airbnb.lakshya",
  resave: false,
  saveUninitialized: true,
  store
}))

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  req.user = req.session.user;
  console.log(req.userType);
  next();
})

app.get("/rules/:homeId", HomeController.getHouseRules);

app.get("/sign-up", AuthController.getSignUp);

app.post("/sign-up", AuthController.postSignUp);

app.use("/login",authRouter);

app.post("/logout", AuthController.postLogout);

app.get("/", HomeController.getHome);

app.use("/home-list", (req, res, next) => {
  if(!req.isLoggedIn){
    return res.redirect("/login");
  }
  if(req.user.userType !== "guest"){
    return res.redirect("/");
  }
  next();
});

app.use("/home-list", HomeController.getHomeList);

app.use("/favourite", (req, res, next) => {
  if(!req.isLoggedIn){
    return res.redirect("/login");
  }
  if(req.user.userType !== "guest"){
    return res.redirect("/");
  }
  next();
});

app.get("/favourite", HomeController.getfavourite);

app.post("/favourite", HomeController.postfavourite);

app.post("/deleteFav", HomeController.deleteFavourite);

app.use("/bookings", (req, res, next) => {
  if(!req.isLoggedIn){
    return res.redirect("/login");
  }
  if(req.user.userType !== "guest"){
    return res.redirect("/");
  }
  next();
});

app.get("/bookings", HomeController.getBookings);

app.post("/bookings", HomeController.postBookings);

app.post("/deleteBooking", HomeController.deleteBookings);

app.use("/user", (req, res, next) => {
  if(!req.isLoggedIn){
    return res.redirect("/login");
  }
  // if(req.user.userType !== "guest"){
  //   return res.redirect("/");
  // }
  next();
});

app.use("/user", userRouter);

app.use("/host", (req, res, next) => {
  if(!req.isLoggedIn){
    return res.redirect("/login");
  }
  if(req.user.userType !== "host"){
    return res.redirect("/");
  }
  next();
});

app.use("/host", hostRouter);



app.post("/details", HomeController.postDetails);

app.use(ErrorController.error404);


const PORT = 3000;


mongoose.connect(urlDB).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on address http:/localhost:${PORT}`);
  });
}).catch(err => {
  console.log("Error while connecting to the database.",err);
});