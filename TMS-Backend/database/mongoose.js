const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Databse connected"))
  .catch((err) => console.log(err));

module.exports = mongoose;
