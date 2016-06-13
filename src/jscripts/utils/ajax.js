import {Xml2Json} from './xmlParse'

var Ajax = {
	api : '../swarm.cgi',
	url : ''
};


Ajax.get = function (data, callback, options, type = 'get') {
	if (type == 'get') {
		Ajax.url = '?'; 
	}

	$.extend(data, {
		'refresh' : false,
		'nocache' : Math.random()
	});
	$.ajax({
		type: type,
		dataType: 'xml',
		url: Ajax.api + Ajax.url,
		data: data,
		success: function (result) {
			var jsonResult = Xml2Json(result, options);
			
			if (callback) {
				callback(jsonResult);
			}
		}
	})
};

Ajax.post = function (data, callback, options) {
	Ajax.get(data, callback, options,  'post');
};

module.exports = {
	Ajax : Ajax
}