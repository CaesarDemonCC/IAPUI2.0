var XmlParse = {
	_x2js: new X2JS()
};

/**
 * Decodes symbols at the string to html
 * 
 * @method
 * @param {String} html String for decoding
 * @return {String} String after decoding
 */
XmlParse.decodeHTML = function (html) {
    if (html && html.length > 0) {
        var complete = false;
        var startHtml;
        var elem = document.createElement('span');
        // To avoid html tag parsing and automatic completion
        // e.g. <iframe> =====> <iframe></iframe>
        html = html.replace(/</g, '&lt;');
        elem.innerHTML = html;
        // here we decode these: &amp;#39;, &amp;#32;, etc.
        //we can not use goog.dom.getTextContent - it's convert to or more spaces to one
        html = elem.innerHTML; 
        html = html.replace(/&amp;/g, '&');
        html = html.replace(/&lt;/g, '<');
        html = html.replace(/&gt;/g, '>');
        html = html.replace(/&quot;/g, '"');
    } else {
        html = '';
    }
    return html;
};

XmlParse.formatJson = function (item) {
	if (XmlParse._formatOptions['removeKeySpace']) {
        item = item.replace(/[\s"]/g, '');
    }
    if (XmlParse._formatOptions['trim']) {
        item = item.replace(/^ +| +$/g, '');
    }
    if (XmlParse._formatOptions['lowerCase']) {
        item = item.toLowerCase();
    }
    return item;
};

XmlParse.object2Array = function (originTable) {
    var result = [];
    if (!$.isArray(originTable)) {
		result.push(originTable);
	} else {
		result = originTable;
	}
	return result;
}

XmlParse.parseXmlData = function (data, result) {
    data = XmlParse.object2Array(data);
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        
        var formatItem = XmlParse.formatJson(item["_name"]);

        result[formatItem] = this.decodeHTML(item["Text"]);
    }
};

XmlParse.parseXmlTable = function (table, result) {
    table = XmlParse.object2Array(table);
	for (var i = 0; i < table.length; i++) {
		var tableName = table[i]['_tn'].replace(/[\s"]/g, '');
		var columnCount = table[i]['_nc'];
		var tableColumn = XmlParse.object2Array(table[i]['th']['h']);
		var tableRow = table[i]['r'];
    	result[tableName] = {};
		
		if ($.isArray(table[i]['th'])) {
			// TODO ------------ do more test to decide if we to keep it
			// table column and row are in 'th'(show alg)
			var obj = {};
			for (var thRowIndex = 1; thRowIndex < table[i]['th'].length; thRowIndex++) {
				obj[table[i]['th'][thRowIndex]['h'][0]] = this.decodeHTML(table[i]['th'][thRowIndex]['h'][1]);
			}
			result[tableName] = obj;
		} else { // normal table(most situation)
    		if (tableRow == undefined) {
    			// table has one column and no row value
    			var columns = {};
    			for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
    				var formatColumn = XmlParse.formatJson(tableColumn[columnIndex]);
    				columns[formatColumn] = undefined;
    			}
    			result[tableName] = columns;
    		}
    		else {
    			if ($.isArray(tableRow)) { 
    				// table has one column in 'th' and rows value in 'c'
    				var rows = [];
	    			for (var rowIndex = 0; rowIndex < tableRow.length; rowIndex++) {
    					var row = {};
    					for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
		    				var formatColumn = XmlParse.formatJson(tableColumn[columnIndex]);
    						row[formatColumn] = this.decodeHTML(XmlParse.object2Array(tableRow[rowIndex]['c'])[columnIndex]);
		    			}
	    				rows.push(row);
					}
    				result[tableName] = rows;
	    		} else { 
	    			// table has one column and one row value
	    			var oneRow = XmlParse.object2Array(tableRow['c']);
	    			var columns = {};
	    			for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
	    				var formatColumn = XmlParse.formatJson(tableColumn[columnIndex]);
	    				columns[formatColumn] = this.decodeHTML(oneRow[columnIndex]);
	    			}
	    			result[tableName] = columns;
	    		}
	    	}
	    }
	}
};

XmlParse.parseXmlDataTable = function (jsonData, result) {

	if (jsonData && jsonData.re && jsonData.re.data) {
		XmlParse.parseXmlData(jsonData.re.data, result);
	}
	
	if (jsonData && jsonData.re && jsonData.re.t) {
		XmlParse.parseXmlTable(jsonData.re.t, result);
	}

	/// output data
	if (jsonData && jsonData.data) {
		XmlParse.parseXmlData(jsonData.data, result);
	}
	
	if (jsonData && jsonData.t) {
		XmlParse.parseXmlTable(jsonData.t, result);
	}

	if (jsonData && jsonData.re && jsonData.re.output) {
		$.each(jsonData.re.output,function (index, item) {
			var showCMD = XmlParse.formatJson(item["_command"]);
	        result[showCMD] = {};

			if (item.output) {
				XmlParse.parseXmlOutputTable(item.output, result[showCMD]);
			} else {
				XmlParse.parseXmlDataTable(item, result[showCMD]);
			}
		});
	}
};

XmlParse.parseXmlOutputTable = function (outputData, result) {
	$.each(outputData, function (index, item){
		var showCMD = XmlParse.formatJson(item["_command"]);
	    result[showCMD] = {};
		XmlParse.parseXmlDataTable(item, result[showCMD]);
	});
}

XmlParse.xml2Json = function (xmlData, options) {
	var jsonData;
	if (typeof xmlData === 'string') {
		jsonData = XmlParse._x2js.xml_str2json(xmlData);
	} else {
		jsonData = XmlParse._x2js.xml2json(xmlData);
	}
	XmlParse._formatOptions = {
	    'removeKeySpace' : true, ///Remove all space
	    'trim' : true,           ///Remove start or end space
	    'lowerCase' : true       ///Is parse to lower case
	}
	if (options) {
	    $.extend(XmlParse._formatOptions, options);
	}
	var result = {};
	
	XmlParse.parseXmlDataTable(jsonData, result);

	return result;
};

module.exports = {
	Xml2Json : XmlParse.xml2Json
}