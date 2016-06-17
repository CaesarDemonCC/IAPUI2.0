
var Vlan = {
	getTabConfig () {
		return {
            title: 'VLAN',
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
                ref: 'ipassignment',
                label: 'Client IP assignment',
                name:'vlan',
                type:'radio',
                options:[{
                    label:'Virtual Controller managed',
                    id:'vlan-vc'
                },{
                    label:'Network assigned',
                    id:'vlan-net',
                }]
            }, {
                ref: 'vlanvcassignment',
                label: 'Client VLAN assignment',
                name:'vlanvc',
                type:'radio',
                options:[{
                    label:'Default',
                    id:'vlanvc-guest'
                }]
            }, {
                ref: 'vlannetassignment',
                label: 'Client VLAN assignment',
                name:'vlannet',
                type:'radio',
                options:[{
                    label:'Default',
                    id:'vlannet-no'
                },{
                    label:'Static',
                    id:'vlannet-id',
                }]
            }, {
                ref:'vlanid',
                label:'VLAN ID'
            }],
            handler: function () {
                if ($(ReactDOM.findDOMNode(this.refs.ipassignment)).find('.input').val() == 'vlan-vc'){
                    $(ReactDOM.findDOMNode(this.refs.vlanvcassignment)).show()
                    $(ReactDOM.findDOMNode(this.refs.vlannetassignment)).hide()
                    $(ReactDOM.findDOMNode(this.refs.vlanid)).hide()
                } else {
                    $(ReactDOM.findDOMNode(this.refs.vlanvcassignment)).hide()
                    $(ReactDOM.findDOMNode(this.refs.vlannetassignment)).show()
                    if($(ReactDOM.findDOMNode(this.refs.vlannetassignment)).find('.input').val() == 'vlannet-id') {
                        $(ReactDOM.findDOMNode(this.refs.vlanid)).show()
                    } else {
                        $(ReactDOM.findDOMNode(this.refs.vlanid)).hide()
                    }
                }
            }
        };
	},
	parseData (data) {
        var originData = {};
        $.each(data, (index, item)=> {
            if (index.indexOf('shownetwork') > -1) {
                $.each(item, (key, value) => {
                    if(key == 'vlan'){
                        originData[key] = value;
                    }
                })
            }
        });

        originData['vlanvcassignment'] = 'vlanvc-guest';
        originData['vlannetassignment'] = 'vlannet-no';
        if (originData['vlan'] =='guest') {
            originData['ipassignment'] = 'vlan-vc';
        } else {
            originData['ipassignment'] = 'vlan-net';
            if (originData['vlan'] != '') {
                originData['vlannetassignment'] = 'vlannet-id';
                originData['vlanid'] = originData['vlan'];
            }
        }
        return originData;
    },
    getCMD (changeData, originData) {
        var cmd = '';
        if (changeData) {
            // if (changeData['ipassignment'] != this.originData['ipassignment'] 
            //     || changeData['vlannetassignment'] != this.originData['vlannetassignment']) {
                if (changeData['ipassignment'] == "vlan-net" && changeData['vlannetassignment'] == "vlannet-no") {
                    cmd = "no vlan\n";
                } else if (changeData['ipassignment'] == "vlan-net" && changeData['vlannetassignment'] == "vlannet-id") {
                    cmd = "vlan " + changeData["vlanid"] + "\n";
                } else {
                    cmd = "vlan guest\n";
                }
            // }
        }
        return cmd;
    }
};

module.exports = {
	Vlan : Vlan
}