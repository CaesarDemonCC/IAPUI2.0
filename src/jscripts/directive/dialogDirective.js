app.directive('dialogDirective', function() {
	return {
		scope: {
			okCallback : '&',
			display: '=',
			message: '='
		},
		templateUrl : 'templates/dialogDirective.html',
		controller : function ($scope) {
			$scope.cancelHandler = function () {
				$scope.display = false;
			}

			$scope.okHandler = function () {
				$scope.display = false;
				$scope.okCallback();
			}
		}
	}
});