'use strict';
module.exports = (sequelize, DataTypes) => {

    var Product = sequelize.define('Product', {
        name: DataTypes.STRING,
        available: DataTypes.INTEGER,
        price1: DataTypes.INTEGER,
        price2: DataTypes.INTEGER,
        price3: DataTypes.INTEGER,
        price4: DataTypes.INTEGER
    });

    Product.associate = function(models) {
        // associations can be defined here
    };

    return Product;
};