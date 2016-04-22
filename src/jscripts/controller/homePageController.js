app.controller('homePageController', function ($scope, Ajax, $http, $location) {

    function parseSummaryData (data) {
        var summaryData = {
            'networks' : [],
            'aps': [],
            'clients': []
        };
        if (data) {
            for (var i in data) {
                //if (i.toLowerCase().match(/^\d network/)) {
                //    summaryData.networks = data[i];
                //}
                if (i.toLowerCase().match(/^\d access point/)) {
                    summaryData.aps = data[i];
                }
                if (i.toLowerCase().match(/^\d client/)) {
                    summaryData.clients = data[i];
                }
            }
        }

        summaryData['clients'].push({
            'name': 'lshu-iphone',
            'mac': '0a:1b:23:5f:11:87',
            'ipaddress': '192.168.0.101',
            'accesspoint': 'AP-1',
            'essid': 'lshu-test'
        })
        return summaryData;
    }

    function parseStatsData (data) {
        var statsData = {
            'througput': {
                'out': 0,
                'in': 0
            }
        };
        if (data) {
            if (data['Swarm Global Stats']) {
                statsData.througput.out = data['Swarm Global Stats'][0]['throughput[out](bps)'];
                statsData.througput.in = data['Swarm Global Stats'][0]['throughput[in](bps)'];

                //Test data
                statsData.througput.out = Math.random() * 1000;
                statsData.througput.in = Math.random() * 1000;
            }
        }

        return statsData;
    }

    $scope.showSummary = function () {
        var cmd = 'opcode=show&cmd=show summary';
        Ajax.doRequest(cmd, function (data) {
            var summaryData = parseSummaryData(data);

            //var networkCount = summaryData['networks'].length,
            var apCount = summaryData['aps'].length,
                clientCount = summaryData['clients'].length;
            // If the cluster is factory default status, popup WiFi Config wizard
            //if (networkCount === 1 && summaryData['networks'][0].profilename === 'instant') {
            //    $location.path('/network/new/');
            //} else {
                $scope.summaryData = summaryData;
            //}
            //$scope['network_table_head'] = networkCount + ' Network' + (networkCount > 1 ? 's' : '');
            $scope['ap_table_head'] = apCount + ' Access Point' + (apCount > 1 ? 's' : '');
            $scope['client_table_head'] = clientCount + ' Client' + (clientCount > 1 ? 's' : '');
        })
    }

    $scope.showStatsGlobal = function () {
        var cmd = 'opcode=show&cmd=show stats global 1';
        Ajax.doRequest(cmd, function (data) {
            var statsData = parseStatsData(data);
            $scope.statsData = statsData;
        })
    }

    $scope.refresh = function () {
        $scope.showSummary();
        $scope.showStatsGlobal();
    }

    var refreshInterval = setInterval($scope.refresh, 3000);
    $scope.refresh();

    $scope.deleteNetwork = function (profileName) {
        var url = "opcode=config&ip=127.0.0.1&cmd=' no wlan ssid-profile " + profileName + "'";
        Ajax.doRequest(url, function (data) {
        }, true);
        $scope.refresh();
    }

    $scope.$on('$destroy', function () {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
    })

})