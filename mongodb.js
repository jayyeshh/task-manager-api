//CRUD operations:
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log("Something went wrong! Database in not connected!", err);
  }

  const db = client.db(databaseName);

  // db.collection('users').insertOne({
  //     name: 'john wick',
  //     age: '56'
  // })

  // db.collection('users').insertMany([{
  //     name: 'john snow',
  //     age: '34'
  // }, {
  //     name: 'rohddy',
  //     age: '42'
  // }], (err, result) => {
  //     if (err) {
  //         return console.log("Something went wrong! Documents not inserted in db! ", err);
  //     }

  //     console.log("[+] Success!", result.ops)
  // });

  // db.collection('tasks').insertMany([
  //     {
  //         description: 'Clean the house',
  //         completed: true
  //     },
  //     {
  //         description: 'Renew inspection',
  //         completed: false
  //     }, {
  //         description: 'pot plants',
  //         completed: true
  //     }
  // ], (err, result) => {
  //     if (err) return console.log('Something went wrong! Documents not inserted! ', err);
  //     console.log(result.ops);
  // })

  db.collection("tasks")
    .find({ completed: true })
    .toArray((err, results) => {
      if (err) {
        return console.log(
          "Something went wrong! cannot fetch documents! ",
          err
        );
      }

      console.log(results);
    });

  db.collection("tasks")
    .updateMany(
      { completed: false },
      {
        $set: {
          completed: true,
        },
      }
    )
    .then((result) => {
      console.log(result.modifiedCount);
    })
    .catch((err) => {
      console.log("Something went wrong!", err);
    });
});
