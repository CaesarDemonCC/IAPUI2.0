import {Tab} from '../ui/widget/tab'
import {Ajax} from '../utils/ajax'
import {ComfirmDialog} from '../ui/widget/comfirmdialog'
import {General} from '../tabs/general'
import {Admin} from '../tabs/admin'

var System = ReactRouter.withRouter(React.createClass({
    tabs: [General, Admin],
    componentDidMount() {
        var route = this.props.route;
        var router = this.props.router;
        router.setRouteLeaveHook(route, this.routerWillLeave);
    },
    routerWillLeave (nextPath) {
        if (this.getCMD() !== '') {
            var systemTab = this.refs.systemTab;
            systemTab.goToTab(systemTab.state.currentTab);
            this.nextLocation = nextPath;
            this.setState({
                tabsData:systemTab.props.tabsData,
                isDirty: true 
            });
            return false;
        }
    },
	getTabsConfig () {
        var tabsConfig = [];
        this.tabs.forEach( (item, index)=> {
            if (typeof item.getTabConfig === 'function') {
                tabsConfig.push(item.getTabConfig());
            }
        });

        return {
            title: 'System',
            tabsConfig: [General.getTabConfig(), Admin.getTabConfig()],
            onSubmit: this.onSubmit,
		    onCancel: this.onCancel,
            parseData: this.parseData
        };
	},

    getCMD () {
        var systemTab = this.refs.systemTab;
        var cmd = '';
        if (systemTab) {
            systemTab.goToTab(systemTab.state.currentTab);
            this.tabs.forEach( (item, index)=> {
                if (typeof item.getCMD === 'function') {
                    cmd += item.getCMD(systemTab.props.tabsData[index]);
                }
            });
        }
        return cmd;
    },
    onSubmit (e) {
        var cmd = this.getCMD();
        if(cmd){
            Ajax.post({
                'opcode':'config',
                'cmd': cmd
            },(result)=>{
                //alert('good');
                //this.setState({isDirty: false})
                this.props.router.go(this.props.location);
            });
        }
    },

    onCancel (e) {
        console.log('onCancel')
    },
    parseData (data) {
        var tabsData = [];

        this.tabs.forEach( (item, index)=> {
            if (typeof item.parseData === 'function') {
                tabsData.push(item.parseData(data));
            }
        });

        this.setState({ 'tabsData': tabsData });
    },
	getInitialState() {
        return {
            tabsData: [],
            isDirty: false
        };
    },
    comfrimCancel () {
        this.props.router.goBack();
        this.setState({isDirty:false});
    },
    comfrimSubmit () {
        this.props.router.go(this.nextLocation);
    },
    render () {
        var comfirmDialog;
        if (this.state.isDirty) {
            comfirmDialog = (<div>
                <ComfirmDialog message='Are you sure to leave since config is changed?'
                onCancel={this.comfrimCancel} onSubmit={this.comfrimSubmit} 
                />
            </div>)
        }
        return (<div className="panel no_border form_panel">
            <h2 className='title_heading form_heading'>System</h2>
            <Tab {...this.getTabsConfig()} tabsData={this.state.tabsData} ref='systemTab'/>
            {comfirmDialog}
        </div>)
    }
}));

module.exports = {
	System : System
}