'use strict';
module.exports = (sequelize, DataTypes) => {

    var Booking = sequelize.define('Booking', {
        start: DataTypes.DATE,
        end: DataTypes.DATE,
        status: DataTypes.STRING,
        persons: DataTypes.INTEGER
    });

    Booking.associate = function(models) {
        // associations can be defined here
    };

    return Booking;
};