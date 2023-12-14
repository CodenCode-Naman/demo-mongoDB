const { MongoClient } = require("mongodb");

let dbConnection;

/* The code is exporting an object with two properties: `connectToDb` and `getDb`. */
module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect("mongodb://localhost:27017/BookStores")
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
