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
                "<div class=\"row\">" +
                "<div class=\"col-lg-8\">" +
                "<div class=\"panel panel-primary\">" +
                "            <div class=\"panel-heading clickable panel-to-collapse\">" +
                this.firstName + " " + this.lastName +
                "<span class=\"pull-right\"><i class=\"glyphicon glyphicon-chevron-up\"></i></span>" +
                "            </div>" +
                "            <div class=\"panel-body\">" +
                "                Домашний адрес: " +
                this.address + "<br/>" +
                "                Контакты: " +
                "                <ul id='contacts" + id_student + "'></ul>" +
                "            </div>" +
                "        </div>" +
                "</div>" +
                "</div>"
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
        });
    });
}

//обработка щелчка по верху панели, работает пока для всех
$(document).on('click', '.panel div.clickable', function (e) {
    var $this = $(this);
    if ($this.hasClass('panel-to-collapse')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.removeClass('panel-to-collapse');
        $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.addClass('panel-to-collapse');
        $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    }
});