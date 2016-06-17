
var Basic = {
	getTabConfig () {
		return {
            title: 'Basic',
            showCmd : [ 'show ui-network-settings',
                        'show tacacs-servers',
                        'show external-captive-portal',
                        'show dpi app all',
                        'show dpi appcategory all',
                        'show dpi webcategory all',
                        'show dhcps config',
                        'show facebook',
                        'show bcast-filter-all',
                        'show time-range',
                        'show time-profile',
                        'show dpi-error-page-urls',
                        'show summary'],
            items: [{
                ref: 'name',
                label: 'Name'
            }, {
                ref: 'band',
                label: 'Band',
                type:'select',
                options:[
                    {text:'All',value:'all'},
                    {text:'2.4 GHz',value:'2.4'},
                    {text:'5 GHz',value:'5.0'}
                ]
            }, {
                ref: 'type',
                label: 'Type',
                type:'select',
                options:[
                    {text:'Employee',value:'employee'},
                    {text:'Guest',value:'guest'}
                ]
            }, {
                ref: 'hidessid',
                label: 'Hide SSID',
                type: 'checkbox'
            }],
            handler: function () {
                if ($(ReactDOM.findDOMNode(this.refs.name)).find('.input').val() !== '') {
                    $(ReactDOM.findDOMNode(this.refs.name)).find('.input').attr('disabled', 'disabled');
                }
            }
        };
	},
	parseData (data) {
        var originData={};
        $.each(data, (index, item)=> {
            if (index.indexOf('shownetwork') > -1) {
                $.each(item, (key, value) => {
                    if(key == 'name' || key =='band' || key =='type' || key=='hidessid'){
                        originData[key] = value;
                    }
                })
            }
        });
        return originData;
    },
    getCMD (changeData, originData) {
        var cmd = '';
        if (changeData) {
            // if (changeData['name'] !== this.originData['name']) {
            //     cmd += 'wlan ssid-profile ' + changeData['name'] + '\n';
            // }
            if (changeData['type']) {
                cmd += "type " + changeData['type'] + '\n';
            }
            if (changeData['band']) {
                cmd += "rf-band " + changeData['band'] + '\n';
            }
            if (changeData['hidessid']) {
                cmd += changeData['hidessid'] == 'Enable' ? 'hide-ssid\n' : 'no hide-ssid\n';
            }
        }

        return cmd;
    }
};

module.exports = {
	Basic : Basic
}