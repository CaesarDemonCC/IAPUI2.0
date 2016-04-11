app.controller('homePageController', function ($scope, Ajax, $http, $location) {
    

    function parseSummaryData (data) {
        var summaryData = {
            'networks' : [],
            'aps': [],
            'clients': []
        };
        if (data) {
            if (data.t) {
                for (var i = 0; i < data.t.length; i++) {
                    var section = data.t[i];
                    if (section._tn.toLowerCase().indexOf('network') !== -1) {
                        if (section.r) {
                            if (Object.prototype.toString.call(section.r) === '[object Object]') {
                                summaryData['networks'].push(angular.extend({}, section.r));
                            } else {
                                for (var j = 0; j < section.r.length; j++) {
                                    summaryData['networks'].push(angular.extend({}, section.r[j]));
                                }
                            }
                        }
                    }

                    if (section._tn.toLowerCase().indexOf('ap') !== -1) {
                        if (section.r) {
                            if (Object.prototype.toString.call(section.r) === '[object Object]') {
                                summaryData['aps'].push(angular.extend({}, section.r));
                            } else {
                                for (var j = 0; j < section.r.length; j++) {
                                    summaryData['aps'].push(angular.extend({}, section.r[j]));
                                }
                            }
                        }
                    }

                    if (section._tn.toLowerCase().indexOf('client') !== -1) {
                        if (section.r) {
                            if (Object.prototype.toString.call(section.r) === '[object Object]') {
                                summaryData['clients'].push(angular.extend({}, section.r));
                            } else {
                                for (var j = 0; j < section.r.length; j++) {
                                    summaryData['clients'].push(angular.extend({}, section.r[j]));
                                }
                            }
                        }
                    }
                } 
            }
        }

        summaryData['clients'].push({'c':['0a:1b:23:5f:11:87', 'lshu-iphone', '192.168.0.101', 'lshu-test', 'AP-1']})
        return summaryData;
    }

    $scope.showSummary = function () {
        var cmd = 'opcode=show&cmd=show summary';
        Ajax.doRequest(cmd, function (data) {
            var summaryData = parseSummaryData(data);

            var networkCount = summaryData['networks'].length,
                clientCount = summaryData['clients'].length;
            // If the cluster is factory default status, popup WiFi Config wizard
            if (networkCount === 1 && summaryData['networks'][0]['c'][0] === 'instant') {
                $location.path('/network/new/');
            } else {
                $scope.summaryData = summaryData;
            }
            $scope['network_table_head'] = networkCount + ' Network' + (networkCount > 1 ? 's' : '');
            $scope['client_table_head'] = clientCount + ' Client' + (clientCount > 1 ? 's' : '');
        })
    }

    $scope.showSummary();

    $scope.deleteNetwork = function (profileName) {
        var url = "opcode=config&ip=127.0.0.1&cmd=' no wlan ssid-profile " + profileName + "'";
        Ajax.doRequest(url, function (data) {
        }, true);
        $scope.showSummary();
    }
})