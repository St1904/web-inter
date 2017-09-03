function show_subjects(idSubject) {
    $.ajax({
        type: "GET",
        datatype: "json",
        url: "http://localhost:8080/rest/theme/parent?idParent=" + idSubject,
        headers: {
            'idTutor': getCookie("idTutor")
        }
    }).done(function (data) {
        var idParent = idSubject === "" ? $("#subject-list") : $("#subject_" + idSubject);
        var ul_node = $(
            "<ul id='subject_" + this.id + "'>" +
            "</ul>");
        $.each(data, function () {
            var node = $(
                "<li id = 'subject_" + this.id + "'>" +
                "    <span class='tree_element'>" + this.name + "</span>" +
                "</li>");
            ul_node.append(node);
        });
        idParent.append(ul_node);
    }).fail(function () {
        $('#subject_' + idSubject).addClass('loaded');
    })
}

$(document).on('click', '.tree_element', function (e) {
    if (!$(this).hasClass('loaded')) {
        var parent = $(this).closest('li').prop('id').substr(8);
        show_subjects(parent);
        $(this).addClass('loaded');
    }
});