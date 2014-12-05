///<reference path="jquery-2.1.0-vsdoc.js" />
dragAndDrop = {
    init: function () {
        bookings.createScheduled();

        unscheduledTbody = $('#unscheduled tbody');
        scheduledTbody = $('#scheduled tbody');
        unscheduledTbody.find("td").data("booked", true);
        scheduledTds = scheduledTbody.find("td");

        unscheduledTbody.find('td').prop('draggable', true);
        scheduledTbody.find('td').data('booked', false);
        scheduledTds.on('dragover', dragAndDrop.dragOver).on('drop', dragAndDrop.onDrop);
        unscheduledTbody.find('td').on('dragstart', dragAndDrop.dragStart);
        $('.unBook').click(dragAndDrop.unBookBooking)
    },

    dragStart: function (e) {
        e.originalEvent.dataTransfer.effectAllowed = "move";
        e.originalEvent.dataTransfer.setData("text/plain", this.id);
    },

    onDrop: function (e) {
        e.preventDefault();
        //soruce
        var booking = $('#' + e.originalEvent.dataTransfer.getData('text/plain'));
        var bookingRows = booking.data('rows');
        var sourceRow = dragAndDrop.indices(booking)[0]
        var sourceColumn = dragAndDrop.indices(booking)[1]
        var sourceTbody = $(booking).parent().parent();
        var target = e.target;
        var targetRow = dragAndDrop.indices(target)[0];
        var targetColumn = dragAndDrop.indices(target)[1];
        var targetTbody = $(target).parent().parent()
        if (dragAndDrop.vaildateDrop(bookingRows, targetTbody, targetRow, targetColumn)) {
            for (var i = 1; i < bookingRows; i++) {
                $(targetTbody).children().eq(targetRow + i).children().eq(targetColumn).hide();
            }
            if (sourceTbody.parent().attr('id') != 'unscheduled') {
                for (var q = 1; q < bookingRows; q++) {
                    $(sourceTbody).children().eq(sourceRow + q).children().eq(sourceColumn).show();;
                }
                $(booking).before($(dragAndDrop.createUnscheduledTd()));

            }
            booking.attr('rowspan', bookingRows)
            $(e.target).replaceWith(booking);
            bookings.planBooking(booking);
        } else {
            $('#b1').html('not legal drop');
        }
    },

    dragOver: function (e) {
        e.preventDefault();
    },

    createUnscheduledTd: function () {
        var td = $('<td>');
        td.data('booked', false);
        td.on('dragover', dragAndDrop.dragOver);
        td.on('drop', dragAndDrop.onDrop);
        return td;
    },

    indices: function (td) {
        td = $(td);
        var tr = td.parent();
        var row = tr.parent().children().index(tr);
        var column = tr.children().index(td);
        return [row, column];
    },

    vaildateDrop: function (bookingRows, targetTbody, targetRow, targetColumn) {
        for (var i = 1; i < bookingRows; i++) {
            if ($(targetTbody).children().eq(targetRow + i).children().eq(targetColumn).data('booked')) {
                return false;
            }
        }
        return true;
    },

    unBookBooking: function (e) {
        e.preventDefault();
        var booking = $(this).parent();
        var bookingRows = booking.data('rows');
        var sourceRow = dragAndDrop.indices(booking)[0]
        var sourceColumn = dragAndDrop.indices(booking)[1]
        var sourceTbody = $(booking).parent().parent();
        for (var i = 1; i < bookingRows; i++) {
            $(sourceTbody).children().eq(sourceRow + i).children().eq(sourceColumn).show();;
        }
        $(booking).before($(dragAndDrop.createUnscheduledTd()));
        booking.removeAttr('rowspan');
        $('#unscheduled tbody').append($('<tr>').append(booking));
        $.ajax({
            type: 'POST',
            url: 'ManageBookings.aspx/UnBookBooking',
            data: '{"bookingId": '+booking.attr('id')+'}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                alert(response.d);
            },
            failure: function (response) {
                alert('Failure: ' + response.d);
            }
        });

    },
}

bookings = {
    getBookingsByDate: function () {
        //var start = $('#startDate').val().split('-');
        var startDate = new Date(2014, 12, 24, 0, 0, 0, 0);
        startDate.setHours(startDate.getHours());
        startDate = startDate.getTime();
        $.ajax({
            type: 'POST',
            url: 'ManageBookings.aspx/GetBookingsByDate',
            data: '{"date": "\\\/Date(' + startDate + ')\\\/"}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                for (var i = 0; i < response.d.length; i++) {
                    bookings.insertIntoTabel(response.d[i][1], response.d[i][0]);
                }
            },
            failure: function (response) {
                alert('Failure: ' + response.d);
            }
        });
    },

    insertIntoTabel: function (booking, id) {
        var td = bookings.createBookingTag(booking);
        if (booking.BookingState == 0) {
            var tr = $('<tr>');
            tr.append(td);
            $('#unscheduled tbody').append(tr);
        }
        else {
            var schedueledStartDate = new Date(parseInt(booking.SchedueledStartDate.substr(6)));
            if (schedueledStartDate.getHours() < 10) {
                var time = '0' + schedueledStartDate.getHours() + ':' + schedueledStartDate.getMinutes();
            } else {
                var time = schedueledStartDate.getHours() + ':' + schedueledStartDate.getMinutes();
            }
            if (schedueledStartDate.getMinutes() == 0) {
                time = time + '0';
            }

            var bookingRows = Math.ceil(booking.EstimatedDuration * 2);
            var targetRow = $('#scheduled tbody').find('tr[data-time="' + time + '"]');
            var trIndex = targetRow.parent().children().index(targetRow);
            var targetColumn = $('#scheduled thead').find('th[data-employeeid="' + id + '"]');
            var tdIndex = $('#scheduled thead').children().index(targetColumn);
            for (var i = 1; i < bookingRows; i++) {
                $('#scheduled tbody').children().eq(trIndex + i).children().eq(tdIndex).hide();
            }
            $('#scheduled tbody').children().eq(trIndex).children().eq(tdIndex).replaceWith(bookings.createBookingTag(booking));
        }
    },

    createBookingTag: function (booking) {
        var a = $('<a>');
        a.attr('href', '');
        a.text('✖');
        a.click(dragAndDrop.unBookBooking);
        var td = $('<td>');
        rows = Math.ceil(booking.EstimatedDuration * 2);
        td.attr('id', booking.Id);
        td.attr('data-rows', rows);
        td.prop('draggable', true);
        td.text(booking.Name);
        td.addClass('booking');
        td.append(a);
        td.on('dragstart', dragAndDrop.dragStart);
        td.attr('height', 25 * rows);
        if (booking.BookingState == 0) {
            td.attr('data-booked', true);
        } else if (booking.BookingState == (1)) {
            td.attr('data-booked', true);
            td.attr('rowspan', rows)
        }
        return td;
    },

    createScheduled: function () {
        $.ajax({
            type: 'POST',
            url: 'ManageBookings.aspx/GetEmployees',
            data: '{}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                bookings.createTable(response.d);
                bookings.getBookingsByDate();
            },
            failure: function (response) {
                alert('Failure: ' + response.d);
            }
        })
    },

    createTable: function (employees) {
        var tableWidth = employees.length;
        var timeIndervals = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', ];
        var table = $('#scheduled');
        var thead = $('<thead>')
        thead.append($('<th>'));
        for (var i = 0 ; i < tableWidth; i++) {
            thead.append($('<th>').text(employees[i].Name).attr('data-employeeId', employees[i].Id));
        }
        thead.append($('<th>'));
        table.append(thead);
        var tbody = $('<tbody>');
        for (var q = 0 ; q < timeIndervals.length; q++) {
            tr = $('<tr>').attr('data-time', timeIndervals[q]);
            tr.append($('<th>').attr('scope', 'row').text(timeIndervals[q]));
            for (var i = 0 ; i < tableWidth; i++) {
                tr.append($('<td>').on('dragover', dragAndDrop.dragOver).on('drop', dragAndDrop.onDrop));
            }
            tr.append($('<th>').attr('scope', 'row').text(timeIndervals[q]));
            tbody.append(tr);
        }
        table.append(tbody);

        var tfoot = $('<tfoot>');
        tfoot.append($('<th>'));
        for (var e = 0 ; e < tableWidth; e++) {
            tfoot.append($('<th>').text(employees[e].Name));
        }
        tfoot.append($('<th>'));
        table.append(tfoot);
    },

    planBooking: function (booking) {
        var scheduledDate = ($('#scheduledDate').text().split('-'));
        var hourMin = booking.parent().attr('data-time').split(':');

        scheduledDate = new Date(scheduledDate[2], scheduledDate[1] - 1, scheduledDate[0], hourMin[0], hourMin[1], 0, 0);
        scheduledDate = scheduledDate.getTime();
        var bookingId = booking.attr('id');
        var employeeId = $('#scheduled thead').find('th').eq(dragAndDrop.indices(booking)[1]).attr('data-employeeId');
        $.ajax({
            type: 'POST',
            url: 'ManageBookings.aspx/PlanBooking',
            data: '{"scheduledDate": "\\\/Date(' + scheduledDate + ')\\\/","bookingId":' + bookingId + ',"employeeId":' + employeeId + '}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
            },
            failure: function (response) {
                alert('Failure: ' + response.d);
            }
        });
    },
}
$(dragAndDrop.init);
