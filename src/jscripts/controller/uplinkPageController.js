app.controller('uplinkPageController', function ($scope, $window, Ajax, Utils) {

    var uplinkSSIDs = ['ethersphere-wap2', 'ethersphere-wap2-instant', 'bj-office-test', 'hpn-byod'].sort();

    var uplinkData = {
        'uplinkType' : 'pppoe',
        'uplinkSSIDs' : uplinkSSIDs
    }
    $scope.data = uplinkData;
    

    $scope.saveSettings = function () {
        var cmd = '';

        switch ($scope.data.uplinkType) {
            case 'pppoe': {
                cmd += 'pppoe-uplink-profile \n' 
                cmd += 'pppoe-username ' + $scope.data.pppoe.user + '\n'
                if ($scope.data.pppoe.password != $scope.data.pppoe.bakpassword){
                    cmd += 'pppoe-passwd ' + $scope.data.pppoe.password + '\n'
                }
                cmd += 'pppoe-svcname ' + $scope.data.pppoe.servicename + '\n'
                cmd += 'exit\n';
                break;
            }
            case 'dhcp': {
                break;
            }
            case 'static': {

                break;
            }
            case 'wifiuplink': {

                break;
            }
            default: {
                break;
            }
        }

        var url = "opcode=config&ip=127.0.0.1&cmd='" + cmd + "'";
        Ajax.doRequest(url, function (data) {
            if (data == undefined) {
                $scope.refresh();
                $scope.$emit('saveDataSuccessful');
            }
        }, true)
    }

    $scope.refresh = function () {
        var cmd = 'opcode=show&cmd=show pppoe config';
        
        Ajax.doRequest(cmd, function (data) {
            for (var item in data) {
                if (item == 'PPPoE Configuration') {
                    $scope.data.pppoe = Utils.parseTabelToObj(data[item],'type','value');
                    $scope.data.pppoe.bakpassword = $scope.data.pppoe.password;
                }
            }
        });
    }
    $scope.refresh();

    $scope.cancelHandler = function () {
        $window.history.back();
    }
})