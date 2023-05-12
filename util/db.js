const {createPool} = require('mysql')

// require('dotenv').config();
console.log('hellooooooooooooooooooo')
const connection = createPool(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
  }
);

module.exports = connection

// basic promise wrapper if you want to just convert a callback to a promise
// connection.queryPromise = (sql, params) => {
//   return new Promise( (resolve, reject) => {
//     connection.query(sql, params, (err, rows) => {
//       if (err){
//         reject(err);
//       } else {
//         resolve(rows);
//       }
//     })
//   })
// };

// go further and process the results of the promise and return the results

// connection.querySync = async (sql, params) => {
//   let promise = new Promise ( (resolve, reject) => {
//     console.log("Executing query: ", sql);
//     connection.query(sql, params, (err, results) => {
//       if(err){
//         console.log("rejecting");
//         return reject(err);
//       } else {
//         console.log("resolving");
//         return resolve(results);
//       }
//     })
//   })

//   let results = await promise.then ( (results) => {
//     console.log("results ", results);
//     return results;

//   }).catch( (err) => {
//     throw err;
//   })
//   return results;

// }

// connection.query(sql, callback function)

// test to see if the connection was made

// connection.query("select now()", (err, rows) => {
// if(err) {
//   console.log("Not connected ", err);
// } else {
//   console.log("Connected ", rows)
// }

// });

module.exports = connection;