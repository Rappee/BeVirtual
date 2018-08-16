const weekdays = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
const dayStart = '08:00';
const dayEnd   = '23:30';
const storeId = window.location.pathname.match(/\/([0-9]+)\/?/)[1];

let currPeriod;
let periodDates = [];

let isMouseDown = false;
let highlightToggle;


$(document).ready(function () {
    console.log("Store ID: ", storeId);

    $('.period-slides-container #btn_next').click(function () {
        showNextPeriod();
    });

    $('.period-slides-container #btn_prev').click(function () {
        showPrevPeriod();
    });

    $('.period-slides-container #btn_create').click(function () {
        if(periodDates.length === 0) {

        } else {
            let last = periodDates[periodDates.length - 1].till;
            let from = new Date(last);
            let till = new Date(last);

            from.setDate(last.getDate() + 1);
            till.setFullYear(last.getFullYear() + 1);
            createPeriod(from, till);
            showPeriod(periodDates.length - 1);
        }
    });

    // for dynamically created elements bind the event static parent
    $('.period-slides-container').on('input', 'input#till', function (e) {
        let oldTill = periodDates[currPeriod].till;
        let newTill  = new Date($(this).val());
        let deleted = [];
        console.log("Till has changed in period " + currPeriod + "  (" + formatDate(oldTill) + " => " + formatDate(newTill) + ")");

        if(currPeriod === periodDates.length - 1) {
            // no successive period
            periodDates[periodDates.length - 1].till = newTill;
            console.log("[SQL] update open set validTill='" + formatDate(newTill) + "' where validFrom='" + formatDate(periodDates[currPeriod].from) + "'");
            DataBase.setTillWhereFrom(formatDate(newTill), formatDate(periodDates[currPeriod].from));
        } else {
            // successive period exists
            if(newTill > oldTill) {
                // to the future
                let i = currPeriod + 1;
                while(i < periodDates.length && periodDates[i].from <= newTill) {
                    // loop through successive periods
                    if(periodDates[i].till <= newTill) {
                        // period has been completly overlapped
                        // delete overlapped period
                        console.log("[SQL] delete from open where validFrom='" + formatDate(periodDates[i].from) + "' and validTill='" + formatDate(periodDates[i].till) + "'");
                        DataBase.deletePeriod(formatDate(periodDates[i].from), formatDate(periodDates[i].till));

                        periodDates.splice(i, 1);
                        removePeriodDom(i);

                        if(i === periodDates.length - 1) {
                            console.log("[SQL] update open set validTill='" + formatDate(newTill) + "' where validFrom='" + formatDate(periodDates[currPeriod].from) +"'");
                            DataBase.setTillWhereFrom(formatDate(newTill), formatDate(periodDates[currPeriod].from));
                            periodDates[currPeriod].till = newTill;
                        }
                    } else {
                        // period will be sliced
                        console.log("[SQL] update open set validTill='" + formatDate(newTill)+ "' where validFrom='" + formatDate(periodDates[currPeriod].from) + "'");
                        DataBase.setTillWhereFrom(formatDate(newTill), formatDate(periodDates[currPeriod].from));
                        periodDates[currPeriod].till = newTill;

                        let newFrom = new Date(newTill);
                        newFrom.setDate(newFrom.getDate() + 1);
                        console.log("[SQL] update open set validFrom='" + formatDate(newFrom) + "' where validTill='" + formatDate(periodDates[i].till) + "'");
                        DataBase.setFromWhereTill(formatDate(newFrom, formatDate(periodDates[i].till)));
                        periodDates[i].from = newFrom;
                        i++;
                    }
                }
            } else {
                // in the past
                console.log("[SQL] update open set validTill='" + formatDate(newTill) + "' where validFrom='" + formatDate(periodDates[currPeriod].from) + "'");
                DataBase.setTillWhereFrom(formatDate(newTill), formatDate(periodDates[currPeriod].from));
                periodDates[currPeriod].till = newTill;

                let newFrom = new Date(newTill);
                newFrom.setDate(newFrom.getDate() + 1);
                console.log("[SQL] update open set validFrom='" + formatDate(newFrom) + "' where validTill='" + formatDate(periodDates[currPeriod+1].till) + "'");
                DataBase.setFromWhereTill(formatDate(newFrom), formatDate(periodDates[currPeriod+1].till));
                periodDates[currPeriod+1].from = newFrom;
            }

            console.log(periodDates);
            updatePeriodsDom();
        }
    });

    $('#timetable')
        .on('mousedown', 'td', function () {
            isMouseDown = true;
            $(this).toggleClass('highlighted');
            if($(this).hasClass('highlighted'))
                highlightToggle = true;
            else
                highlightToggle = false;
            return false; //prevent text selection
        })
        .on('mouseover', 'td', function () {
            if(isMouseDown)
                if(highlightToggle)
                    $(this).addClass('highlighted');
                else
                    $(this).removeClass('highlighted');

        })
        .bind('selectstart', function () {
            return false; //prevent text selection in IE
        });

    $(this).mouseup(function () {
        isMouseDown = false;
    });

    initializeTable(dayStart, dayEnd);
    loadPeriods();
});

// -----------------------------------------------------------------------------------------
// Periods
// -----------------------------------------------------------------------------------------

function loadPeriods() {
    $.ajax({
        method: 'GET',
        url: '/dashboard/storeconfig/' + storeId + '/getperiods',
        success: function(data) {
            if(data.length === 0) {
                console.log("No periods in database")
            } else {
                console.log("Periods from database: ", data);

                data.forEach(function (period) {
                    validFromDate = new Date(period.validFrom);
                    validTillDate = new Date(period.validTill);

                    createPeriod(validFromDate, validTillDate);
                });

                showPeriod(0);
            }
        }
    });
}

function createPeriod(fromDate, tillDate) {
    periodDates.push({from: fromDate, till: tillDate});

    let dom = getPeriodSlideDom(fromDate, tillDate);

    $('.period-slides-container').append(dom);

    if(periodDates.length > 1)
        showDeleteButton();
}

function removePeriodDom(index) {
    $('.period-slide').eq(index).remove();

    if(periodDates.length === 1)
        hideDeleteButton();
}

function showPeriod(index) {
    let slides = $('.period-slide');

    if(index < 0 || index >= slides.length) {
        console.log("Invalid period index: " + index + " (must be between 0 and " + (slides.length-1) + ")");
        return;
    }

    index === 0 ? hidePrevButton() : showPrevButton();
    index === periodDates.length - 1 ? showCreateButton() : showNextButton();

    currPeriod = index;
    slides.each(function () {
        $(this).css('display', 'none');
    });
    slides.eq(index).css('display', 'block');

    clearTableCells();
    fillTable(periodDates[currPeriod].from, periodDates[currPeriod].till);
}

function showNextPeriod() { showPeriod(currPeriod+1); }

function showPrevPeriod() { showPeriod(currPeriod-1); }

function hidePrevButton() { $('.period-slides-container #btn_prev').css('visibility', 'hidden'); }

function showPrevButton() { $('.period-slides-container  #btn_prev').css('visibility', 'visible'); }

function showCreateButton() {
    $('.period-slides-container #btn_next').css('display', 'none');
    $('.period-slides-container #btn_create').css('display', 'block');
}

function showNextButton() {
    $('.period-slides-container #btn_next').css('display', 'block');
    $('.period-slides-container #btn_create').css('display', 'none');
}

function showDeleteButton() { $('.period-slides-container #btn_delete').css('visibility', 'visible'); }

function hideDeleteButton() { $('.period-slides-container #btn_delete').css('visibility', 'hidden'); }

function updatePeriodsDom() {
    $('.period-slide').each(function (index) {
        let from = formatDate(periodDates[index].from);
        let till = formatDate(periodDates[index].till);
        $(this).find('input#from').val(from);
        $(this).find('input#till').val(till);
    });

    if(periodDates.length === 1) {
        showCreateButton();
        hideDeleteButton();
    } else {
        showDeleteButton();
    }
}

function DBUpdateTill() {

}
// -----------------------------------------------------------------------------------------
// Timetable
// -----------------------------------------------------------------------------------------

function initializeTable(starttime, endtime) {
    clearTable();
    let start = starttime.split(':'); // ['hh','mm']
    let end = endtime.split(':');

    if(end[0] === '00')
        end[0] = '24';

    let curr = start;

    while(isTimeBeforeTime(curr, end)) {
        appendTableRow(curr.join(':'));
        curr = incrementTime(curr, 30);
    }
}

function appendTableRow(timestr) {
    let row = $('<tr>');

    row.append($('<th>').addClass('time-col').text(timestr));
    for(let i = 0; i < 7; i++) {
        row.append($('<td>').addClass('day-col'));
    }

    $('#timetable tbody').append(row);
}

function clearTable() {
    $('#timetable tbody').empty();
}

function clearTableCells() {
    $('#timetable tbody td').removeClass('highlighted');
}

function getTableData() {
    let data = [];
    $('#timetable tbody').find('td.highlighted').each(function () {
        let time = $(this).siblings().first().text();
        let day = weekdays[ $(this).prevAll('td').length ];

        data.push({
            weekday: day,
            openFrom: time,
            duration: timeInterval
        });
    });
    return data;
}

function fillTable(from, till) {
    fromString = formatDate(from);
    tillString = formatDate(till);

    $.ajax({
        method: 'GET',
        url: '/dashboard/storeconfig/' + storeId + '/openinghours?from=' + fromString + '&till=' + tillString,
        success: function(data) {
            console.log("response: ", data);
            data.forEach(function (block) {
                let daynr = weekdays.indexOf(block.weekday.toLowerCase());
                $('#timetable tbody').find('tr:contains("' + block.openFrom + '") td').eq(daynr).addClass('highlighted');
            });
        }
    });
}

function saveInDatabase() {
    let from = periodDates[slideIndex][0];
    let till = periodDates[slideIndex][1];
    let data = {
        validFrom: from,
        validTill: till,
        blocks: getTableData()
    };

    $.ajax({
        method: 'POST',
        url: window.location.href + '/openinghours',
        contentType: 'application/json',
        data: JSON.stringify(data)
    });
}

// -----------------------------------------------------------------------------------------
// Date and Time functions
// -----------------------------------------------------------------------------------------

function formatDate(date) {
    let month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function isTimeBeforeTime(time1, time2) {
    if(time1[0] === '00')
        time1[0] = '24';
    if(time2[0] === '00')
        time2[0] = '24';

    return time1[0] < time2[0] || (time1[0] === time2[0] && time1[1] <= time2[1]);
}

function incrementTime(time, step) {
    hh = parseInt(time[0]);
    mm = parseInt(time[1]) + step;

    if(mm >= 60) {
        hh += Math.floor(mm / 60);
        mm = mm % 60;
    }

    hh = formatWithZero(hh);
    mm = formatWithZero(mm);

    return [hh, mm];
}

function formatWithZero(number) {
    let res;
    if(number < 10)
        res = '0' + number;
    else
        res = String(number);

    return res;
}

// -----------------------------------------------------------------------------------------
// Database calls
// -----------------------------------------------------------------------------------------
var DataBase = {
    setTillWhereFrom: function (till, from) {
        $.ajax({
            method: 'POST',
            url: '/dashboard/storeconfig/' + storeId + '/period/update',
            data: {set: "till", till: till, from: from},
            success: function () {
                console.log("set till where from successful")
            }
        });
    },
    setFromWhereTill: function (from, till) {
        $.ajax({
            method: 'POST',
            url: '/dashboard/storeconfig/' + storeId + '/period/update',
            data: {set: "from", till: till, from: from},
            success: function () {
                console.log("set from where till successful")
            }
        });
    },
    deletePeriod: function (from, till) {
        $.ajax({
            method: 'POST',
            url: '/dashboard/storeconfig/' + storeId + '/period/delete',
            data: {till: till, from: from},
            success: function () {
                console.log("delete period successful")
            }
        });
    }
};

// -----------------------------------------------------------------------------------------
// HTML Elements
// -----------------------------------------------------------------------------------------

function getPeriodSlideDom(fromDate, tillDate) {
    let from = formatDate(fromDate);
    let till = formatDate(tillDate);
    let today = new Date();

    console.log(fromDate, today);
    let min = (fromDate < today ? today : fromDate);
    min = formatDate(min);

    let html =
        '   \
            <div class="period-slide">  \
                <div class="d-flex">    \
                    <div class="input-group input-group-sm mr-2">   \
                        <div class="input-group-prepend">   \
                            <span class="input-group-text">From</span>  \
                        </div>  \
                        <input id="from" class="form-control" type="date" value="' + from + '" readonly>    \
                    </div>  \
                    <div class="input-group input-group-sm mr-2">   \
                        <div class="input-group-prepend">   \
                            <span class="input-group-text">Till</span>  \
                        </div>  \
                        <input id="till" class="form-control" type="date" min="' + min + '" value="' + till + '">    \
                    </div>  \
                    <div class="d-flex align-items-center"> \
                        <span id="btn_delete" class="far fa-trash-alt" title="delete opening period"></span>    \
                    </div>  \
                </div>  \
            </div>  \
        ';

    return $(html);
}