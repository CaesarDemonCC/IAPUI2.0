import {XmlParseJson} from './XmlParse'

var Ajax = {
	api : '../swarm.cgi',
	url : ''
};


Ajax.get = function (data, callback, type = 'get') {
	if (type == 'get') {
		Ajax.url = '?'; 
	}
	$.extend({
		'refresh' : false,
		'nocache' : Math.random()
	}, data);
	$.ajax({
		type: type,
		dataType: 'xml',
		url: Ajax.api + Ajax.url,
		data: data,
		success: function (result) {
			var jsonResult = XmlParseJson(result);
			if (jsonResult && jsonResult._debug) {
				console.log('debug:' + jsonResult._debug);
				delete jsonResult._debug;
			}
			if (callback) {
				callback(jsonResult);
			}
		}
	})
	.done(function() {
		console.log( type + ":success" );
	})
	.fail(function() {
		console.log( type + ":error" );
	});
};

Ajax.post = function (data, callback) {
	Ajax.get(data, callback, 'post');
};

module.exports = {
	AjaxGet : Ajax.get,
	AjaxPost : Ajax.post
}