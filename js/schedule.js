var today = new Date();
var day = getCol(today);
var monday = new Date(today.getTime() - (day - 1) * 24 * 60 * 60 * 1000);
var sunday = new Date(today.getTime() + (7 - day) * 24 * 60 * 60 * 1000);

function show_schedule() {
    // draw_table(7);

    draw_details();

    draw_events();

    painting();
}

function draw_table(n) {

}

function draw_week_table() {

}

function draw_details() {
    var dayIndex = new Date(monday.getTime());

    $('.first-row-th').each(function () {
            this.innerHTML += ', ' + dayIndex.getDate() + '.' + (dayIndex.getMonth() + 1);
            dayIndex = new Date(dayIndex.getTime() + 24 * 60 * 60 * 1000);
        }
    )
}

//Форматирование даты к виду "2017-12-25"
function formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

//Получение даты из строки вида "2017-12-25"
function getDate(s) {
    return new Date(+s.substr(0, 4), +s.substr(5, 2) - 1, +s.substr(8));
}

//Получение номера колонки по дате
function getCol(date) {
    var result = date.getDay();
    if (result === 0) result = 7;
    return result;
}

//Получение номера строки по времени в формате "18:59:00"
function getRow(s) {
    return (+s.substr(0, 2) + +s.substr(3, 2) / 60) * 2 + 1;
}

function getRowNum(start, end) {
    return getRow(end) - getRow(start);
}


//Только для текущей таблицы работает (функции соответствуют таблице на 7 дней)
function draw_events() {
    var query = 'http://localhost:8080/rest/eventchange/?from=' +
        formatDate(monday) +
        '&to=' +
        formatDate(sunday);
    // 2017-06-05&to=2017-06-11';

    $.ajax({
        type: "GET",
        datatype: "json",
        url: query,
        headers: {
            'idTutor': getCookie("idTutor")
        }
    }).then(function (data) {
        $.each(data, function (i, elem) {
            var currentDate = getDate(elem.currentDate);
            var timeStart = elem.timeStart;
            var timeEnd = elem.timeEnd;
            var timeDiff = getRowNum(timeStart, timeEnd);
            // console.log(elem.timeStart + ' ' + (getRow(elem.timeStart)));
            draw_event(getCol(currentDate), getRow(timeStart), i, timeDiff, elem.id, elem.currentDate);

            //TODO: убрать это потом?
            var ev = $('#event' + i);
            ev.append(elem.name);
        });
    });


    /*    var tr = $('tr:eq(5)');
        var td = $('td:eq(6)');
        // var tr = $('tr').eq(5);
        // var td = $('td').eq(6);

            tr.css({
                'background-color': 'green'
            });
            td.css({
                'background-color': 'blue'
            });*/

    /*    var div = $('<div id="event1"></div>').css({
            'position': 'absolute',
            'background-color': 'red',
            'top': tr.prop('offsetTop') + tr.closest('table').prop('offsetTop'),
            'left': td.prop('offsetLeft') + td.closest('table').prop('offsetLeft'),
            'width': td.prop('offsetWidth'),
            'height': td.prop('offsetHeight') * 5,
            'border': '2px solid black'
        });

        $("#schedule-table").append(div);
        $('#event1').draggable({
            axis: 'y',
            containment: 'parent',
            distance: 10,
            snap: 'td'
        });*/

    // draw_event(5, 6, 1);
}

//TODO Переписать с передачей объекта из JSON ?? - с учетом разных таблиц
function draw_event(col, row, i, n, id, currentDate) {
    var td = $('td').eq(col);
    var tr = $('tr').eq(Math.floor(row));

    var div = $('<div></div>', {
        id: "event" + i,
        class: "event",
        //Пример использования data-*
        data: {
            "id": id,
            "currentDate": currentDate
        }
    }).css({
        'position': 'absolute',
        'background-color': 'red',
        'top': tr.prop('offsetTop') + tr.closest('table').prop('offsetTop') + td.prop('offsetHeight') * (row % 1),
        'left': td.prop('offsetLeft') + td.closest('table').prop('offsetLeft'),
        'width': td.prop('offsetWidth'),
        'height': td.prop('offsetHeight') * n,
        'border': '2px solid black'
    }).draggable({
        axis: 'y',
        containment: 'parent',
        distance: 10,
        snap: 'td'
    }).on('click', show_detail_event)
        //Оно точно надо?
        .on('mouseup', clear_td_color);

    $("#schedule-table").append(div);

    //Получение из data
    // alert($('#event2_0').data('id'));
}

//Функция, вызываемая при клике на div.event
function show_detail_event() {
    var _this = $(this);
    $.ajax({
        type: "GET",
        datatype: "json",
        url: "http://localhost:8080/rest/event/" + _this.data('id'),
        headers: {
            'idTutor': getCookie("idTutor")
        }
    }).then(function (event) {
        var dialog = $('#event_detail');
        dialog.find('#name').val(event.name);
        //TODO формат вывода даты
        dialog.find('#currentDate').text(_this.data('currentDate'));
        dialog.find('#timeStart').val(event.timeStart);
        dialog.find('#timeEnd').val(event.timeEnd);
        dialog.find('#description').text(event.comment);

        var status;
        switch (event.repeatCode) {
            case 'NEVER':
                dialog.find('#repeat').addClass('no-display');
                break;
            case 'DAILY':
                status = 'Каждый день';
                break;
            case 'WEEKLY':
                status = 'Каждую неделю';
                break;
            case 'MONTHLY':
                status = 'Каждый месяц';
                break;
            case 'YEARLY':
                status = 'Каждый год';
                break;
        }
        dialog.find('#status').text(status);

        dialog.find('#dateStart').val(event.dateStart);
        if (event.dateEnd === null) {
            dialog.find('#date_end').toggleClass('no-display');
            dialog.find('#none_date_end').toggleClass('no-display');
        } else {
            dialog.find('#dateEnd').val(event.dateEnd);
        }

        dialog.modal('show');
    });
}

//Стираем выделение цветом всех td
function clear_td_color() {
    $('td').each(function() {
        $(this).removeClass('colored');
    });
}

function painting() {
    var x1, y1, x, y, td1, td2, col, row, n;
    $('td').not('.first-col-td').on('mousedown', function(event1) {
        td1 = $(this);
        $(document).on('mousemove', function(event2) {
            clear_td_color();
            // console.log(event2.pageX + " " + event2.pageY);
            x1 = event1.pageX;
            y1 = event1.pageY;
            x = event2.pageX - event1.pageX; //no
            y = event2.pageY - event1.pageY; //no
            //тоже пропуски
            // document.elementFromPoint(event2.pageX, event2.pageY).classList.add('colored');

            paint_by_coord(td1, event2.pageX, event2.pageY);

            // console.log(x + " " + y);
        }).on('mouseup', function() {
            // alert(td.index());
            // alert(td.closest('tr').index());


            /*var div = $('<div></div>')
                .css({
                    'position': 'absolute',
                    'background-color': 'blue',
                    'top': y1,
                    'left': x1,
                    'width': x,
                    'height': y,
                    'border': '1px solid black'
                });

            $("body").append(div);*/

            //Оно нужно?
            $(document).off('mousemove');
        })
    }).on('mouseup', function () {
        $(document).off('mousemove');
        td2 = $(this);

        row = td1.closest('tr').index();
        col = td1.index() + ((row + 1) % 2);
        var row2 = td2.closest('tr').index();
        n = row2 - row + 1;

        draw_event(col, row, 0, n, "0000");
    });
}

function paint_by_coord(td1, x2, y2) {
    var row = td1.closest('tr').index();
    var col = td1.index() + ((row + 1) % 2);
    $('tr').each(function() {
        var tr = $(this);
        tr.find('td').each(function() {
            var td = $(this);
            if (td.index() + ((tr.index() + 1) % 2) === col
                    && tr.index() >= row
                    && tr.index() <= $(document.elementFromPoint(x2, y2)).closest('tr').index()) {
                $(this).addClass('colored');
            }
        })
    })
}



