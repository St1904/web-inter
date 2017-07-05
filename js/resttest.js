$(document).ready(function () {
    $('#form1').submit(function () {
        $.ajax({
            type: "GET",
            datatype: "json",
            url: "http://localhost:8080/rest/tutor/" + $('#id_tutor').val() + "/contactname/" + $('#id_contactname').val(),
            success: function (html) {
                $('#results').html(html.id + "<br>" + html.idTutor + "<br>" + html.name);
            }
        });
        return false;
    });
});