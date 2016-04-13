app.factory('Utils', function () {
	return {
		parseTabelToObj : function (tableData, key, value, options) {
            var _options = {
                'removeKeySpace' : true, ///Remove all space
                'trim' : true,           ///Remove start or end space
                'lowerCase' : true       ///Is parse to lower case
            };
			if (options) {
                angular.extend(_options, options);
            }
			var result = {};
			for (var item in tableData) {
				if (_options['removeKeySpace']) {
                    tableData[item][key] = tableData[item][key].replace(/[\s"]/g, '');
                }
                if (_options['trim']) {
                    tableData[item][key] = tableData[item][key].replace(/^ +| +$/g, '');
                }
                if (_options['lowerCase']) {
                    tableData[item][key] = tableData[item][key].toLowerCase();
                }
				result[tableData[item][key]] = tableData[item][value]
			}
			return result;
		}
	}
});