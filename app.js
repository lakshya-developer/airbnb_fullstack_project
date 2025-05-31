// Core Modules
const path = require('path');
// External Module
const express = require('express');

// Local Module Routes
const userRouter = require("./routes/userRouter")
const {hostRouter} = require("./routes/hostRouter")
const {registerdHomes} = require('./models/home');
const rootDir = require('./utils/pathUtil');
const HomeController = require('./controller/homes');
const ErrorController = require('./controller/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res , next) => {
  console.log(req.url, req.method);
  next();
})


app.use(express.urlencoded());

app.get("/", HomeController.getHome);

app.use("/user",userRouter);

app.use("/host",hostRouter);

app.use(ErrorController.error404);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on address http:/localhost:${PORT}`);
}) 