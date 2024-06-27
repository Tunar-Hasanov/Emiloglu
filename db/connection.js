const mongoose = require("mongoose");

// database config
const mongo = mongoose.connect('mongodb+srv://hasanovtunar2008:qbgAuXKRpbcCW5zr@cluster0.reof277.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const connection = async () => {
  mongo
  .then(console.log("Database connection Succesfully"))
  .catch((err) => {
    console.log("Database connection error: ", err);
  });
}

module.exports = connection;
