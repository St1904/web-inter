$(document).ready(function () {
    $('#button-enter').on('click', function (e) {
        e.preventDefault();
        setCookie('idTutor', $('#id_tutor').val(), {path: '/'});
        $('#results').html($.cookie('idTutor'));
    });
    $('#button-exit').on('click', function (e) {
        e.preventDefault();
        document.cookie = "idTutor=; path=/; date=" + new Date(0).toUTCString();
    });
});