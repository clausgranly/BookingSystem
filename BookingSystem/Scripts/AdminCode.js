///<reference path="jquery-2.1.0-vsdoc.js" />
adminCode = {
    init: function () {
        $('#createEmployee').click(adminCode.createEmployee);
    },
    createEmployee: function () {
        var name = $('#name').val();
        var phonenumber = $('#phonenumber').val();
        var email = $('#email').val();
        var username = $('#newUsername').val();
        var password = $('#newPassword').val();
        var roles = $('#roles').val();
        var jsonEmployee = '{"Name":"' + name + '","Phonenumber":' + phonenumber + ',"Email":"' + email + '"}';
        var jsonUser = '{"UserName":"' + username + '","Password":"' + password + '","Roles":"' + roles + '"}';
        alert(JSON.stringify(jsonEmployee))
        alert(JSON.stringify(jsonUser))
        $.ajax({
            type: 'POST',
            url: 'AdminCode.aspx/CreateEmployee',
            data: '{"jsonEmployee":' + JSON.stringify(jsonEmployee) + ',"jsonUser":' + JSON.stringify(jsonUser) + '}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                alert(response.d);
            }

        });
    }
}
$(adminCode.init)