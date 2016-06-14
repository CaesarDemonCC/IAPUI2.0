import {Tab} from '../ui/widget/tab'
import {Ajax} from '../utils/ajax'
import {General} from '../tabs/general'
import {Admin} from '../tabs/admin'

var System = React.createClass({
	getTabsConfig () {
		

        return {
            title: 'System',
            tabsConfig: [General.getTabConfig(), Admin.getTabConfig()],
            onSubmit: () => {
		        console.log('Ok!')
		    },
		    onCancel: () => {
		        console.log('Cancel!');
		    },
            parseData: (data) => {
                var tabsData = [];
                
                var generalData = General.parseData(data);
                var adminData = Admin.parseData(data);
                tabsData.push(generalData);
                tabsData.push(adminData);
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