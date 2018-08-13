'use strict';
module.exports = (sequelize, DataTypes) => {

    var Customers = sequelize.define('Customers', {
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        age: DataTypes.INTEGER,
        gender: DataTypes.STRING,
        address: DataTypes.STRING,
        zipcode: DataTypes.INTEGER,
        city: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING
    });

    Customers.associate = function(models) {
        // associations can be defined here
    };

    return Customers;
};