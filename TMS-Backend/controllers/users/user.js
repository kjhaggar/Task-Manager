const User = require("../../database/models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.getAllUser = (req, res) => {
  User.find({})
    .then((user) => {
      res.send(user);
    })
    .catch((err) => console.log(err));
};

exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      const picked = (({ firstName, lastName, email, phone }) => ({
        firstName,
        lastName,
        email,
        phone,
      }))(user);
      res.send(picked);
    })
    .catch((err) => console.log(err));
};

exports.postUser = (req, res) => {
  new User({
    role: "company_user",
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: User.hashPassword(req.body.password),
  })
    .save()
    .then((task) => res.send(task))
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
};

exports.loginUser = (req, res, next) => {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return res
        .status(501)
        .json({ err, success: false, message: "Unable To login." });
    }

    if (!user) {
      return res.status(501).json({
        success: false,
        message: "Username or password is incorrect..!!",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.access_token_secret, {
      expiresIn: 86400,
    });
    req.logIn(user, function (err) {
      if (err) {
        return res.status(501).json(err);
      }
      return res.status(200).json({
        token: token,
        role: user.role,
        userId: user._id,
      });
    });
  })(req, res, next);
};

exports.getListByUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user.projectIds))
    .catch((err) => console.log(err));
};

exports.deleteUser = (req, res) => {
  User.findByIdAndDelete({ _id: req.params.userId })
    .then((user) => res.send(user))
    .catch((err) => console.log(err));
};
