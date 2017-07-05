$(document).ready(function () {
    //TODO переписать все на cookie.js
    $('#button-enter').on('click', function (e) {
        e.preventDefault();
        $.cookie('idTutor', $('#id_tutor').val(), {path: '/'});
        $('#results').html($.cookie('idTutor'));
    });
    $('#button-exit').on('click', function (e) {
        $.removeCookie('idTutor', {path: '/'});
    });
});