var app = angular.module('IAPMobileUI', ['ngRoute', 'ngCookies'])
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
                'path': '/',
                // 'data': {
                //     'Overview': {
                //         'path': '/home'
                //     },
                //     'Networks': {
                //         'path': '/network'
                //     }
                // }
            },
            'Configuration': {
                'data': {
                    'Wireless': {
                        'path': '/network'
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

app.controller('mainController', function ($rootScope, $location, $scope) {
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
        .otherwise({ 
            redirectTo: '/'
        });
});
