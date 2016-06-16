
var General = {
    originData: {},
	getTabConfig () {
		return {
            title: 'General',
            showCmd: ['show summary', 'show arm config'],
            items: [{
                ref: 'name',
                label: 'Name'
            }, {
                ref: 'vcipaddress',
                label: 'IP'
            }, {
                ref: 'allownewaps',
                label: 'Auto join mode',
                type: 'select',
                options: [{ text: 'Enabled', value: 'enable' }, { text: 'Disabled', value: 'disable' }]
            }, {
                ref: 'clientmatch',
                label: 'Client Match',
                type: 'select',
                options: [{ text: 'Enabled', value: 'enable' }, { text: 'Disabled', value: 'disable' }]
            }],
            handler: function handler() {}
        };
	},
	parseData (data) {
		if (data.showsummary) {
            $.each(data.showsummary,  (key, value)=> {
                if (key == 'name' || key == 'vcipaddress' || key == 'allownewaps') {
                    this.originData[key] = value;
                }
            });
        }
        if (data.showarmconfig) {
            $.each(data.showarmconfig,  (key, value)=> {
                if (key == 'clientmatch') {
                    this.originData[key] = value;
                }
            });
        }
        return this.originData;
	},
	getCMD (changeData) {
        var cmd = '';
        var generalCmd = '', armCmd = '';
        if (changeData) {
            if (changeData['name'] !== this.originData['name']) {
                generalCmd += 'name ' + changeData['name'] + '\n';
            }
            if (changeData['vcipaddress'] !== this.originData['vcipaddress']) {
                var vcip = changeData['vcipaddress'].length > 0 ? changeData['vcipaddress'] : '0.0.0.0';
                generalCmd += "virtual-controller-ip " + changeData['vcipaddress'] + '\n';
            }
            if (changeData['allownewaps'] !== this.originData['allownewaps']) {
                generalCmd += changeData['allownewaps'] == 'enable' ? 'allow-new-aps' + '\n' : 'no allow-new-aps' + '\n';
            }
            if (changeData['clientmatch'] !== this.originData['clientmatch']) {
                armCmd += changeData['clientmatch'] == 'enable' ? 'client-match' + '\n' : 'no client-match' + '\n';
            }
        }
        armCmd.length > 0 ? armCmd = 'arm \n' + armCmd + '\nexit' : '';
        return cmd = generalCmd + armCmd;
    }
};

module.exports = {
	General : General
}