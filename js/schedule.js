function show_schedule() {
    show_details();
    draw_events();

}

function show_details() {

}

function draw_events() {
    var tr = $('tr:eq(5)');
    var td = $('td:eq(6)');

/*
    tr.css({
        'background-color': 'green'
    });
    td.css({
        'background-color': 'blue'
    });
*/

    var div = $('<div id="event1"></div>').css({
        'position': 'absolute',
        'background-color': 'red',
        'top': tr.prop('offsetTop') + tr.closest('table').prop('offsetTop'),
        'left': td.prop('offsetLeft') + td.closest('table').prop('offsetLeft'),
        'width': td.prop('offsetWidth'),
        'height': td.prop('offsetHeight') * 5,
        'border': '2px solid black'
    });

    $("#schedule-table").append(div);
    $('#event1').draggable({
        axis: 'y',
        containment: 'parent',
        distance: 10,
        snap: 'td'
    });
}