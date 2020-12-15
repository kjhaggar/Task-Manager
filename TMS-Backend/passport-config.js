const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const User = require("./database/models/user");

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      User.findOne({ email: email })
        .select("+password")
        .exec((err, user) => {
          if (err) {
            return done(err);
          }
          if (!user || !user.isValid(password)) {
            return done(null, false);
          }
          return done(null, user);
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
