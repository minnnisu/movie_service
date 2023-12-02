const GoogleStrategy = require("passport-google-oauth2").Strategy;
const HttpError = require("../../error/HttpError");
const dotenv = require("dotenv");
const passport = require("passport");
const userModel = require("../../model/userModel");

dotenv.config();

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback",
        passReqToCallback: true,
        scope: ["profile", "email"],
      },
      async function (request, accessToken, refreshToken, profile, done) {
        try {
          const user = await userModel.getUser(profile.id);

          if (user.length > 0) {
            done(null, user[0]); // 이미 가입된 구글 프로필이면 로그인
          } else {
            // 가입되지 않는 유저
            //  회원가입 및 로그인
            await userModel.addNewGoogleUser({
              id: profile.id,
              email: profile?.email[0].value,
              name: profile.displayName,
              provider: "google",
            });

            const newUser = await userModel.getUser(profile.id);
            done(null, newUser[0]);
          }
        } catch (error) {
          console.error(error);
          done(new HttpError(500, "login_error"));
        }
      }
    )
  );
};
