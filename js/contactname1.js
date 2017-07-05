$(document).ready(function () {
    // $.cookie('idTutor', 1, {path: '/'});

    $.ajax({
        type: "GET",
        datatype: "json",
        url: "http://localhost:8080/rest/contactname/1",
        headers: {
            'idTutor': $.cookie('idTutor')
        }
    }).then(function (data) {
        $('.contact-id').append(data.id);
        $('.contact-name').append(data.name);
    });
});
