import express from "express";
import passport from "passport";

const router = express.Router();



router.get("/", (req, res) => {
  res.redirect("http://localhost:5173/login");
});

router.post("/", passport.authenticate("local", {
  successRedirect: "/api/home",
  failureRedirect: "/login"
}));

export default router;