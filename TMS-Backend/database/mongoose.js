const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://TaskDB:taskdb@cluster0.fbw4x.mongodb.net/taskmanager?authSource=admin&replicaSet=atlas-14bvle-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("Databse connected"))
  .catch((err) => console.log(err));

module.exports = mongoose;
