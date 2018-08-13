'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Open', 'StoreId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Stores',
                key: 'id'
            }
        }).then(() => {
            return queryInterface.addColumn('ClosingPeriods', 'StoreId', {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Stores',
                    key: 'id'
                }
            })
        }).then(() => {
            return queryInterface.addColumn('Products', 'StoreId', {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Stores',
                    key: 'id'
                }
            })
        }).then(() => {
            return queryInterface.addColumn('Bookings', 'StoreId', {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Stores',
                    key: 'id'
                }
            })
        }).then(() => {
            return queryInterface.addColumn('Bookings', 'CustomerId', {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Customers',
                    key: 'id'
                }
            })
        }).then(() => {
            return queryInterface.addColumn('Bookings', 'PaymentId', {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Payments',
                    key: 'id'
                }
            })
        }).then(() => {
            return queryInterface.addColumn('Bookings', 'ProductId', {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Products',
                    key: 'id'
                }
            })
        })
    },

    down: async (queryInterface, Sequelize) => {
        return [
            await queryInterface.removeColumn('Products', 'StoreId'),
            await queryInterface.removeColumn('Bookings', 'ProductId'),
            await queryInterface.removeColumn('Bookings', 'PaymentId'),
            await queryInterface.removeColumn('Bookings', 'CustomerId'),
            await queryInterface.removeColumn('Bookings', 'StoreId'),
            await queryInterface.removeColumn('ClosingPeriods', 'StoreId'),
            await queryInterface.removeColumn('Open', 'StoreId')
        ];
    }
};
