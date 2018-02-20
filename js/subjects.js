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
                "      <i class=\"glyphicon " + glyph + "\" aria-hidden=\"true\"></i>" +
                "      <span>" + this.name + "</span>" +
                "      <button id='del_btn_li_" + this.id + "' class='btn btn-danger pull-right del_theme_btn'><i class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></i>Удалить</button>" +
                "      <button id='create_btn_li_" + this.id + "' class='btn btn-success pull-right create_theme_btn'><i class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></i>Создать</button>" +
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
        });

        //Обработчик события для кнопки "Удалить" на строке с темой занятия
        $('.del_theme_btn').off('click').on('click', function() {
            // console.log(this.id.substr(11));
            var idTheme = this.id.substr(11);
            $.ajax({
                type: "DELETE",
                datatype: "json",
                contentType: "application/json; charset=utf-8",
                processData: false,
                url: "http://localhost:8080/rest/theme/" + idTheme,
                headers: {
                    'idTutor': getCookie("idTutor")
                }
            }).then(function(data) {
                $('#li_' + idTheme).remove();
            });
        });

        //Обработчик события для кнопки "Добавить" на строке с темой занятия
        $('.create_theme_btn').off('click').on('click', function() {
            var $this = $(this);
            var idParent = this.id.substr(14);
            var create_theme_form = $(
                "<li id = 'li_parent_" + idParent + "'>" +
                "<div class=\"panel panel-default theme-item\">\n" +
                "  <div class=\"panel-body\">" +
                "    <form>\n" +
                "       <div class=\"form-group\">\n" +
                "          <div class=\"col-lg-3\">\n" +
                "             <label for=\"theme_name\" class=\"col-lg-2 control-label\">Название</label>\n" +
                "             <input id=\"theme_name\" type=\"text\" class=\"form-control\">\n" +
                "          </div>\n" +
                "          <div class=\"col-lg-3\">\n" +
                "             <label for=\"theme_comment\" class=\"col-lg-2 control-label\">Комментарий</label>\n" +
                "             <input id=\"theme_comment\" type=\"text\" class=\"form-control\">\n" +
                "          </div>\n" +
                "       </div>\n" +
                "    </form>" +
                "    <button class='btn btn-danger pull-right delete_theme_form'><i class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></i>Удалить</button>" +
                "    <button class='btn btn-primary pull-right save_theme_form'><i class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></i>Сохранить</button>" +
                "</div>" +
                "</div>" +
                "</li>");
            //Ищем место для формы
            var place = $('#ul_' + idParent);

            if (place.length === 0) {
                //Если место не найдено
                place = $("<ul id='ul_" + idParent + "'></ul>");
                create_theme_form.appendTo(place);
                $this.closest('li').append(place);
            } else {
                //Если место найдено
                create_theme_form.appendTo(place);
            }

            //Обработчик для кнопки "Удалить" в форме
            $('.delete_theme_form').off('click').on('click', function() {
                this.closest('li').remove();
            });

            //Обработчик для кнопки "Сохранить" в форме
            $('.save_theme_form').off('click').on('click', function() {
                var parent = this.closest('li');
                var idParent = parent.id.substr(10);
                var newTheme = {
                    idParentTheme: idParent,
                    name: $(parent).find('#theme_name').val(),
                    comment: $(parent).find('#theme_comment').val()
                };

                $.ajax({
                    type: "POST",
                    datatype: "json",
                    contentType: "application/json; charset=utf-8",
                    processData: false,
                    url: "http://localhost:8080/rest/theme",
                    headers: {
                        'idTutor': getCookie("idTutor")
                    },
                    data: JSON.stringify(newTheme)
                }).then(function(theme) {
                    var addTheme = $(
                        "<li id = 'li_" + theme.id + "'>" +
                        "<div class=\"panel panel-default theme-item\">\n" +
                        "  <div class=\"panel-body\">" +
                        "      <i class=\"glyphicon glyphicon-tag\" aria-hidden=\"true\"></i>" +
                        "      <span>" + theme.name + "</span>" +
                        "      <button id='del_btn_li_" + theme.id + "' class='btn btn-danger pull-right del_theme_btn'><i class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></i>Удалить</button>" +
                        "      <button id='create_btn_li_" + theme.id + "' class='btn btn-success pull-right create_theme_btn'><i class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></i>Создать</button>" +
                        "</div>" +
                        "</div>" +
                        "</li>");
                    $(parent).closest('ul').append(addTheme);

                    $(parent).remove();
                });
            });
        });
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
            url: "http://localhost:8080/rest/subject",
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