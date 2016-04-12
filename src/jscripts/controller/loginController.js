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
                if (data.sid) {
                    if (data.sid.indexOf(';') != -1) {
                        data.sid = data.sid.replace(/\;.*$/g, '');
                    }
                    Auth.setUser({
                        _sid: data.sid,
                        _role: data.type.toLowerCase()
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