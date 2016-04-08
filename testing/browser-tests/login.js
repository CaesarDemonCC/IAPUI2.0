// login
var fs = require('fs');
var workingDirectory = fs.workingDirectory;
// require test
var casperOptions = require(workingDirectory + '/common/casper-options');
casperOptions.init();
/*
ERROR: white text on red background
INFO: green text
TRACE: green text
PARAMETER: cyan text
COMMENT: yellow text
WARNING: red text
GREEN_BAR: white text on green background
RED_BAR: white text on red background
INFO_BAR: cyan text
WARN_BAR: white text on orange background
*/
// Get url from cli arg
var url = casper.cli.get('url');
if (!url) {
	casper.echo("Couldn't find url, exiting.", 'ERROR');
	casper.exit();
}

// make directory
var shotsPath = 'screenshots/';
/*if (fs.exists(shotsPath)) {
	fs.removeTree(shotsPath);
}

if(fs.makeDirectory(shotsPath)) {
	casper.echo('[' + shotsPath + '] was created.', 'INFO');
} else {
	casper.echo('['+shotsPath+'] is NOT created.');
	casper.exit();
}*/

// login
casper.test.begin('Login', 2, function suite(test) {
	// 1. Open login page
	casper.start(url, function() {
	    casper.test.comment("Login page " + " [ " + url + ']');
	    this.page.onConsoleMessage = function(e) {
	      	console.log(e);
	   	};
	});
	// 2. Input username/password
	casper.thenEvaluate(function() {
	    document.querySelector('#usernameId').value = USER.USERNAME;
		document.querySelector('#passwordId').value = USER.PASSWORD;
	});
	// 3. Click login button
	casper.thenClick('#login-dialog-button', function() {
		this.capture(shotsPath + 'login.png');
		casper.test.comment('Login button clicked.');
	});

	// 4. Wait loading
	casper.wait(5000);
	// 5. Goto main page
	casper.then(function() {
		var user = this.evaluate(function () {
			return USER.USERNAME;
		});
	    casper.test.comment('>>>>' + user + ' login.');
	    this.capture(shotsPath + 'main.png');
	    test.assertExists('#main-table');
	    test.assertVisible('#main-table');
	    //var str="[{\"城市\":\"北京\",\"面积\":16800,\"人口\":1600},{\"城市\":\"上海\",\"面积\":6400,\"人口\":1800}]"
    	//this.echo(str);
    	
    	// write file
		//var path = './output.txt';
		//var content = 'Hello World!';
		//fs.write(path, content, 'w');
	});

	casper.run(function() {
        test.done();
    });
});

