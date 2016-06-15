import {Xml2Json} from './xmlParse'
import {getUser} from '../utils/auth'

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
		'nocache' : Math.random(),
        'ip' : '127.0.0.1'        
	});
	if (getUser().sid) {
		$.extend(data, {
			'sid' : getUser().sid        
		});
	}
	$.ajax({
		type: type,
		dataType: 'xml',
		url: Ajax.api + Ajax.url,
		data: data,
		success: function (result) {
			var jsonResult = Xml2Json(result, options);
			if (jsonResult.error) {
				if (jsonResult.error === 'Invalid Session ID') {
					location.href = '#/logout';
				} else {
					alert(jsonResult.error);
				}
			} else {
				if (callback) {
					callback(jsonResult);
				}
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