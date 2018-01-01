var x, y, x1, y1;
$(document).on('mousedown', function (event1) {
    $(document).on('mousemove', function (event2) {
        x1 = event1.pageX;
        y1 = event1.pageY;
        x = event2.pageX - event1.pageX;
        y = event2.pageY - event1.pageY;
    }).on('mouseup', function () {
        var div = $('<div></div>')
            .css({
                'position': 'absolute',
                'background-color': 'blue',
                'top': y1,
                'left': x1,
                'width': x,
                'height': y,
                'border': '1px solid black'
            });

        $("body").append(div);

        $(document).off('mousemove');
    })
});