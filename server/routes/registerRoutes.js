import express from "express";
import { db } from "./../models/db.js";
import bcrypt from "bcrypt";


const router = express.Router();
const saltRounds = 10;

router.get("/", (req, res) => {
  res.status(200).json({msg: "this is register page"});
});


router.post("/", async (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (checkResult.rows.length > 0) {
            res.json({ success: false, msg: "Email already exists, try logging in" });
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ success: false, msg: "Server error" });
                } else {
                    await db.query("INSERT INTO users (firstname, lastname, email, password) VALUES($1, $2, $3, $4)", [firstname, lastname, email, hash]);
                    res.json({ success: true, redirect: "http://localhost:5173/home" });
                }
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

export default router;