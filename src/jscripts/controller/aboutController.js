app.controller('aboutController', function ($scope, $location, Ajax) {
    
	$scope.aboutData = {};

    // get about content
    $scope.getAbout = function () {
        var cmd = "opcode=show&ip=127.0.0.1&cmd='show about'";

        Ajax.doRequest(cmd, function (data) {
        	var simpleData = {};
        	// remove the FCC info
        	angular.forEach(data, function(value, key) {
        		if (key.indexOf('FCC') == -1) {
        			this[key] = value;
        		}
			}, simpleData);
        	$scope.aboutData = simpleData;
        }, true, {'lowerCase': false, 'removeKeySpace': false});
    };

    $scope.getAbout();
});