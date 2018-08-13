var mysql = require('mysql');
var config = require('../config/config.json');

var pool  = mysql.createPool({
    connectionLimit : config.database.connectionLimit,
    host    : config.database.host,
    user    : config.database.user,
    password: config.database.pass,
    database: config.database.name,
    timezone: 'Z'
});

module.exports = {
    getConnection : function(callback){
        pool.getConnection(callback);
    }
};

