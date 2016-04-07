app.factory('Auth', function ($cookies, $rootScope) {
    //user: {sid:xxxxx, role:admin}
    var _user = $cookies.getObject('user');
    var setUser = function(user) {
        _user = user;
        $cookies.putObject('user', _user);
        $rootScope.isLoggedIn = true;
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
            $rootScope.isLoggedIn = false;
            _user = null; 
        }
    };
})