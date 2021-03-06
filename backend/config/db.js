const mongoose = require("mongoose");
const config = require("config");
// Importing mongoURI from the config file.
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true
    });

    console.log("MongoDB Connected Succesfully");
  } catch (err) {
    console.error(err.message);
    //Exit if any error occured
    process.exit(1);
  }
};
module.exports = connectDB;
