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

//Получение даты из номера колонки
function getCurrentDate(col) {
    var date = new Date(monday.getTime() + (col - 1) * 24 * 60 * 60 * 1000);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
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

        dialog.find('#for-serial-group').addClass('no-display');
        dialog.find('#repeat').removeClass('no-display');

        dialog.find('#repeat_code_group').addClass('no-display');
        dialog.find('#status_group').removeClass('no-display');

        dialog.find('#serial-group').removeClass('no-display');

        var status;
        switch (event.repeatCode) {
            case 'NEVER':
                dialog.find('#repeat').addClass('no-display');
                break;
            case 'DAILY':
                status = 'Каждый день';
                dialog.find('#repeat').removeClass('no-display');
                break;
            case 'WEEKLY':
                status = 'Каждую неделю';
                dialog.find('#repeat').removeClass('no-display');
                break;
            case 'MONTHLY':
                status = 'Каждый месяц';
                dialog.find('#repeat').removeClass('no-display');
                break;
            case 'YEARLY':
                status = 'Каждый год';
                dialog.find('#repeat').removeClass('no-display');
                break;
        }
        dialog.find('#status').text(status);

        dialog.find('#dateStart').val(event.dateStart);
        if (event.dateEnd === null) {
            dialog.find('#date_end').addClass('no-display');
            dialog.find('#none_date_end').removeClass('no-display');
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

//Закрашивание td по щелчку и перемещению мыши + создание нового события
function painting() {
    var td1;
    $('td').not('.first-col-td').on('mousedown', function() {
        td1 = $(this);
        $(document).on('mousemove', function(event) {
            clear_td_color();
            paint_by_coord(td1, event.pageX, event.pageY);
        }).on('mouseup', function() {
            $(document).off('mousemove');
        })
    }).on('mouseup', function () {
        $(document).off('mousemove');
        var td2 = $(this);

        var row = td1.closest('tr').index();
        var col = td1.index() + ((row + 1) % 2);
        var row2 = td2.closest('tr').index();
        var n = row2 - row + 1;
        var currentDate = getCurrentDate(col);

        //Рисуем div нового события с id = 0 + стираем выделение цветом
        draw_event(col, row, 0, n, currentDate);
        clear_td_color();

        //Заполнение модального окна данными
        var dialog = $('#event_detail');
        dialog.find('#name').val("");
        dialog.find('#description').val("");

        dialog.find('#currentDate').text(currentDate);

        dialog.find('#timeStart').val(rowToTimeTop(row));
        dialog.find('#timeEnd').val(rowToTimeBot(row2));

        dialog.find('#for-serial-group').removeClass('no-display');
        dialog.find('#repeat').addClass('no-display');

        dialog.find('#dateStart').val(currentDate);
        dialog.find('#date_end').removeClass('no-display');
        dialog.find('#none_date_end').addClass('no-display');

        dialog.find('#repeat_code_group').removeClass('no-display');
        dialog.find('#status_group').addClass('no-display');

        dialog.find('#serial-group').addClass('no-display');

        dialog.modal('show');

        //Добавляем/убираем описание серии событий при клике по checkbox
        $('#with-serial').on('change', function() {
            if ($(this).prop('checked')) {
                $('#repeat').fadeIn().show();
            } else {
                $('#repeat').fadeOut(300);
            }
        });

        //Добавляем функцию создания события по кнопке "Сохранить"
        $('#save_btn').on('click', function() {
            var date_start = dialog.find('#dateStart').val();
            var new_event = {
                name: dialog.find('#name').val(),
                repeatCode: dialog.find('#with-serial').prop('checked') ? dialog.find('#repeat_code').val() : 'NEVER',
                dateStart: date_start,
                dateEnd: dialog.find('#with-serial').prop('checked') ? dialog.find('#dateEnd').val() : date_start,
                timeStart: dialog.find('#timeStart').val(),
                timeEnd: dialog.find('#timeEnd').val(),
                comment: dialog.find('#description').val()
            };
            saveEvent(JSON.stringify(new_event));

            //Закрываем модальное окно
            dialog.modal('hide');
        });
    });
}

//Функция, закрашивающая все td, начиная с td1 вниз до td с координатами x и y
function paint_by_coord(td1, x, y) {
    var row = td1.closest('tr').index();
    var col = td1.index() + ((row + 1) % 2);
    $('tr').each(function() {
        var tr = $(this);
        tr.find('td').each(function() {
            var td = $(this);
            if (td.index() + ((tr.index() + 1) % 2) === col
                    && tr.index() >= row
                    && tr.index() <= $(document.elementFromPoint(x, y)).closest('tr').index()) {
                $(this).addClass('colored');
            }
        })
    })
}

//Функция, преобразующая номер ряда в время формата 18:59 (по верхней границе div
function rowToTimeTop(row) {
    var hour = Math.floor((row - 1) / 2);
    var minute = ((row + 1) / 2 % 1) * 60;
    return (hour === 0 ? "00" : hour < 10 ? "0" + hour : hour) + ":" + (minute === 0 ? "00" : minute) + ":00";
}

//Функция, преобразующая номер ряда в время формата 18:59 (по нижней границе div)
function rowToTimeBot(row) {
    var hour = Math.floor(row / 2);
    var minute = (row / 2 % 1) * 60;
    return (hour === 0 ? "00" : hour < 10 ? "0" + hour : hour) + ":" + (minute === 0 ? "00" : minute) + ":00";
}

//Функция создания события на сервере
function saveEvent(event) {
    $.ajax({
        type: "POST",
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        processData: false,
        url: "http://localhost:8080/rest/event",
        headers: {
            'idTutor': getCookie("idTutor")
        },
        data: event
    }).then(function (data) {
        //Перерисовываем все события календаря
        $('div').remove('.event');
        draw_events();
    })
    //TODO подумать, что сделать после POST запроса
}

//Функция обновления события на сервере
function updateEvent() {

}

//Функция обновления серии событий на сервере
function updateSerialEvent() {

}