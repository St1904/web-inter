/*
function show_subjects(idSubject) {
    $.ajax({
        type: "GET",
        datatype: "json",
        url: "http://localhost:8080/rest/theme/parent?idParent=" + idSubject,
        headers: {
            'idTutor': getCookie("idTutor")
        }
    }).done(function (data) {
        var idParent = idSubject === "" ? $("#subject-list") : $("#subject_" + idSubject);
        var ul_node = $(
            "<ul id='subject_" + this.id + "'>" +
            "</ul>");
        $.each(data, function () {
            var node = $(
                "<li id = 'subject_" + this.id + "'>" +
                "    <span class='tree_element'>" + this.name + "</span>" +
                "</li>");
            ul_node.append(node);
        });
        idParent.append(ul_node);
    }).fail(function () {
        $('#subject_' + idSubject).addClass('loaded');
    })
}

$(document).on('click', '.tree_element', function (e) {
    if (!$(this).hasClass('loaded')) {
        var parent = $(this).closest('li').prop('id').substr(8);
        show_subjects(parent);
        $(this).addClass('loaded');
    }
});*/

function show_subjects() {
    $.ajax({
        type: "GET",
        datatype: "json",
        url: "http://localhost:8080/rest/theme/tree/parent?idParent=",
        headers: {
            'idTutor':getCookie("idTutor")
        }
    }).then(function(themes) {
        draw_tree(themes);

        $('#ul_0').addClass('first-theme-ul');

        set_handlers();
    })
}

function draw_tree(tree) {
    //Формируем список для вывода
    if (tree !== null) {
        var idParent = tree[0].idParent;
        var id = idParent === null ? 0 : idParent;
        var ul_node = $(
            "<ul id='ul_" + id + "'>" +
            "</ul>");
        $.each(tree, function () {
            var glyph = this.children === null ? "glyphicon-tag" : "glyphicon-tags";
            var node = $(
                "<li id = 'li_" + this.id + "'>" +
                "<div class=\"panel panel-default theme-item\">\n" +
                "  <div class=\"panel-body\">" +
                "    <i class=\"glyphicon " + glyph + "\" aria-hidden=\"true\"></i>" +
                "    <span>" + this.name + "</span>" +
                "</div>" +
                "</div>" +
                "</li>");
            ul_node.append(node);
        });

        //Ищем место, куда записать список
        var place;
        if (idParent === null) {
            place = $('#subject-list');
        } else {
            place = $('#li_' + idParent);
        }

        place.append(ul_node);


        //Рисуем всех "детей"
        $.each(tree, function() {
            draw_tree(this.children)
        })
    }
}

//Обработчики событий для кнопок
function set_handlers() {
    //Появление модального окна при клике на "Добавить дисциплину"
    $('#create_subject').off('click').on('click', function() {
        $('#new_subject').modal('show');
    });

    //Закрываем модальное окно по кнопке "Закрыть"
    $('.close_btn').off('click').on('click', function() {
        $('#new_subject').modal('hide');
        clear_modal();
    });

    //Сохранение новой дисциплины
    $('#save_subject_btn').off('click').on('click', function() {
        var subject = {
            name: $('#new_subject').find('#name').val()
        };
        $.ajax({
            type: "POST",
            datatype: "json",
            contentType: "application/json; charset=utf-8",
            processData: false,
            url: "http://localhost:8080/rest/theme/subject",
            headers: {
                'idTutor': getCookie("idTutor")
            },
            data: JSON.stringify(subject)
        }).then(function (data) {
            refresh_subject();

            $('#new_subject').modal('hide');
            clear_modal();
        });
    });
}

function clear_modal() {
    $('#create_subject').find('#name').val('');
}

//Перезагрузка страницы
function refresh_subject() {
    $('ul').remove();
    show_subjects();
}