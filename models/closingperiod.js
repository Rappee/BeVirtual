'use strict';
module.exports = (sequelize, DataTypes) => {

    var ClosingPeriod = sequelize.define('ClosingPeriod', {
        from: DataTypes.DATEONLY,
        to: DataTypes.DATEONLY
    });

    ClosingPeriod.associate = function(models) {
        // associations can be defined here
    };

    return ClosingPeriod;
};