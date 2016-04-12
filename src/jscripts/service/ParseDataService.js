app.factory('ParseData', function() {
    var _options = {
        'replaceKeySpace' : true,
        'lowerKeyCase' : true
    };
	
    return {
        parse : function (jsonData, options, callback) {
            if (options) {
                _options['replaceKeySpace'] = options['replaceKeySpace'];
                _options['lowerKeyCase'] = options['lowerKeyCase'];
            }
            var result = {};
            //parse jsonData.re.data
            if (jsonData.re.data) {
                var dataLength = 1;
                //jsonData.re.data maybe object or array
                if (jsonData.re.data.length && jsonData.re.data.length >= 0) {
                    dataLength = jsonData.re.data.length;
                }
                for (var i = 0; i < dataLength; i++) {
                    var item = jsonData.re.data[i];
                    if (_options['replaceKeySpace']) {
                        item["_name"] = item["_name"].replace(/[\s"]/g, '');
                    }
                    if (_options['lowerKeyCase']) {
                        item["_name"] = item["_name"].toLowerCase();
                    }

                    result[item["_name"]] = item["Text"];
                }
            }

            //parse jsonData.re.t  ------table
            if (jsonData.re.t) {
                var dataLength = 1;
                //jsonData.re.t maybe object or array
                if (jsonData.re.t.length && jsonData.re.t.length >= 0) {
                    dataLength = jsonData.re.t.length;
                }
                for (var i = 0; i < dataLength; i++) {
                    var item = jsonData.re.t[i];
                    if (item.r) {
                        var itemArr = [];
                        var itemDataLength = 1;
                        //item.r maybe object or array
                        if (item.r.length && item.r.length >= 0) {
                            itemDataLength = item.r.length;
                        }
                        for (var j = 0; j < itemDataLength; j++) {
                            var tTempData = {};
                            var tableKeyItem = item.th['h'];
                            var tableValueItem = item.r[j] || item.r;
                            for (var x = 0; x <= tableKeyItem.length - 1; x++) {
                                if (_options['replaceKeySpace']) {
                                    tableKeyItem[x] = tableKeyItem[x].replace(/[\s"]/g, '');
                                }
                                if (_options['lowerKeyCase']) {
                                    tableKeyItem[x] = tableKeyItem[x].toLowerCase();
                                }
                                tTempData[tableKeyItem[x]]=tableValueItem['c'][x];
                            }
                            itemArr.push(tTempData);
                        }
                        result[item['_tn']]=itemArr;
                    }
                }
            }
            if (callback) {
                callback(result);
            }
        }
    };
})