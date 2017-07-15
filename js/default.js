var current = getCookie('idTutor');

if (current === null || current === "") {
    if (window.location.pathname !== "/web-inter/html/home.html") {
        window.location.href = "home.html";
    }
}

$(document).ready(function () {
    $('#sayhi').append(current);
    $('#logout').on('click', function () {
        document.cookie = "idTutor=; path=/; date=" + new Date(0).toUTCString();
        window.location.href = "home.html";
    });
});
