const mysql = require('mysql2');

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "iamadminlakshya",
  database: "airbnb",
});

module.exports = pool.promise();