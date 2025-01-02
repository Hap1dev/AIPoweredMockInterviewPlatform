import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import bodyParser from "body-parser";
import OpenAI from "openai";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";

const app = express();
const port = 3000;
dotenv.config({path: "./../.env"});
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});
const saltRounds = 10;
const db = new pg.Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
});

db.connect();

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

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  res.status(200).json({msg: "this is register page"});
});

app.get("/login", (req, res) => {
  res.status(200).json({msg: "this is login page"});
});

app.get("/home", (req, res) => {
  console.log(req.user);
  if(req.isAuthenticated()){
    res.status(200).json({msg: "this is home page"});
  }else{
    res.redirect("/login");
  }
});

app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

app.get("/auth/google/home", passport.authenticate("google", {
  successRedirect: "/home",
  failureRedirect: "/login"
}));

app.post("/register", async (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
  try{
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if(checkResult.rows.length > 0){
      res.send("email already exist, Try logging in");
    }else{
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if(err){
          console.error(err);
        }else{
          const result = await db.query("INSERT INTO users (firstname, lastname, email, password) VALUES($1, $2, $3, $4)", [firstname, lastname, email, hash]);
          res.sendStatus(200);
        }
      });
    }
  }catch(err){
    console.error(err);
  }
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login"
}));

passport.use("local", new Strategy(async function verify(username, password, cb){
  try{
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [username]);
    if(checkResult.rows.length > 0){
      const user = checkResult.rows[0];
      const storedHashPassword = user.password;
      bcrypt.compare(password, storedHashPassword, (err, result) => {
        if(err){
          return cb(err);
        }else{
          if(result){
            return cb(null, user);
          }else{
            return cb(null, false);
          }
        }
      });
    }else{
      return cb("User Not Found");
    }
  }catch(err){
    return cb(err);
  }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/home",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
  async (accessToken, refreshToken, profile, cb) => {
    const firstname = profile.name.givenName;
    const lastname = profile.name.familyName;
    const email = profile.email;
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if(checkResult.rows.length === 0){
      const newUser = await db.query("INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)", [firstname, lastname, email, "google"]);
      cb(null, newUser.rows[0]);
    }else{
      cb(null, checkResult.rows[0]);
    }
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

async function main() {
  const chatCompletion = await client.chat.completions.create({
  	model: "gpt-4o-mini",
    messages: [{ role: "user", content: "hello" }]
  });
}

app.listen(port, () => {
  console.log("server running on port " + port);
});