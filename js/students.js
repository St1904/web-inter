function show_students() {
    $.ajax({
        type: "GET",
        datatype: "json",
        url: "http://localhost:8080/rest/student",
        headers: {
            'idTutor': getCookie("idTutor")
        }
    }).then(function (data) {
        $.each(data, function () {
            var id_student = this.id;
            var panel = $(
                "<div class=\"row student\">" +
                "<div class=\"col-lg-8\">" +
                "<div class=\"panel panel-primary\">" +
                "            <div class=\"panel-heading clickable panel-to-collapse\">" +
                this.firstName + " " + this.lastName +
                "<span class=\"pull-right\"><i class=\"glyphicon glyphicon-chevron-up\"></i></span>" +
                "            </div>" +
                "            <div class=\"panel-body\">" +
                "                Домашний адрес: " +
                this.address + "<br/>" +
                "                Контакты: " +
                "                <ul id='contacts" + id_student + "'></ul>" +
                "            </div>" +
                "            <div class='panel-footer'>" +
                "               <button type='button' class='btn btn-info update-student'>Редактировать</button>" +
                "               <button class='btn btn-danger remove-student'>Удалить</button>" +
                "            </div>" +
                "        </div>" +
                "</div>" +
                "</div>"
            );
            panel.find('.panel')
                .data('id', id_student)
                .data('firstName', this.firstName)
                .data('lastName', this.lastName)
                .data('address', this.address)
                .data('contacts', this.contacts);
            $('#student-list').append(panel);
            $.each(this.contacts, function () {
                var contact_info = $(
                    "<li>" +
                    this.contactName.name + "  -  " + this.value +
                    "</li>");
                $('#contacts' + id_student).append(contact_info);
            })
        });
    });

    buttons();
}

//обработчики событий для кнопок
function buttons() {
    //развернуть все панели с информацией про студентов
    $('#open_students').off('click').on('click', function () {
        $('.panel div.clickable').each(function (i, elem) {
            var $elem = $(elem);
            $elem.parents('.panel').find('.panel-body').slideDown();
            $elem.parents('.panel').find('.panel-footer').slideDown();
            $elem.addClass('panel-to-collapse');
            $elem.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        })
    });

    //свернуть все панели с информацией про студентов
    $('#close_students').off('click').on('click', function () {
        $('.panel div.clickable').each(function (i, elem) {
            var $elem = $(elem);
            $elem.parents('.panel').find('.panel-body').slideUp();
            $elem.parents('.panel').find('.panel-footer').slideUp();
            $elem.removeClass('panel-to-collapse');
            $elem.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        })
    });

    //добавить контакт к списку
    $('#add_contact').off('click').on('click', function (e) {
        e.preventDefault();
        add_contact();
    });

    //создать нового студента
    $('#create_student').off('click').on('click', function () {
        var dialog = $('#modal_create_student');

        add_autocomplete();

        dialog.modal('show');

        //Сохраняем нового студента
        $('#save_student_btn').off('click')
            .on('click', function () {
                save_student('create');
        });
    });

    //Закрываем модальное окно по кнопке "Закрыть"
    $('.close_btn').off('click').on('click', function () {
        $('#modal_create_student').modal('hide');
        clear_modal();
    });

    //при нажатии кнопки "редактировать"
    $(document).off('click', '.update-student')
        .on('click', '.update-student', function () {
        var studentCard = $(this.closest('.panel'));

        //Переназначаем обработчик для кнопки "сохранить"
        $('#save_student_btn').off('click')
            .on('click', function () {
                save_student('update');
            });

        //заполняем данными форму модального окна
        var dialog = $('#modal_create_student');
        dialog.data('id', studentCard.data('id'));
        dialog.find('#firstName').val(studentCard.data('firstName'));
        dialog.find('#lastName').val(studentCard.data('lastName'));
        dialog.find('#address').val(studentCard.data('address'));
        dialog.find('.modal-title').text('Студент');
        $(studentCard.data('contacts'))
            .each(function (i, elem) {
                if (i > 0) {
                    add_contact();
                }
                dialog.find('.contact').filter(':last').data('id', elem.id);
                dialog.find('.contact-name-inputs').filter(':last').data('id', elem.contactName.id);
                dialog.find('.contact-name-inputs').filter(':last').val(elem.contactName.name);
                dialog.find('.contact-value-inputs').filter(':last').val(elem.value);
            });

        dialog.modal('show');
    });

    //TODO удалить карточку студента
}

//функция добавления еще одного поля контакта к списку
function add_contact() {
    var newContactRow = $("<div class='contact'>" +
        "<div class=\"form-group\">\n" +
        "   <label for=\"contact_name\" class=\"col-lg-3\"></label>\n" +
        "   <div class=\"col-lg-3\">\n" +
        "      <input id=\"contact_name\" type=\"text\" class=\"form-control contact-name-inputs autocomplete\"\n" +
        "             placeholder=\"Например, &quot;телефон&quot;\">\n" +
        "   </div>\n" +
        "   <label for=\"contact_value\" class=\"sr-only\"></label>\n" +
        "   <div class=\"col-lg-3\">\n" +
        "      <input id=\"contact_value\" type=\"text\" class=\"form-control contact-value-inputs\">\n" +
        "   </div>\n" +
        "   <div class=\"col-lg-1\">\n" +
        "      <button class=\"remove_contact btn btn-danger\"><i class=\"glyphicon glyphicon-remove\"></i></button>\n" +
        "   </div>" +
        "</div></div>");
    if (!($('.contact').length)) {
        newContactRow.find('label').text('Контакты');
    }
    $('#contact_group').append(newContactRow);

    //добавление обработчика для кнопки - удаление контакта из списка
    remove_contact_on_click();

    //добавление автодополнения
    add_autocomplete();
}

//добавление автодополнения к полям типа "contact_name"
function add_autocomplete() {
    var tips = [];
    $.ajax({
        type: "GET",
        datatype: "json",
        url: "http://localhost:8080/rest/contactname",
        headers: {
            'idTutor': getCookie("idTutor")
        }
    }).then(function (data) {
        $.each(data, function () {
            tips.push(this.name);
        });
    });

    $('.contact-name-inputs')
        .autocomplete({
            source: tips
        })
        .prop('autocomplete', 'on');
}

//удаление контакта из списка
function remove_contact_on_click() {
    $('.remove_contact').on('click', function (e) {
        e.preventDefault();
        this.closest('.contact').remove();
    })
}

//Функция сохранения карточки студента;
//Для key='create' - создание нового студента
//Для key='update' - обновление информации про студента
function save_student(key) {
    var query = 'http://localhost:8080/rest/student';
    var method;
    var dialog = $('#modal_create_student');

    if (key === 'create') {
        method = 'POST';
    } else if (key === 'update') {
        method = 'PUT';
        query += '/' + dialog.data('id');
    }

    var contact;
    var contacts = [];
    $('.contact').each(function(i, elem) {
        var $elem = $(elem);
        contact = {
            id: $elem.data('id'),
            idStudent: dialog.data('id'),
            contactName: {
                id: $elem.find('.contact-name-inputs').data('id'),
                name: $elem.find('.contact-name-inputs').val()
            },
            value: $elem.find('.contact-value-inputs').val()
        };
        contacts.push(contact);
    });
    var student = {
        firstName: dialog.find('#firstName').val(),
        lastName: dialog.find('#lastName').val(),
        address: dialog.find('#address').val(),
        contacts: contacts
    };

    $.ajax({
        type: method,
        datatype: "json",
        contentType: "application/json; charset=utf-8",
        processData: false,
        url: query,
        headers: {
            'idTutor': getCookie("idTutor")
        },
        data: JSON.stringify(student)
    }).then(function() {
        $('div').remove('.student');
        show_students();
    });

    dialog.modal('hide');
    clear_modal();
}

//обработка щелчка по верху панели с информацией о студенте
$(document).on('click', '.panel div.clickable', function () {
    var $this = $(this);
    if ($this.hasClass('panel-to-collapse')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.parents('.panel').find('.panel-footer').slideUp();
        $this.removeClass('panel-to-collapse');
        $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.parents('.panel').find('.panel-footer').slideDown();
        $this.addClass('panel-to-collapse');
        $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    }
});

//очистка формы модального окна
function clear_modal() {
    var dialog = $('#modal_create_student');
    dialog.find('#firstName').val('');
    dialog.find('#lastName').val('');
    dialog.find('#address').val('');
    dialog.find('.contact').not(':first').remove();
    dialog.find('#contact_name').val('');
    dialog.find('#contact_value').val('');
    dialog.find('.modal-title').text('Новый студент');
}