app.controller('aboutController', function ($scope, $location, Ajax) {
    
	$scope.aboutData = {};

	function generateAboutData(data) {
		var aboutData = [];

		for (var i = 0; i < data.data.length; i++) {
	        var text = data.data[i].Text;
	        var name = data.data[i]['_name'];
	        if (name.indexOf(':') != name.length - 1) {
	            name += ':';
	        }
	        aboutData.push({label: name, text: text});
	    }

	    return aboutData;
	}
    // get about content
    $scope.getAbout = function () {
        var cmd = "opcode=show&ip=127.0.0.1&cmd='show about'";

        Ajax.doRequest(cmd, function (data) {
        	$scope.aboutData = generateAboutData(data);
        }, true);
    };

    $scope.getAbout();
});