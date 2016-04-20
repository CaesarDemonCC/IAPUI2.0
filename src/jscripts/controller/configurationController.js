app.controller('configurationController', function($scope, Ajax){

    Ajax.doRequest('opcode=config-audit&ip=127.0.0.1', function (data) {
        console.log(data);
        $scope.currentConfig = data;
    })

    $scope.clearConfig = function () {
        var cmd = 'opcode=action&ip=127.0.0.1&cmd=write erase all reboot';
        alert('Clear Congiguration!');
        //Ajax.doRequest(cmd);
    }      
});