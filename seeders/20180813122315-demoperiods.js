'use strict';

const from = new Date(2018,0,1);
const till = new Date(2018,11,31);
const duration = 30;

function getDataObject(from, till, day, duration, openfrom, opentill) {
    var data = [];
    var start = openfrom.split(':'); // ['hh','mm']
    var end = opentill.split(':');
    var count = 0;

    var curr = start;

    while(isTimeBeforeTime(curr, end)) {
        data.push({
            validFrom: from,
            validTill: till,
            weekday: day,
            openfrom: curr.join(':'),
            duration: 30,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        curr = incrementTime(curr, 30);
    }

    return data;
}

function isTimeBeforeTime(time1, time2) {
    if(time1[0] === '00')
        time1[0] = '24';
    if(time2[0] === '00')
        time2[0] = '24';

    return time1[0] < time2[0] || (time1[0] === time2[0] && time1[1] <= time2[1]);
}

function incrementTime(time, step) {
    var hh = parseInt(time[0]);
    var mm = parseInt(time[1]) + step;

    if(mm >= 60) {
        hh += Math.floor(mm / 60);
        mm = mm % 60;
    }

    hh = formatWithZero(hh);
    mm = formatWithZero(mm);

    return [hh, mm];
}

function formatWithZero(number) {
    var res;
    if(number < 10)
        res = '0' + number;
    else
        res = String(number);

    return res;
}

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Open', getDataObject(from, till, 'Wo', 30, '14:00', '19:30'));
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Open', null, {});
    }
};