import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/google/home", passport.authenticate("google", {
  successRedirect: "/home",
  failureRedirect: "/login"
}));

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

export default router;