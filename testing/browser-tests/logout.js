
// logout
casper.test.begin('Logout', 3, function suite(test) {
	casper.start(url, function() {
        test.assertExists('#logout');
    });

    casper.thenClick('#logout', function() {
		casper.test.comment('Logout link clicked.');
	});

	casper.wait(5000);

	casper.then(function() {
		var user = this.evaluate(function () {
			return USER.USERNAME;
		});
	    casper.test.comment('>>>>' + user + ' logout.');
	    this.capture('screenshots/logout.png');
	    test.assertExists('#usernameId');
		test.assertVisible('#usernameId');
	});
	
	casper.run(function() {
        test.done();
    });
});


