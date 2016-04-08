var app = angular.module('IAPMobileUI', ['ngRoute', 'ngCookies'])
.run(function($rootScope, $location, Auth) {
    $rootScope.isLoggedIn = Auth.isLoggedIn();
    $rootScope.$on('$routeChangeStart', function(evt, next, curr) {
        if (!Auth.isLoggedIn()) {
            $location.path('/login');
        }
    });

    $rootScope.mobieMenu = {
        'expand' : false
    }

    $rootScope.toggleMobileMenu = function () {
        $rootScope.mobieMenu.expand = !$rootScope.mobieMenu.expand;
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
