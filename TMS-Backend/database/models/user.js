const mongoose = require("mongoose");
var bcrypt = require("bcrypt");

const assignedTask = new mongoose.Schema({
  pid: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
  },
});

const UserSchema = new mongoose.Schema({
  role: { type: String, default: "company_user" },
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, require: true, lowercase: true, unique: true },
  phone: { type: Number },
  password: { type: String, require: true, select: false },
  image: { type: String },
  projectIds: [assignedTask],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

UserSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
};

UserSchema.methods.isValid = function (hashedpassword) {
  return bcrypt.compareSync(hashedpassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
