
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
        if (changeData) {
            if (changeData['name'] !== this.originData['name']) {
                cmd += 'name ' + changeData['name'] + '\n';
            }
            if (changeData['vcipaddress'] !== this.originData['vcipaddress']) {
                var vcip = changeData['vcipaddress'].length > 0 ? changeData['vcipaddress'] : '0.0.0.0';
                cmd += "virtual-controller-ip " + changeData['vcipaddress'] + '\n';
            }
            if (changeData['allownewaps'] !== this.originData['allownewaps']) {
                cmd += changeData['allownewaps'] == 'enable' ? 'allow-new-aps' + '\n' : 'no allow-new-aps' + '\n';
            }
            if (changeData['clientmatch'] !== this.originData['clientmatch']) {
                cmd += changeData['clientmatch'] == 'enable' ? 'client-match' + '\n' : 'no client-match' + '\n';
            }
        }
        return cmd;
    }
};

module.exports = {
	General : General
}