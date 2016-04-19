app.controller('networkController', function ($scope, $location, $routeParams, Ajax, $window, $rootScope) {
    if($routeParams) {
        switch ($routeParams.action) {
            case 'new' : 
                $scope.title = 'NEW WLAN';
                $scope.profileName='';
                $scope.essid='';
                $scope.opmode='wpa2-psk-aes';
                $scope.passphrase='';
                $scope.band='all';
            break;
            case 'edit' : 
                showNetworkSSID($routeParams.profileName, function (editNetwork) {
                    $scope.title = 'Edit ' + editNetwork.essid;
                    $scope.profileName=$routeParams.profileName;
                    $scope.essid=editNetwork.essid;
                    $scope.opmode=editNetwork.mode;
                    $scope.passphrase=editNetwork.passphrase;
                    $scope.band=editNetwork.band;
                });
            break;
        }
    };

    function showNetworkSSID (profileName, callback) {
        var cmd = 'opcode=show&cmd=show network ' + profileName;
        Ajax.doRequest(cmd, function (data) {
            callback(data);
        });
    };

    // function parseNetworkSSID (data) {
    //     var result = {};
    //     for (var i = data.data.length - 1; i >= 0; i--) {
    //         var label = data.data[i]['_name'];
    //         label = label.replace(/[\s"]/g, '').toLowerCase();
    //         result[label] = data.data[i]['Text'];
    //     }
    //     return result;
    // };

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
            cmd += ' rf-band  ' + $scope.band + '\n';
            cmd += 'exit\n' + "'";
            var url = "opcode=config&ip=127.0.0.1&cmd='" + cmd;
            Ajax.doRequest(url, function (data) {
            }, true);
            $location.path('/home');
        }   
    };

    $scope.cancelHandler = function () {
        $rootScope.stopNewNetwork = true;
        $window.history.back();
    }
    
});