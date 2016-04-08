// casper options
exports.init = function () {
	var clientScripts = [workingDirectory + '/common/user.js'];

	casper.options.clientScripts.push(clientScripts);
	casper.options.logLeval = 'debug';
	casper.options.verbose = true;
	
	casper.options.viewportSize = {
	    width: 1200,
	    height: 600
	};

	casper.options.onLoadError = function (casper, requestUrl, status) {
		casper.echo('Can not load [' + requestUrl + '].', 'ERROR');
		casper.exit();
	};
};

