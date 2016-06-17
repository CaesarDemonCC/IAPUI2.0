
var Security = {
	getTabConfig () {
		return {
            title: 'Security',
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
                ref: 'mode',
                label: 'Key management',
                type:'select',
                options:[
                    {text:'WPA-2 Personal',value:'wpa2-psk-aes'},
                    {text:'WPA Personal (Both TKIP & AES Encryption)',value:'wpa-psk-tkip,wpa-psk-aes'},
                    {text:'WPA Personal (TKIP Encryption only)',value:'wpa-psk-tkip'},
                    {text:'WPA Personal (AES Encryption only)',value:'wpa-psk-aes'},
                    {text:'Both (WPA-2 & WPA)',value:'wpa2-psk-aes,wpa-psk-tkip'},
                    {text:'OPEN',value:'opensystem'}
                    // {text:'Static WEP',value:'static-wep'}
                ]
            }, {
                ref: 'passphrase',
                label: 'Passphrase:',
                type : 'password'
            }, {
                ref: 're-passphrase',
                label: 'Retype',
                type : 'password'
            }],
            handler: function () {
                if ($(ReactDOM.findDOMNode(this.refs.mode)).find('.input').val() == 'opensystem') {
                    $(ReactDOM.findDOMNode(this.refs.passphrase)).hide();
                    $(ReactDOM.findDOMNode(this.refs['re-passphrase'])).hide();
                } else {
                    $(ReactDOM.findDOMNode(this.refs.passphrase)).show();
                    $(ReactDOM.findDOMNode(this.refs['re-passphrase'])).show();
                }
            }
        };
	},
	parseData (data) {
        var originData = {};
        $.each(data, (index, item)=> {
            if (index.indexOf('shownetwork') > -1) {
                $.each(item, (key, value) => {
                    if(key == 'passphrase' || key =='mode'){
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
            if (changeData['mode']) {
                cmd += 'opmode ' + changeData['mode'] + '\n';
            }
            if (changeData['passphrase']) {
                cmd += "wpa-passphrase " + changeData['passphrase'] + '\n';
            }
        }
        return cmd;
    }
};

module.exports = {
	Security : Security
}