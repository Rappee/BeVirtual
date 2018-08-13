'use strict';
module.exports = (sequelize, DataTypes) => {

    var OpeningPeriod = sequelize.define('OpeningPeriod', {
        from: DataTypes.DATEONLY,
        to: DataTypes.DATEONLY
    });

    OpeningPeriod.associate = function(models) {
        // associations can be defined here
    };

    return OpeningPeriod;
};