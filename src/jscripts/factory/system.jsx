import {Tab} from '../ui/widget/tab'
import {Ajax} from '../utils/ajax'
import {getUser} from '../utils/auth'

var System = React.createClass({
	getTabsConfig () {
		var generalPanel = {
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

        var adminPanel = {
            title: 'Admin',
            showCmd : 'show mgmt-user',
            items: [{
                ref: 'name',
                label: 'Username'
            }, {
                ref: 'password',
                label: 'Password',
                type : 'password'
            }, {
                ref: 're-password',
                label: 'Retype',
                type : 'password'
            }],
            handler: function () {

            }
        };
        return {
            title: 'System',
            tabsConfig: [generalPanel, adminPanel],
            onSubmit: () => {
		        console.log('Ok!')
		    },
		    onCancel: () => {
		        console.log('Cancel!');
		    },
            parseData: (data) => {
                var tabsData = [], generalData = {}, adminData = {};
                if (data.showsummary) {
                    $.each(data.showsummary, (key,value) => {
                        if (key == 'name' || key == 'vcipaddress' || key == 'ntpserver') {
                            generalData[key] = value;
                        }
                    })
                    tabsData.push(generalData);
                }
                if (data['showmgmt-user']['ManagementUserTable']) {
                    $.each(data['showmgmt-user']['ManagementUserTable'], (index, item) => {
                        if (item.type === 'Admin') {
                            adminData = item;
                        }
                    });
                    tabsData.push(adminData);
                }
                this.setState({'tabsData' : tabsData});
            }
        };
	},
	getInitialState() {
        return {
        	tabsData : []
    	};
    },
    render () {
        return (<div>
            <Tab {...this.getTabsConfig()} tabsData={this.state.tabsData}/>
        </div>)
    }
})

module.exports = {
	System : System
}