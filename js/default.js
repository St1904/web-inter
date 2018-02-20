$(document).ready(function () {
    show(home);
    if (hasCookie()) {
        $('#sayhi').append(current);
        $(".nav li").on("click", function () {
            $(".nav").find(".active").removeClass("active");
            $(this).addClass("active");
            switch ($(this).attr("id")) {
                case "menu-home":
                    show(home);
                    break;
                case "menu-schedule":
                    show(schedule);
                    show_schedule();
                    break;
                case "menu-subjects":
                    show(subjects);
                    show_subjects("");
                    break;
                case "menu-journal":
                    show(journal);
                    show_journal();
                    break;
                case "menu-students":
                    show(students);
                    show_students();
                    break;
                case "menu-sayhi":
                    show(tutor);
                    break;
            }
        });
        $('#logout').on('click', function () {
            document.cookie = "idTutor=; path=/; date=" + new Date(0).toUTCString();
            disableAllExceptMain();
            window.location.href = "../html/main.html";
        });
    } else {
        disableAllExceptMain();
    }

});

function show(data) {
    var template = data.import.querySelector('template');
    var clone = document.importNode(template.content, true);
    $("#board").html($(clone));
}

function disableAllExceptMain() {
    var nav_li = $(".nav li");
    $.each(nav_li, function () {
        $(this).addClass("disabled");
    });
    var menu_home = $("#menu-home");
    var li_menu_home = menu_home.parent();
    li_menu_home.removeClass("disabled");
    li_menu_home.addClass("active");
    $(".nav").find(".active").removeClass("active");
    menu_home.addClass("active");
    nav_li.off("click");
}

function hasCookie() {
    current = getCookie("idTutor");
    return current !== null && current !== "";
}
