function show_students () {
    $.ajax({
        type: "GET",
        datatype: "json",
        url: "http://localhost:8080/rest/student",
        headers: {
            'idTutor': getCookie("idTutor")
        }
    }).then(function (data) {
        $.each(data, function () {
            var panel = $("<div class=\"panel-primary\">\n" +
                "            <div class=\"panel-heading\">\n" +
                                this.firstName + " " + this.lastName +
                "            </div>\n" +
                "            <div class=\"panel-body\">\n" +
                "                Инфо о студенте\n" +
                "            </div>\n" +
                "        </div>");
            $('#student-list').append(panel);
        })
    });
}