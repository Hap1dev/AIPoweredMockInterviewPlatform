import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import registerRoutes from "./routes/registerRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import startInterviewRoutes from "./routes/startInterviewRoutes.js";
import initializePassport from "./config/passportConfig.js";
import { db } from "./models/db.js";

const app = express();
const port = 3000;
dotenv.config({path: "./../.env"});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: "TOPSECRETWORD",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000*60*60*24
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/home", homeRoutes);
app.use("/start-interview", startInterviewRoutes);


app.get("/", (req, res) => {
  res.redirect("/home");
});

initializePassport(passport, db);

app.listen(port, () => {
  console.log("server running on port " + port);
});