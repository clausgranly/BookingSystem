///<reference path="jquery-2.1.0-vsdoc.js" />
code = {
    init: function () {
        $('#btnLogin').click(code.login)
        if (code.isLoggedIn()) {
            var logout = $('div .navbar-right').empty();
            logout.append($('<ul>').addClass('nav navbar-nav navbar-right').append($('<li>').append($('<a>').attr('href', '/Index.html').text('Logout'))));
        }
    },
    isLoggedIn: function () {
        window.console.log("hello")

        console.log(window.document.cookie.split(';').toString());
        return false;
    },
    login: function () {
        var username = $('#username').val();
        var password = $('#password').val();
        $.ajax({
            type: 'POST',
            url: '../Login.aspx/ValidateLogin',
            data: '{username:"' + username + '",password:"' + password + '"}',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if (response.d) {

                } else {
                    $('#formLogin').prepend($('<lable>').addClass('alert-danger').html('The username or password was incorrect.<br /> Please try again.'))
                }
            },
            failure: function (response) {
                alert('Failure: ' + response.d);
            }
        });
    }
}

$(code.init);