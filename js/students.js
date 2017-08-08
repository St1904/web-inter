function show_students() {
    $.ajax({
        type: "GET",
        datatype: "json",
        url: "http://localhost:8080/rest/student",
        headers: {
            'idTutor': getCookie("idTutor")
        }
    }).then(function (data) {
        $.each(data, function () {
            var id_student = this.id;
            var panel = $(
                "<div class=\"panel-primary\">" +
                "            <div class=\"panel-heading\">" +
                                this.firstName + " " + this.lastName +
                "            </div>" +
                "            <div class=\"panel-body\">" +
                "                Домашний адрес: " +
                                this.address + "<br/>" +
                "                Контакты: " +
                "                <ul id='contacts" + id_student + "'></ul>" +
                "            </div>" +
                "        </div>"
                )
            ;
            $('#student-list').append(panel);
            $.each(this.contacts, function () {
                var contact_info = $(
                    "<li>" +
                    this.contactName.name + "  -  " + this.value +
                    "</li>");
                $('#contacts' + id_student).append(contact_info);
            })
        })
    });
}