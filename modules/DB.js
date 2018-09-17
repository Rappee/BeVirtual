var connectionPool = require('./DBConnectionPool');
var async = require('async');

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
        query("select distinct validFrom, validTill from open where StoreId = ? order by validFrom, validTill", [storeid], callback);
    },

    getOpeningHours(storeid, periodFrom, periodTill, callback) {
        query("select weekday, openFrom, duration from open where StoreId = ? and validFrom = ? and validTill = ?", [storeid, periodFrom, periodTill], callback);
    },

    clearOpeningHours(storeid, periodFrom, periodTill, callback) {
        query("delete from open where StoreId=? and validFrom=? and validTill=?", [storeid, periodFrom, periodTill], callback);
    },

    setOpeningHours(storeid, periodFrom, periodTill, blocks, callback) {
        connectionPool.getConnection(function (err, connection) {
            if(err) {
                connection.release();
                throw err;
            }

            connection.beginTransaction(function (err) {
                if(err) { throw err; }
                // first delete current opening hours for store within period

                connection.query("delete from open where StoreId=? and validFrom=? and validTill=?", [storeid, periodFrom, periodTill], function (error, results) {
                    if (error) {
                        return connection.rollback(function () {
                            throw error;
                        })
                    }
                    console.log(">>>   Deleted " + results.affectedRows + " rows");


                    async.each(blocks, function (block, asyncCallback) {
                        connection.query("insert into open (validFrom, validTill, weekday, openFrom, duration, storeId) values (?,?,?,?,?,?)"
                            , [periodFrom, periodTill, block.weekday, block.openFrom, block.duration, storeid]
                            , function (error, results) {
                                if (error) {
                                    console.log(error);
                                    asyncCallback(error);
                                } else {
                                    console.log(">>>   inserted " + block.weekday + " " + block.openFrom);
                                    asyncCallback();
                                }
                            });
                    }, function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                throw err;
                            });
                        } else {
                            connection.commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        throw err;
                                    })
                                }
                                console.log(">>>   Transaction Finished");
                            });
                        }
                    });
                });
            });
            connection.release();
            callback();
        });
    },

    setTillWhereFrom(storeid, till, from, callback) {
        query("update open set validTill=? where validFrom=? and StoreId=?", [till, from, storeid], callback);
    },

    setFromWhereTill(storeid, till, from, callback) {
        query("update open set validFrom=? where validTill=? and StoreId=?", [from, till, storeid], callback);
    },

    deletePeriod(storeid, till, from, callback) {
        query("delete from open where validFrom=? and validTill=? and StoreId=?", [from, till, storeid], callback);
    },

    getProducts(storeid, callback) {
        query("select * from products where storeid=?", storeid, callback);
    },

    getProduct(storeid, productid, callback) {
        query("select * from products where storeid=? and id=?", [storeid, productid], callback);
    },

    addProduct(name, StoreId, duration, maxOverlapAtStart, pricePerPerson, minPersons, maxPersons, callback) {
        query("insert into products (name, StoreId, duration, maxOverlapAtStart, pricePerPerson, minPersons, maxPersons) values (?,?,?,?,?,?,?)"
            ,   [name, StoreId, duration, maxOverlapAtStart, pricePerPerson, minPersons, maxPersons]
            ,   callback);
    },

    updateProduct(id, name, StoreId, duration, maxOverlapAtStart, pricePerPerson, minPersons, maxPersons, callback) {
        query("update products set name=?, StoreId=?, duration=?, maxOverlapAtStart=?, pricePerPerson=?, minPersons=?, maxPersons=? where id=?"
            ,   [name, StoreId, duration, maxOverlapAtStart, pricePerPerson, minPersons, maxPersons, id]
            ,   callback);
    },

    deleteProduct(id, callback) {
        query("delete from products where id=?", id, callback);
    }
};

module.exports = DB;