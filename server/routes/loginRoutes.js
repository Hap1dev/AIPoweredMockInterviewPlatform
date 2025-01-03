import express from "express";
import passport from "passport";

const router = express.Router();



router.get("/", (req, res) => {
  res.status(200).json({msg: "this is login page"});
});

router.post("/", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login"
}));

export default router;