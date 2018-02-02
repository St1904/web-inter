var limit;
var offset;

function show_journal() {
    limit = 10;
    offset = 0;

    getJournals(limit, offset);

    setHandlers();
}

//Получаем и рисуем страницу записей журнала
function getJournals(limit, offset) {
    $.ajax({
        type: "GET",
        datatype: "json",
        url: "http://localhost:8080/rest/journal?limit=" + limit + "&offset=" + offset,
        headers: {
            'idTutor': getCookie("idTutor")
        }
    }).then(function (journals, status, response) {
        draw_journal(journals);

        if (journals.length < 10) {
            $('#prev_journal').off('click');
        }

        $('.journal-string').off('click').on('click', function() {
            var $this = $(this);
            $.ajax({
                type: "GET",
                datatype: "json",
                url: "http://localhost:8080/rest/theme/subject/" + $this.data('idSubject'),
                headers: {
                    'idTutor': getCookie("idTutor")
                }
            }).then(function (subject) {
                $.each(subject, function () {
                    $('<option />', {
                        'value': this.id,
                        'text': this.name
                    }).appendTo('#theme');
                });

                $('#theme').find('option[value="' + $this.data("idTheme") + '"]').prop('selected', true);

                $('#date').text($this.find('td:eq(0)').text());
                $('#student').text($this.find('td:eq(1)').text());
                $('#hometask').val($this.find('td:eq(3)').text());
                $('#lessonMark').val($this.find('td:eq(4)').text());
                $('#hometaskMark').val($this.find('td:eq(5)').text());
                $('#comment').val($this.find('td:eq(6)').text());

                var modal = $('#modal_journal');
                modal.data("id", $this.data("id"));
                modal.modal('show');
            });
        });

        //Закрытие модального окна с очисткой формы по кнопке "Закрыть"
        $('.close_btn').off('click').on('click', function() {
            $('#modal_journal').modal('hide');
            clear_journal_modal();
        });

        //Сохранение записи журнала и закрытие модального окна с очисткой формы по кнопке "Сохранить"
        $('#save_journal_btn').off('click').on('click', function() {
            var modal = $('#modal_journal');
            var theme = modal.find('#theme').find(':selected');
            var journal = {
                id: modal.data("id"),
                theme: {
                    id: theme.val()
                },
                hometask: modal.find('#hometask').val(),
                lessonMark: modal.find('#lessonMark').val(),
                hometaskMark: modal.find('#hometaskMark').val(),
                comment: modal.find('#comment').val()
            };

            updateJournal(journal);

            modal.modal('hide');
            clear_journal_modal();
        });
    })
}

//Назначаем обработчики для кнопок "Следующая страница" и "Предыдущая страница"
function setHandlers() {
    $('#prev_journal').off('click').on('click', function() {
        offset += 10;
        refresh();
    });

    $('#next_journal').off('click').on('click', function() {
        if (offset >= 10) {
            offset -= 10;
            refresh();
        }
    });
}

//Рисуем таблицу журналов
function draw_journal(journals) {
    $(journals).each(function(i, journal) {
        var tr = $('<tr class="journal-string">' +
            '<td>' + journal.date + '</td>' +
            '<td>' + journal.studentFirstName + ' ' + journal.studentLastName + '</td>' +
            '<td>' + (journal.themeName === null ? "" : journal.themeName) + '</td>' +
            '<td>' + (journal.homeTask === null ? "" : journal.homeTask) + '</td>' +
            '<td>' + (journal.lessonMark === null ? "" : journal.lessonMark) + '</td>' +
            '<td>' + (journal.hometaskMark === null ? "" : journal.hometaskMark) + '</td>' +
            '<td>' + (journal.comment === null ? "" : journal.comment) + '</td>' +
            '</tr>')
            .data("id", journal.id)
            .data("idSubject", journal.idSubject)
            .data("idTheme", journal.idTheme);
        $('#journal-table').append(tr);
    })
}

//Функция редактирования записи календаря для занятия
function updateJournal(journal) {
    $.ajax({
        type: "PUT",
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        processData: false,
        url: "http://localhost:8080/rest/journal/" + journal.id,
        headers: {
            'idTutor': getCookie("idTutor")
        },
        data: JSON.stringify(journal)
    }).then(function (data) {
        refresh();
    })
}

//Функция очистки полей модального окна
function clear_journal_modal() {
    $('#modal_journal').find('option').remove();
    $('#date').text("");
    $('#student').text("");
    $('#hometask').val("");
    $('#hometaskMark').val("");
    $('#lessonMark').val("");
    $('#comment').val("");
}

//Функция обновления данных на странице журнала
function refresh() {
    $('#journal-table').find('tr:not(:first)').remove();
    // show_journal();
    getJournals(limit, offset);
    setHandlers();
}
