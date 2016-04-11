var app = angular.module('IAPMobileUI', ['ngRoute', 'ngCookies'])
.run(function($rootScope, $location, Auth) {
    $rootScope.isLoggedIn = Auth.isLoggedIn();
    $rootScope.$on('$routeChangeStart', function(evt, next, curr) {
        if (!Auth.isLoggedIn()) {
            $location.path('/login');
        }
    });

    $rootScope.mobieMenu = {
        'expand': false,
        'currentPath' : null,
        'data': {
            'Monitoring': {
                'path': '#/',
                'selected': true
                // 'data': {
                //     'Overview': {
                //         'path': '#/home'
                //     },
                //     'Networks': {
                //         'path': '#/network'
                //     }
                // }
            },
            'Configuration': {
                'data': {
                    'Wireless': {
                        'path': '#/network'
                    },
                    'Uplink': {
                        'path': '#/uplink'
                    }
                }
            },
            'Maintenance': {
                'data': {
                    'Reboot': {
                        'path': '#/reboot'
                    }
                }
            }
        }
    }

    $rootScope.toggleMobileMenu = function () {
        $rootScope.mobieMenu.expand = !$rootScope.mobieMenu.expand;
    }

    function menuOnClick (menu) {
        // If this node is leaf, set the selected class
        if (menu.path) {
            $rootScope.mobieMenu.currentPath = menu.path;
        } else {
            menu.expand = !menu.expand || true;
        }
    }

    $rootScope.menuOnClick = function (scope) {
        console.log('menuOnClick');
        console.log($rootScope.mobieMenu.currentPath);
        
        menuOnClick(scope.menu);
    }

    $rootScope.subMenuOnClick = function (scope) {
        console.log('subMenuOnClick');
        console.log($rootScope.mobieMenu.currentPath);

        menuOnClick(scope.subMenu);
    }
})
.constant('App', {
    'API_URL': '../swarm.cgi'
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
        .otherwise({ 
            redirectTo: '/'
        });
});
