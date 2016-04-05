app.controller('uplinkPageController', function ($scope, Ajax) {
    var cmd = 'opcode=show&cmd=show pppoe config';

    var uplinkSSIDs = ['ethersphere-wap2', 'ethersphere-wap2-instant', 'bj-office-test', 'hpn-byod'].sort();

    var uplinkData = {
        'uplinkType' : 'pppoe',
        'uplinkSSIDs' : uplinkSSIDs
    }
    $scope.data = uplinkData;
    Ajax.doRequest(cmd, function (data) {
    })

    $scope.saveSettings = function () {
        var cmd = '';

        switch ($scope.data.uplinkType) {
            case 'pppoe': {
                cmd += 'pppoe-uplink-profile\n' 
                       + 'pppoe-username ' + $scope.data.pppoeUsername + '\n'
                       + 'pppoe-passwd ' + $scope.data.pppoePasswd + '\n'
                       + 'pppoe-svcname ' + $scope.data.pppoeService + '\n'

                       + 'exit\n';
            }

            case 'dhcp': {

            }

            case 'static': {

            }

            case 'wifiuplink': {

            }

            default: {
                break;
            }
        }

        var url = 'opcode=config&cmd=' + cmd;
        Ajax.doRequest(url, function () {

        })
    }
})