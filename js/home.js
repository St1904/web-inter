$(document).ready(function () {
    var cookie = getCookie("idTutor");
    if (cookie) {
        $("#auth-reg").attr("hidden", true);
    }
    $("#button-enter").on("click", function (e) {
        e.preventDefault();
        setCookie('idTutor', $('#id_tutor').val(), {path: '/'});
        window.location.href = "home.html";
    })
});
