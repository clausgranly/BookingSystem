///<reference path="jquery-2.1.0-vsdoc.js" />
bookingCode = {
    init: function () {
        $('#createBooking').click(bookingCode.createBooking);
        $('#showModal').click(bookingCode.showTagModal);
        $('#createTag').click(bookingCode.createTag);
        $('#tagSearch').on('input', bookingCode.searchTags);
        $('.form-control').focus(bookingCode.hideBookingStatus);
        bookingCode.getTags();

        $('#a1').click(bookingCode.getTags);
        //var lblClass = 'control-label col-xs-4 col-md-6';
        //var inputClass = 'col-xs-8 col-md-6';
        //$('label').removeClass().addClass(lblClass);
        //$('#formBooking input').parent().removeClass().addClass(inputClass);
    },
    createBooking: function () {
        var start = $('#startDate').val().split('-');
        var startDate = new Date(start[2], start[1] - 1, start[0]).getTime();
        var estimatedDuration = $('#estimatedDuration').val();
        var description = $('#description').val()
        var customerAddress = $('#customerAddress').val()
        var customerPhone = $('#customerPhonenumber').val();
        var data = '{ "StratDate": "\\\/Date(' + startDate + ')\\\/", "EstimatedDuration": ' + estimatedDuration + ', "Description": "' + description + '", "CustomerAddress": "' + customerAddress + '", "CustomerPhone": ' + customerPhone + '}';
        var tagIds = '';
        pendingTags = $('#pendingTags').children();
        for (var i = 0; i < pendingTags.length; i++) {
            tagIds += $(pendingTags[i]).attr('data-tagId') + ';';
        }
        tagIds = tagIds.slice(0, -1);
        $.ajax({
            type: 'POST',
            url: 'CreateBooking.aspx/CreateBooking',
            data: '{"jsonBooking":' + JSON.stringify(data) + ',"tagIds":"' + tagIds + '"}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if (response.d) {
                    $('.form-control').not('#tagSearch').val("");
                    $('#bookingStatus').removeClass('alert-danger').addClass('alert-success').text('The booking was succesfully created');
                    $('#bookingStatus').parent().show();
                } else {
                    $('#bookingStatus').removeClass('alert-success').addClass('alert-danger').text('The booking wasn\'t created please try again');
                }
            },
            failure: function (response) {
                alert('Failure: ' + response.d);
            }
        });
    },
    getTags: function () {
        $.ajax({
            type: 'POST',
            url: 'CreateBooking.aspx/GetTags',
            data: '{}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if (response.d) {
                    for (var i = 0; i < response.d.length; i++) {
                        $('#existingTags').append(bookingCode.showTag(response.d[i]));
                    }
                }
            },
            failure: function (response) {
                alert('Failure: ' + response.d);
            }
        });
    },
    showTag: function (tag) {
        var tagElement = $('<div>');
        tagElement.addClass('tag');
        tagElement.attr('data-tagId', tag.Id);
        tagElement.text(tag.Name);
        tagElement.click(bookingCode.addTag);
        tagElement.hover(bookingCode.showTagInfo, bookingCode.hideTagInfo);
        return tagElement;
    },

    addTag: function () {
        var tag = $(this);
        var pendingTags = $('#pendingTags').children();
        var found = false;
        var i = 0;
        while (!found && i < pendingTags.length) {
            if (tag.attr('data-tagid') == pendingTags.eq(i).attr('data-tagid')) {
                found = true;
            }
            i++;
        }
        if (!found) {
            $('#pendingTags').append(tag.clone().click(bookingCode.removeTag).hover(bookingCode.showTagInfo, bookingCode.hideTagInfo));
        }
    },
    removeTag: function () {
        bookingCode.hideTagInfo();
        $(this).remove();
    },
    showTagModal: function () {
        $('#tagModal').modal('show');
    },
    createTag: function () {
        var tagName = $('#tagName').val();
        var tagDescription = $('#tagDescription').val();
        var data = '{"Name":"' + tagName + '","Description":"' + tagDescription + '"}';
        $.ajax({
            type: 'POST',
            url: 'CreateBooking.aspx/CreateTag',
            data: '{"jsonTag":' + JSON.stringify(data) + '}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $('#existingTags').prepend(bookingCode.showTag(response.d));
                $('#tagModal').modal('hide');
                $('#tagName').val("");
                $('#tagDescription').val("");
            },
            failure: function (response) {
                alert('failure ' + response.d)
            }
        });
    },
    showTagInfo: function (e) {
        e.preventDefault();
        var id = $(e.target).attr('data-tagId');
        var tagInfo = $('#tagInfo');
        $.ajax({
            type: 'POST',
            url: 'CreateBooking.aspx/GetTagById',
            data: '{id:"' + id + '"}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                $('#tagInfoHead').text(response.d.Name);
                $('#tagInfoDescription').text(response.d.Description)
                tagInfo.css('position', 'absolute');
                tagInfo.css('top', e.pageY + 1);
                tagInfo.css('left', e.pageX + 1);
                tagInfo.show();
            }
        })
    },
    hideTagInfo: function () {
        $('#tagInfo').hide();
    },

    searchTags: function (e) {
        var search = ($(e.target).val());
        $('#existingTags').children().show();
        $('#existingTags').children('.tag:not(:contains(' + search + '))').hide();
    },
    hideBookingStatus:function(){
        $('#bookingStatus').parent().hide();
    },

    test: function () {
        $.ajax({
            type: 'POST',
            url: 'CreateBooking.aspx/Test',
            data: '{}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                alert(response.d)
                alert('done')
            },
            failure: function (response) {
                //alert('Failure: ' + response.d);
                $('<lable>').addClass('alert-danger').html('The username or password was incorrect.<br /> Please try again.').prependTo($('body'))
                alert('done')
            }
        });
    }
    
}

jQuery.expr[':'].contains = function (a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};
$(bookingCode.init);