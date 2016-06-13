import {Xml2Json} from './xmlParse'

var Ajax = {
	api : '../swarm.cgi',
	url : '',
	options: null
};


Ajax.get = function (data, callback, options, type = 'get') {
	if (type == 'get') {
		Ajax.url = '?'; 
	}
	this.options = options;
	
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
			var jsonResult = Xml2Json(result, this.options);
			if (jsonResult && jsonResult._debug) {
				console.log('debug:' + jsonResult._debug);
				delete jsonResult._debug;
			}
			if (callback) {
				callback(jsonResult);
			}
		}.bind(this)
	})
	.done(function() {
		console.log( type + ":success" );
	})
	.fail(function() {
		console.log( type + ":error" );
	});
};

Ajax.post = function (data, callback, options) {
	Ajax.get(data, callback, options,  'post');
};

module.exports = {
	Ajax : Ajax
}