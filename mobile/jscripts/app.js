var app = angular.module('IAPMobileUI', ['ngRoute', 'ngCookies'])
.run(function($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function(evt, next, curr) {
        if (!Auth.isLoggedIn()) {
            $location.path('/login');
        }
    });
})
.constant('App', {
    'API_URL': 'swarm.cgi'
})

app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'mobile/templates/home.html',
            controller: 'homePageController'            
        })
        .when('/login', {
            templateUrl: 'mobile/templates/login.html',
            controller: 'loginController'            
        })
        .when('/uplink', {
            templateUrl: 'mobile/templates/uplink.html',
            controller: 'uplinkPageController'
        })
        .when('/newNetwork', {
            templateUrl: 'mobile/templates/newNetwork.html',
            controller: 'networkController'            
        })
        .when('/logout', {
            templateUrl: 'mobile/templates/login.html',
            controller: 'logoutController'            
        })
        .otherwise({ 
            redirectTo: '/'
        });
});

app.factory('Ajax', function ($http, $location, Auth, App) {
    var _apiURL = App.API_URL;
    var x2js = new X2JS();

    return {
        doRequest: function (data, callback, opt_post) {
            if (Auth.isLoggedIn()) {
                data += "&sid=" + Auth.getSID()
            }

            var config = {
                url: _apiURL
            };

            if (opt_post) {
                config['method'] = 'post';
                config['data'] = data;
            } else {
                config['method'] = 'get';
                config['url'] += '?' + data;
            }

            $http(config)
                .success(function (resp) {
                    var jsonData = x2js.xml_str2json(resp);
                    if (jsonData && jsonData.re) {
                        if (jsonData.re.error == 'Invalid Session ID') {
                            Auth.logout();
                            $location.path('/login');
                            return;
                        }
                        callback(jsonData.re);
                    }
                })
                .error(function (err) {
                    console.log('Request failed...');
                    console.log(err);
                })
        }
    }
})

app.factory('Auth', function ($cookies) {
    //user: {sid:xxxxx, role:admin}
    var _user = $cookies.getObject('user');
    var setUser = function(user) {
        _user = user;
        $cookies.putObject('user', _user);
    };
    return {
        isAdmin: function() {
            return _user.role === 'admin';
        },
        setUser: setUser,
        isLoggedIn: function() {
            return _user ? true : false;
        },
        getUser: function() {
            return _user;
        },
        getSID: function() {
            return _user ? _user._sid : null;
        },
        logout: function() {
            $cookies.remove('user');
            _user = null; 
        }
    };
})

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
                }
            } else {
                alert('Login failed!');
            }
        }, true)
    }
    
});

app.controller('homePageController', function ($scope, Ajax, $http, $location) {
    

    function parseSummaryData (data) {
        var summaryData = {
            'networks' : [],
            'aps': [],
            'clients': []
        };
        if (data) {
            if (data.t) {
                for (var i = 0; i < data.t.length; i++) {
                    var section = data.t[i];
                    if (section._tn.toLowerCase().indexOf('network') !== -1) {
                        if (section.r) {
                            if (Object.prototype.toString.call(section.r) === '[object Object]') {
                                summaryData['networks'].push(angular.extend({}, section.r));
                            } else {
                                for (var j = 0; j < section.r.length; j++) {
                                    summaryData['networks'].push(angular.extend({}, section.r[j]));
                                }
                            }
                        }
                    }

                    if (section._tn.toLowerCase().indexOf('ap') !== -1) {
                        if (section.r) {
                            if (Object.prototype.toString.call(section.r) === '[object Object]') {
                                summaryData['aps'].push(angular.extend({}, section.r));
                            } else {
                                for (var j = 0; j < section.r.length; j++) {
                                    summaryData['aps'].push(angular.extend({}, section.r[j]));
                                }
                            }
                        }
                    }

                    if (section._tn.toLowerCase().indexOf('client') !== -1) {
                        if (section.r) {
                            if (Object.prototype.toString.call(section.r) === '[object Object]') {
                                summaryData['clients'].push(angular.extend({}, section.r));
                            } else {
                                for (var j = 0; j < section.r.length; j++) {
                                    summaryData['clients'].push(angular.extend({}, section.r[j]));
                                }
                            }
                        }
                    }
                } 
            }
        }

        summaryData['clients'].push({'c':['0a:1b:23:5f:11:87', 'lshu-iphone', '192.168.0.101', 'lshu-test', 'AP-1']})
        return summaryData;
    }

    $scope.showSummary = function () {
        var cmd = 'opcode=show&cmd=show summary';
        Ajax.doRequest(cmd, function (data) {
            var summaryData = parseSummaryData(data);

            var networkCount = summaryData['networks'].length,
                clientCount = summaryData['clients'].length;
            // If the cluster is factory default status, popup WiFi Config wizard
            if (networkCount === 1 && summaryData['networks'][0]['c'][0] === 'instant') {
                $location.path('/newNetwork');
            } else {
                $scope.summaryData = summaryData;
            }
            $scope['network_table_head'] = networkCount + ' Network' + (networkCount > 1 ? 's' : '');
            $scope['client_table_head'] = clientCount + ' Client' + (clientCount > 1 ? 's' : '');
        })
    }

    $scope.showSummary();
})

app.controller('uplinkPageController', function ($scope, Ajax) {
    var cmd = 'opcode=show&cmd=show pppoe config';

    var uplinkSSIDs = ['ethersphere-wap2', 'ethersphere-wap2-instant', 'bj-office-test', 'hpn-byod'].sort();

    var uplinkData = {
        'uplinkType' : 'pppoe',
        'uplinkSSIDs' : uplinkSSIDs
    }
    $scope.data = uplinkData;
    Ajax.doRequest(cmd, function (data) {
    })

    $scope.saveSettings = function () {
        var cmd = '';

        switch ($scope.data.uplinkType) {
            case 'pppoe': {
                cmd += 'pppoe-uplink-profile\n' 
                       + 'pppoe-username ' + $scope.data.pppoeUsername + '\n'
                       + 'pppoe-passwd ' + $scope.data.pppoePasswd + '\n'
                       + 'pppoe-svcname ' + $scope.data.pppoeService + '\n'

                       + 'exit\n';
            }

            case 'dhcp': {

            }

            case 'static': {

            }

            case 'wifiuplink': {

            }

            default: {
                break;
            }
        }

        var url = 'opcode=config&cmd=' + cmd;
        Ajax.doRequest(url, function () {

        })
    }
})


app.controller('networkController', function ($scope, $location, Ajax) {
    $scope.saveNetwork = function () {
        if ($scope.profileName) {
            var cmd = ' wlan ssid-profile ' + $scope.profileName + '\n';
            if($scope.opmode == 'none') {
                cmd += ' no wpa-passphrase ' + '\n';
            } else {
                cmd += ' wpa-passphrase ' + $scope.passphrase + '\n';
            }
            cmd += 'exit\n' + "'";
            var url = "opcode=config&ip=127.0.0.1&cmd='" + cmd;
            Ajax.doRequest(url, function (data) {
                if (data) {
                    $location.path('/home');
                } else {
                    console.log('saveSSID failed!');
                };
            }, true);
        }   
    }
});

app.controller('logoutController', function ($scope, $location, Auth) {
    Auth.logout();
    $location.path('/home');
});
