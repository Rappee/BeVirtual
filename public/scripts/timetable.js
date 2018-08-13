const weekdays = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
const dayStart = '08:00';
const dayEnd = '23:30';

var slideIndex = 0;
var periods = [];
var timeInterval = 30; //minutes

$(document).ready(function () {
    var isMouseDown = false;
    var highlight;

    $('#timetable')
        .on('mousedown', 'td', function () {
            isMouseDown = true;
            $(this).toggleClass('highlighted');
            if($(this).hasClass('highlighted'))
                highlight = true;
            else
                highlight = false;
            return false; //prevent text selection
        })
        .on('mouseover', 'td', function () {
            if(isMouseDown)
                if(highlight)
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

    $('#btn_clear_table').click(function () {
        clearTableCells();
    });

    $('#btn_prev_slide').click(function () {
        showPrevSlide();
    });

    $('#btn_next_slide').click(function () {
        showNextSlide();
    });

    $('.period-slide-add-new').click(function () {
        createPeriod();
    });

    // bind listener to container, not to dynamically created buttons
    $('#period-container').on('click', 'div.active-slide button#btn_add_closing_period', function () {
        createClosedPeriod();
    });

    $('#period-container').on('click', 'div.active-slide span#btn_del_closing_period', function () {
        $(this).parents('.date-row').remove();
    });

    init();
});

function init() {
    $.ajax({
        method: 'GET',
        url: window.location.href + '/openinghours',
        success: function(data) {
            console.log("response: ", data);
        }
    });
    showSlide(slideIndex);
    initializeTable(dayStart, dayEnd);
}

// -----------------------------------------------------------------------------------------
// Timetable
// -----------------------------------------------------------------------------------------

function initializeTable(starttime, endtime) {
    clearTable();
    var start = starttime.split(':'); // ['hh','mm']
    var end = endtime.split(':');

    if(end[0] === '00')
        end[0] = '24';

    var curr = start;

    while(isTimeBeforeTime(curr, end)) {
        appendTableRow(curr.join(':'));
        curr = incrementTime(curr, 30);
    }
}

function appendTableRow(timestr) {
    var row = $('<tr>');

    row.append($('<th>').addClass('time-col').text(timestr));
    for(var i = 0; i < 7; i++) {
        row.append($('<td>').addClass('day-col'));
    }

    $('#timetable > tbody').append(row);1
}

function clearTable() {
    $('#timetable > tbody').empty();
}

function clearTableCells() {
    $('#timetable tbody td').removeClass('highlighted');
}

function hideTable() {
    $('#timetable').css('display', 'none');

    $('#card-time-table > .card-body').append(
        $('<h3>').text('Select an opening period in the \'Time Periods\' window').css('display', 'inline').prepend(
            $('<span>', {class: 'fas fa-info-circle fa-2x mr-3'})
        )
    );
}

function showTable() {
    $('#timetable').css('display', 'table');
}

function getTableData() {
    $('#timetable > tbody').find('td.highlighted').each(function () {
        var time = $(this).siblings().first().text();
        var day = weekdays[ $(this).prevAll('td').length ];

        console.log("Highlighted cell on ", day, " at ", time);
    });
}

// -----------------------------------------------------------------------------------------
// Period Carousel
// -----------------------------------------------------------------------------------------

function showSlide(index) {
    var slides = $('.period-slide');

    // 0 <= index <= slides.length - 1
    if(index >= slides.length) {
        slideIndex = slides.length - 1;
    } else if(index < 0) {
        slideIndex = 0;
    } else {
        slideIndex = index;
    }

    console.log("Displaying period slide nr: ", slideIndex + 1, ' of ', slides.length);

    // show/hide prev and next buttons
    showButtons();
    if(slideIndex === 0) {
        hidePrevButton();
        if (slides.length === 1)
            hideNextButton();
    } else if(slideIndex === slides.length - 1) {
        hideNextButton();
    }

    slides.each(function (i) {
        $(this).css('display', 'none');
        $(this).removeClass('active-slide');
    });

    slides.eq(slideIndex).css('display', 'block').addClass('active-slide');
}

function showNextSlide() {
    showSlide(++slideIndex);
}

function showPrevSlide() {
    showSlide(--slideIndex);
}

function hidePrevButton() {
    $('#btn_prev_slide').css('display', 'none');
}

function hideNextButton() {
    $('#btn_next_slide').css('display', 'none');
}

function showButtons() {
    $('#btn_prev_slide').css('display', 'block');
    $('#btn_next_slide').css('display', 'block');
}

function createPeriod() {
    var periodSlideHtml =
        '                                                                                                                   \
            <div class="col-md-10 period-slide" style="display: block;">                                                    \
                <h4>Open</h4>                                                                                               \
                <div class="date-row d-flex">                                                                               \
                    <div class="input-group input-group-sm mr-2">                                                           \
                        <div class="input-group-prepend">                                                                   \
                            <span class="input-group-text">From</span>                                                      \
                        </div>                                                                                              \
                        <input class="form-control" type="date">                                                            \
                    </div>                                                                                                  \
                    <div class="input-group input-group-sm mr-2">                                                           \
                        <div class="input-group-prepend">                                                                   \
                            <span class="input-group-text">Till</span>                                                      \
                        </div><input class="form-control" type="date">                                                      \
                    </div>                                                                                                  \
                    <div class="d-flex align-items-center">                                                                 \
                        <span class="far fa-trash-alt" title="delete opening period"></span>                                \
                    </div>                                                                                                  \
                </div>                                                                                                      \
                <hr>                                                                                                        \
                <h4>Closed</h4>                                                                                             \
                <div class="closed-period-container"></div>                                                                 \
                <button id="btn_add_closing_period" class="btn btn-sm btn-block btn-outline-secondary mt-3" type="button">Add Closing Period</button>   \
            </div>                                                                                                          \
        ';

    var periodSlideDOM = $(periodSlideHtml);
    $('#period-container').find('.period-slide-add-new').before(periodSlideDOM);

    var slideCount = $('.period-slide').length;
    showSlide(slideCount - 2);
}

function createClosedPeriod() {
    var html =
        '                                                                                   \
            <div class="date-row d-flex">                                                   \
                <div class="input-group input-group-sm mr-2">                               \
                    <div class="input-group-prepend">                                       \
                        <span class="input-group-text">From</span>                          \
                    </div>                                                                  \
                    <input class="form-control" type="datetime-local">                      \
                </div>                                                                      \
                <div class="input-group input-group-sm mr-2">                               \
                    <div class="input-group-prepend">                                       \
                        <span class="input-group-text">Till</span>                          \
                    </div>                                                                  \
                    <input class="form-control" type="datetime-local">                      \
                </div>                                                                      \
                <div class="input-group input-group-sm mr-2">                               \
                    <div class="input-group-prepend">\
                        <span class="input-group-text">Show as</span>\
                    </div> \
                    <select class="custom-select custom-select-sm">\
                        <option selected>Reservation</option>\
                        <option>Closed</option>\
                    </select> \
                </div>\
                <div class="d-flex align-items-center">                                     \
                    <span id="btn_del_closing_period" class="far fa-trash-alt" title="delete closing period"></span>    \
                </div>                                                                      \
            </div>                                                                          \
        ';

    $('.period-slide.active-slide').find('.closed-period-container').append( $(html) );
}

// -----------------------------------------------------------------------------------------
// Time Helper Functions
// -----------------------------------------------------------------------------------------

// time in ['hh', 'mm']
// accuracy in minutes
function roundTimeMinutes(time, accuracy) {
    mm = parseInt(time[1]);
    mm = Math.round(mm / accuracy) * accuracy;
    if(mm >= 60)
        mm -= accuracy;
    mm = formatWithZero(mm);
    return [time[0], mm];
}

// 01:00, 02:00,  .... ,23:00, 00:00
// time_ is ['hh', 'mm']
// will return true if time1 = time2
function isTimeBeforeTime(time1, time2) {
    if(time1[0] === '00')
        time1[0] = '24';
    if(time2[0] === '00')
        time2[0] = '24';

    return time1[0] < time2[0] || (time1[0] === time2[0] && time1[1] <= time2[1]);
}

// time is ['hh','mm']
// step increment in minutes
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

// 5  -> '05'
// 12 -> '12'
function formatWithZero(number) {
    var res;
    if(number < 10)
        res = '0' + number;
    else
        res = String(number);

    return res;
}