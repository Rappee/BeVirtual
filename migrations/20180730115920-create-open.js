'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Open', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      validFrom: {
        type: Sequelize.DATEONLY
      },
      validTill: {
        type: Sequelize.DATEONLY
      },
      weekday: {
        type: Sequelize.STRING(2)
      },
      openFrom: {
        // example: "14:30"
        type: Sequelize.STRING(5)
      },
      duration: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Open');
  }
};