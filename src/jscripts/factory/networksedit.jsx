import {Ajax} from '../utils/ajax'
import {Wizard} from '../ui/widget/wizard'
import {Basic} from '../tabs/basic'
import {Vlan} from '../tabs/vlan'
import {Security} from '../tabs/security'
import {ComfirmDialog} from '../ui/widget/comfirmdialog'

var NetworksEdit = ReactRouter.withRouter(React.createClass({
	wizards : [Basic, Vlan, Security],
    originData : [],
	getInitialState() {
        return {
            wizardsData: [],
            isDirty: false
        };
    },
	componentDidMount() {
        var route = this.props.route;
        var router = this.props.router;
        //router.setRouteLeaveHook(route, this.routerWillLeave);
    },
    routerWillLeave (nextPath) {
        if (this.getCMD() !== '') {
            var networkWizard = this.refs.networkWizard;
            networkWizard.goToStep(networkWizard.state.currentStep);
            this.nextLocation = nextPath;
            this.setState({
                wizardsData:networkWizard.props.wizardsData,
                isDirty: true 
            });
            return false;
        }
    },
    getWizardsConfig () {
    	var wizardsConfig = [];

        this.wizards.forEach( (item, index)=> {
            if (typeof item.getTabConfig === 'function') {
                wizardsConfig.push(item.getTabConfig());
            }
        });

        if (this.props.routeParams.networkid && this.props.routeParams.networkid !== ' ' 
            && wizardsConfig.length > 0) {
            wizardsConfig[0].showCmd.push('show network ' + this.props.routeParams.networkid);
        }

        if(this.handler) {
            //wizardsConfig[0].item[0].handler = this.handler;

            // vlan handler;
            wizardsConfig[1].items[0].handler = this.handler;
            wizardsConfig[1].items[2].handler = this.handler;

            //security handler;
            wizardsConfig[2].items[0].handler = this.handler;
        }

        return {
            title: 'Create new network',
            wizardsConfig: wizardsConfig,
            onSubmit: this.onSubmit,
		    onCancel: this.onCancel,
            parseData: this.parseData
        };
	},
    handler () {
        var panelContent = this.refs.networkWizard.refs.panelContent;
        if(panelContent){
            panelContent.props.handler.call(panelContent);
        }
    },
	parseData (data) {
		var wizardsData = [];

        if(this.props.routeParams.networkid && this.props.routeParams.networkid === ' ') {
            data = {
                'shownetwork' : {
                    'hidessid' : 'Disabled',
                    'band' : 'all',
                    'type' : 'employee',
                    'vlan' : '',
                    'passphrase' : '',
                    'mode' : 'wpa2-psk-aes'
                }
            }
        }
        this.wizards.forEach( (item, index)=> {
            if (typeof item.parseData === 'function') {
                wizardsData.push(item.parseData(data));
            }
        });
        this.originData = wizardsData;
        this.setState({ 'wizardsData': wizardsData });
	},
	getCMD () {
        var networkWizard = this.refs.networkWizard;
        var cmd = '';
        if (networkWizard) {
            networkWizard.goToStep(networkWizard.state.currentStep);
            this.wizards.forEach( (item, index)=> {
                if (typeof item.getCMD === 'function') {
                    cmd += item.getCMD(networkWizard.props.wizardsData[index],this.originData[index]);
                }
            });
        }
        
        if (cmd != '') {
            var name = networkWizard.props.wizardsData[0]['name'];
            cmd = 'wlan ssid-profile ' + name + '\n' + cmd + ' set-role-unrestricted\n';
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
                this.props.router.replace('/network-config');
            });
        }
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
		return (<div style={{'height':'100%'}}>
				<Wizard ref='networkWizard' wizardsData={this.state.wizardsData}
				{...this.getWizardsConfig()}
				/>
				{comfirmDialog}
			</div>);
	}
}));

module.exports = {
	NetworksEdit : NetworksEdit
}