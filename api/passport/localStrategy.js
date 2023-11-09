const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("../../db/dbConnect");

async function getUserHashedPassword(id) {
  db.query(
    `select password from users where id = ${id} `,
    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      // connected!
    }
  );
}

module.exports = () => {
  passport.use(
    new LocalStrategy(async function verify(id, password, cb) {
      try {
        const user = await getUserHashedPassword(id);
        if (user) {
          const result = await bcrypt.compare(password, user.password);
          if (result) return cb(null, user);
          return cb(null, false, { message: "비밀번호가 일치하지 않습니다." });
        }
        return cb(null, false, { message: "가입되지 않은 회원입니다." });
      } catch (error) {
        console.error(error);
        cb(error);
      }
    })
  );
};
