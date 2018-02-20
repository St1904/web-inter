$(document).ready(function () {
    if (!hasCookie())
        $("#auth-reg").removeAttr("hidden");
    $("#button-enter").on("click", function (e) {
        e.preventDefault();
        setCookie('idTutor', $('#id_tutor').val(), {path: '/'});
        window.location.href = "../html/main.html";
        // show(home);
    })
});
