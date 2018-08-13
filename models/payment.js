'use strict';
module.exports = (sequelize, DataTypes) => {
  var payment = sequelize.define('payment', {
    amount: DataTypes.INTEGER,
    method: DataTypes.STRING
  }, {});
  payment.associate = function(models) {
    // associations can be defined here
  };
  return payment;
};