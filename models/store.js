'use strict';
module.exports = (sequelize, DataTypes) => {

    var Store = sequelize.define('Store', {
        address: DataTypes.STRING,
        zipcode: DataTypes.INTEGER,
        city: DataTypes.STRING,
        availableSlots: DataTypes.INTEGER
    });

    Store.associate = function(models) {
        models.Store.hasMany(models.Product);
    };

    return Store;
};