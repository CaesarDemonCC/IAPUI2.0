app.controller('networkController', function ($scope, $location, $routeParams, Ajax) {
    if($routeParams) {
        switch ($routeParams.action) {
            case 'new' : 
                $scope.profileName='';
                $scope.essid='';
                $scope.opmode='wpa2-psk-aes';
                $scope.passphrase='';
                $scope.title = 'NEW WLAN';
            break;
            case 'edit' : 
                showNetworkSSID($routeParams.profileName, function (editNetwork) {
                    $scope.profileName=$routeParams.profileName;
                    $scope.essid=editNetwork.essid;
                    $scope.opmode=editNetwork.mode;
                    $scope.passphrase=editNetwork.passphrase;
                    $scope.title = 'Edit ' + editNetwork.essid;
                });
            break;
        }
    };

    function showNetworkSSID (profileName, callback) {
        var cmd = 'opcode=show&cmd=show network ' + profileName;
        Ajax.doRequest(cmd, function (data) {
            callback(parseNetworkSSID(data));
        });
    };

    function parseNetworkSSID (data) {
        var result = {};
        for (var i = data.data.length - 1; i >= 0; i--) {
            var label = data.data[i]['_name'];
            label = label.replace(/[\s"]/g, '').toLowerCase();
            result[label] = data.data[i]['Text'];
        }
        return result;
    };

    $scope.saveNetwork = function () {
        if ($scope.essid) {
            var cmd = '';
            if ($routeParams.action == 'new') {
                cmd = ' wlan ssid-profile ' + $scope.essid + '\n';
            } else if ($routeParams.action == 'edit') {
                cmd = ' wlan ssid-profile ' + $scope.profileName + '\n';
            }
            cmd += ' essid ' + $scope.essid + '\n';
            if($scope.opmode == 'opensystem') {
                cmd += ' no wpa-passphrase ' + '\n';
            } else {
                cmd += ' wpa-passphrase ' + $scope.passphrase + '\n';
            }
            cmd += ' opmode  ' + $scope.opmode + '\n';
            cmd += 'exit\n' + "'";
            var url = "opcode=config&ip=127.0.0.1&cmd='" + cmd;
            Ajax.doRequest(url, function (data) {
            }, true);
            $location.path('/home');
        }   
    };

    
});