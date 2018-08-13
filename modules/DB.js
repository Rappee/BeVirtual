var connectionPool = require('./DBConnectionPool');

function query(query, params, callback) {
    connectionPool.getConnection(function (err, connection) {
        if(err) {
            connection.release();
            throw err;
        }
        connection.query(query, params, function (error, result) {
            if(error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
        connection.release();
    });
}

function queryNoParams(query, callback) {
    connectionPool.getConnection(function (err, connection) {
        if(err) {
            connection.release();
            throw err;
        }
        connection.query(query, function (error, result) {
            if(error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
        connection.release();
    });
}

// -----------------------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------------------

const DB = {
    getStores(callback) { queryNoParams("select * from stores", callback); },
    getStore(id, callback) { query("select * from stores where id = ?", [id], callback); }
};

module.exports = DB;