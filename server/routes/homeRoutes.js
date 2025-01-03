import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.user);
  if(req.isAuthenticated()){
    res.status(200).json({msg: "this is home page"});
  }else{
    res.redirect("/login");
  }
});

export default router;