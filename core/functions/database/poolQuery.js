const returnPool = require('./returnPool');
module.exports = function(query, dbName) {
    const pool = returnPool(dbName != undefined ? dbName : 'cardinal');
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query(query, function(err, result) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
}