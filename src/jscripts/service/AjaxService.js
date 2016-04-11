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