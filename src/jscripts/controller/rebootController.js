app.controller('rebootController', function ($scope, $location, Ajax) {
    // reboot all aps
    $scope.rebootAll = function () {
        var cmd = "opcode=action&cmd='reload all'";

        Ajax.doRequest(cmd, function (data) {
        }, true);
    };
});