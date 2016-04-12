app.factory('ParseData', function() {
    var _options = {
        'debug' : true,          ///When table data is null, output columns to _debug field 
        'removeKeySpace' : true, ///Remove all space
        'trim' : true,           ///Remove start or end space
        'lowerCase' : true       ///Is parse to lower case
    };
	
    return {
        parse : function (jsonData, callback, options) {
            if (options) {
                angular.extend(_options, options);
            }
            var result = {};
            if (_options['debug']) {
                result['_debug'] = {};
            }
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
                    if (_options['trim']) {
                        item["_name"] = item["_name"].replace(/^ +| +$/g, '');
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
                                if (_options['trim']) {
                                    tableKeyItem[x] = tableKeyItem[x].replace(/^ +| +$/g, '');
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
                    else if (_options['debug']) {
                        var debugItemKeys = {};
                        for (var x = 0; x < item.th['h'].length; x++) {
                            var debugItem = item.th['h'][x];
                            if (_options['replaceKeySpace']) {
                                debugItem = debugItem.replace(/[\s"]/g, '');
                            }
                            if (_options['trim']) {
                                debugItem = debugItem.replace(/^ +| +$/g, '');
                            }
                            if (_options['lowerKeyCase']) {
                                debugItem = debugItem.toLowerCase();
                            }
                            debugItemKeys[debugItem] = undefined;
                        }
                        result['_debug'][item['_tn']] = debugItemKeys;
                    }
                }
            }
            if (callback) {
                callback(result);
            }
        }
    };
})