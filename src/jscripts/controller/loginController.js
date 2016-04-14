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
                var sid = data.sid;
                if (sid) {
                    if (sid.indexOf(';') != -1) {
                        sid = sid.replace(/\;.*$/g, '');
                    }
                    var userType = data.type.toLowerCase();
                    if (userType != 'admin') {
                        alert('Only avaliable for administrator!');
                        return;
                    }
                    Auth.setUser({
                        _sid: sid,
                        _role: userType
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