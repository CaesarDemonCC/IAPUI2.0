
var General = {
	getTabConfig () {
		return {
            title: 'General',
            showCmd : 'show summary',
            items: [{
                ref: 'name',
                label: 'Name'
            }, {
                ref: 'vcipaddress',
                label: 'IP'
            }, {
                ref: 'ntpserver',
                label: 'NTP server'
            }],
            handler: function () {
            }
        };
	},
	parseData (data) {
		var generalData = {};
		if (data.showsummary) {
            $.each(data.showsummary, (key,value) => {
                if (key == 'name' || key == 'vcipaddress' || key == 'ntpserver') {
                    generalData[key] = value;
                }
            })
        }
        return generalData;
	},
	render () {
		return (<div/>)
	}
};

module.exports = {
	General : General
}