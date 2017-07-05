var current = getCookie('idTutor');

if (!current) {
    window.location.href = "home.html";
}

$(document).ready(function () {
    $('#sayhi').append(current);
    $('#logout').on('click', function () {
        deleteCookie('idTutor');
        window.location.href = "home.html";
    });
});
