const config = require('./../../../config.json');
const mysql = require('mysql');
module.exports = function(dbName) {
    return mysql.createPool({
        connectionLimit: 10,
        host: config.mysql[dbName].host == undefined ? 'localhost': config.mysql[dbName].host,
        user: config.mysql[dbName].username,
        password: config.mysql[dbName].password,
        database: dbName
    });
}