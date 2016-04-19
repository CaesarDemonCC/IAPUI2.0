app.directive('wirelessNetworksDirective', function() {
	return {
		scope: {
			refresh : '@'
		},
		templateUrl : 'templates/wirelessNetworksDirective.html',
		controller : function ($scope, Ajax, $http, $location, $rootScope) {
			function parseSummaryData (data) {
		        var networks = [];
		        if (data) {
		            for (var i in data) {
		                if (i.toLowerCase().match(/^\d network/)) {
		                    networks = data[i];
		                }
		            }
		        }
		        return networks;
		    };

			$scope.showNetwork = function () {
		        var cmd = 'opcode=show&cmd=show summary';
		        Ajax.doRequest(cmd, function (data) {
		            var networks = parseSummaryData(data);

		            var networkCount = networks.length;
		            if (networkCount === 1 && networks[0].profilename === 'instant') {
		                if (!$rootScope.stopNewNetwork)
		                	$location.path('/network/new/');
		            } else {
		                $scope.networks = networks;
		            }
		            $scope['network_table_head'] = networkCount + ' Network' + (networkCount > 1 ? 's' : '');
		        })
		    }

		    $scope.refreshNetwork = function () {
		        $scope.showNetwork();
		    }

		    var refreshInterval;
		    if ($scope.refresh){
		    	refreshInterval = setInterval($scope.refreshNetwork, 10000);
		    }

		    $scope.refreshNetwork();

		    $scope.deleteNetwork = function (profileName) {
		        var url = "opcode=config&ip=127.0.0.1&cmd=' no wlan ssid-profile " + profileName + "'";
		        Ajax.doRequest(url, function (data) {
		        }, true);
		        $scope.refreshNetwork();
		    }

		    $scope.$on('$destroy', function () {
		        if (refreshInterval) {
		            clearInterval(refreshInterval);
		        }
    		})
		}
	}
});