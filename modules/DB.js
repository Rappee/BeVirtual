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
    getStores(callback) {
        queryNoParams("select * from stores", callback);
    },

    getStore(id, callback) {
        query("select * from stores where id = ?", [id], callback);
    },

    getOpeningPeriods(storeid, callback) {
        query("select distinct validFrom, validTill from open where StoreId = ?", [storeid], callback);
    },

    getOpeningHours(storeid, periodFrom, periodTill, callback) {
        query("select weekday, openFrom, duration from open where StoreId = ? and validFrom = ? and validTill = ?", [storeid, periodFrom, periodTill], callback);
    }
};

module.exports = DB;