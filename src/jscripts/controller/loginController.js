app.controller('loginController', function($scope, $location, Ajax, Auth){   

    $scope.passwdKeyPress = function (e) {
        if (e.keyCode === 13) {
            $scope.doLogin();
        }
    }

    $scope.doLogin = function () {
        var cmd = 'opcode=login&user=' + $scope.username + '&passwd=' + $scope.passwd;
        Ajax.doRequest(cmd, function (data) {
            if (data) {
                if (data && data.data && data.data[0] && data.data[0].Text) {
                    if (data.data[0].Text.indexOf(';') != -1) {
                        data.data[0].Text = data.data[0].Text.replace(/\;.*$/g, '');
                    }
                    Auth.setUser({
                        _sid: data.data[0].Text,
                        _role: data.data[1].Text.toLowerCase()
                    })
                    $location.path('/home');
                } else {
                    alert('Invalid username or passowrd!')
                }
            } else {
                alert('Login failed!');
            }
        }, true)
    }
    
});

app.controller('logoutController', function ($scope, $location, Auth) {
    Auth.logout();
    $location.path('/login');
});