app.controller('rebootController', function ($scope, Ajax) {
    
    $scope.reboot = {
    	warningDisplay: false,
    	warningMessage: 'Service will be interrupted during the Reboot process. Do you want to continue?'
    };

    // show warning
    $scope.showWarning = function () {
    	$scope.reboot.warningDisplay = true;
    }
    // reboot all aps
    $scope.rebootAll = function () {
        var cmd = "opcode=action&cmd='reload all'";
        alert('Reboot!');
        /*Ajax.doRequest(cmd, function (data) {
        }, true);*/
    };
});