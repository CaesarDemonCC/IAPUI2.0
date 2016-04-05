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