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
import multer from "multer";
import fs from "fs";
import cors from "cors";
import audioRoutes from "./routes/audioRoutes.js";
import openaiRoutes from "./routes/openaiRoutes.js";
import feedbackRoutes from "./routes/feedback.js";


const app = express();
const port = 3000;
dotenv.config({path: "./../.env"});
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, "user_response.webm"); // Always save as "user_response.webm"
    },
});
const upload = multer({ storage });

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
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

app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/start-interview", startInterviewRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api", openaiRoutes);
app.use("/api/audio", feedbackRoutes);


app.get("/", (req, res) => {
  res.redirect("/home");
});
app.post("/upload-audio", upload.single("audio"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No audio file received" });
    }

    console.log("Audio received:", req.file);
    res.json({ message: "Audio uploaded successfully!", filePath: req.file.path });
});

initializePassport(passport, db);

app.listen(port, () => {
  console.log("server running on port " + port);
});