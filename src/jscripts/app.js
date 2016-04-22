var app = angular.module('IAPMobileUI', ['ngRoute', 'ngCookies', 'ngMessages'])
.run(function($rootScope, $location, Auth) {
    $rootScope.isLoggedIn = Auth.isLoggedIn();
    $rootScope.$on('$routeChangeStart', function(evt, next, curr) {
        if (!Auth.isLoggedIn()) {
            $location.path('/login');
            return;
        }
        $rootScope.mobieMenu.expand = false;
        $rootScope.mobieMenu.currentPath = $location.path();
    });

    $rootScope.mobieMenu = {
        'expand': false,
        'currentPath' : $location.path(),
        'data': {
            'Monitoring': {
                //'path': '/',
                'data': {
                    'Overview': {
                        'path': '/'
                    },
                    'Networks': {
                        'path': '/network'
                    }
                }
            },
            'Configuration': {
                'data': {
                    'Wireless': {
                        'path': '/wireless'
                    },
                    'Uplink': {
                        'path': '/uplink'
                    }
                }
            },
            'Maintenance': {
                'data': {
                    'About': {
                        'path': '/about'
                    },
                    'Configuration': {
                        'path': '/configuration'
                    },
                    'Reboot': {
                        'path': '/reboot'
                    }
                }
            }
        }
    }
})
.constant('App', {
    'API_URL': '../swarm.cgi'
});

app.controller('mainController', function ($rootScope, $location, $scope, Help) {
    $scope.toggleMobileMenu = function () {
        $rootScope.mobieMenu.expand = !$rootScope.mobieMenu.expand;
    }

    $scope.menuOnClick = function (scope) {
        var menu = scope.menu;
        // If this node is not leaf, expand it
        if (!menu.path) {
            menu.expand = !menu.expand;
        }
    }

    $scope.showSearch = function () {
        document.getElementById('searchInput').focus();
        $scope.searching = true;
    }
    $scope.hideSearch = function () {
        document.getElementById('searchInput').value = '';
        setTimeout(function () {
            $scope.searching = false;
            $scope.$apply();
        }, 500)
    }

    $scope.isCurrentFolder = function (scope) {
        var data = scope.menu.data,
            currentPath = $location.path();
        var result = false;
        if (data) {
            // scope.menu.expand = false;
            for (var i in data) {
                if (data[i].path == currentPath) {
                    result = true;
                    scope.menu.expand = true;
                    break;
                }
            }
        }

        return result;

    }

    $scope.switchHelp = function () {
        Help.switchOnOff(!Help.on);
    }

    $rootScope.$on('saveDataSuccessful', function (evt, msg) {
        $rootScope.globalAlertShow = true;
        $rootScope.globalMessage = msg || 'Save configuration successful!';
        setTimeout(function () {
            $rootScope.globalAlertShow = false;
            $rootScope.$apply();
        }, 3000)
    })    

    // $rootScope.subMenuOnClick = function (scope) {
    //     menuOnClick(scope.subMenu);
    // }
})

app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html',
            controller: 'homePageController'            
        })
        .when('/login', {
            templateUrl: 'templates/login.html',
            controller: 'loginController'            
        })
        .when('/uplink', {
            templateUrl: 'templates/uplink.html',
            controller: 'uplinkPageController'
        })
        .when('/wireless', {
            templateUrl: 'templates/wireless.html'
            //controller: 'uplinkPageController'
        })
        .when('/network/:action/:profileName', {
            templateUrl: 'templates/network.html',
            controller: 'networkController'            
        })
        .when('/logout', {
            templateUrl: 'templates/login.html',
            controller: 'logoutController'            
        })
        .when('/reboot', {
            templateUrl: 'templates/reboot.html',
            controller: 'rebootController'            
        })
        .when('/about', {
            templateUrl: 'templates/about.html',
            controller: 'aboutController'            
        })
        .when('/configuration', {
            templateUrl: 'templates/configuration.html',
            controller: 'configurationController'            
        })
        .otherwise({ 
            redirectTo: '/'
        });
});
