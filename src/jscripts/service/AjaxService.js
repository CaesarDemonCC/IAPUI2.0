app.factory('Ajax', function ($http, $location, Auth, App, ParseData) {
    var _apiURL = App.API_URL;
    var x2js = new X2JS();

    return {
        doRequest: function (data, callback, opt_post, opt_parseOptions) {
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
                    if (jsonData) {
                        if (jsonData.re) {
                            if (jsonData.re.error == 'Invalid Session ID') {
                                Auth.logout();
                                $location.path('/login');
                                return;
                            }
                            ParseData.parse(jsonData, function(data){
                                if (data._debug) {
                                    console.log(data);
                                    delete data._debug;
                                }
                                callback(data);
                            }, opt_parseOptions);
                        } else if (jsonData.re == "") {
                            callback();
                        } 
                    } else {
                    // If response cannot be parsed to json, consider it is plain text
                    // TODO: We should have a more graceful way to do text request!
                        callback(resp);
                    }
                })
                .error(function (err) {
                    console.log('Request failed...');
                    console.log(err);
                })
        }
    }
})