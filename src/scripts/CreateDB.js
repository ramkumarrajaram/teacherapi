const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    connection.query('CREATE DATABASE IF NOT EXISTS testdb', function (err) {
        if (err) throw err;
        console.log("Database created");
    });
    if (connection) connection.end();

});

module.exports = connection;