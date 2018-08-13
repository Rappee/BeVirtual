'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Stores', [{
            address: 'Ene Straat 53',
            zipcode: 9000,
            city: 'Gent',
            availableSlots: 4,
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            address: 'Andere Straat 18',
            zipcode: 2000,
            city: 'Antwerpen',
            availableSlots: 8,
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Stores', null, {});
    }
};
