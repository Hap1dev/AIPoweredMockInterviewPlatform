import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import bcrypt from "bcrypt";


const initializePassport = (passport, db) => {
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
}

export default initializePassport;