import {Wizard} from '../ui/widget/wizard'
import {Ajax} from '../utils/ajax'
import {buttonMixin} from '../utils/mixin'
import {Dialog} from '../ui/widget/dialog'
import EventSystem from '../utils/eventSystem'

const Step1 = {
    getTabConfig () {
        return {
            title: 'UPLINK',
            showCmd : ['show summary'],
            items: [{
                ref: 'uplink-type',
                label: 'Uplink Type',
                type:'select',
                options:[
                    {text:'PPPoE', value:'pppoe'},
                    {text:'Static', value:'static'},
                    {text:'WIFI', value: 'wifi'}
                ]
            }, {
                ref: 'pppoe-name',
                label: 'Username'
            }, {
                ref: 'pppoe-password',
                label: 'Password',
                type : 'password'
            }, {
                ref: 'static-ip',
                label: 'IP address'
            }, {
                ref: 'static-mask',
                label: 'Netmask'
            }, {
                ref: 'static-gateway',
                label: 'Gateway'
            }, {
                ref: 'wifi-name',
                label: 'SSID'
            }, {
                ref: 'wifi-passphrase',
                label: 'Passphrase',
                type : 'password'
            }],
            handler: function () {
                let uplinkType = $(ReactDOM.findDOMNode(this.refs['uplink-type'])).find('.input').val();
                if (uplinkType == 'wifi'){
                    $(ReactDOM.findDOMNode(this.refs['wifi-name'])).show();
                    $(ReactDOM.findDOMNode(this.refs['wifi-passphrase'])).show();
                    $(ReactDOM.findDOMNode(this.refs['pppoe-name'])).hide();
                    $(ReactDOM.findDOMNode(this.refs['pppoe-password'])).hide();
                    $(ReactDOM.findDOMNode(this.refs['static-ip'])).hide();
                    $(ReactDOM.findDOMNode(this.refs['static-mask'])).hide();
                    $(ReactDOM.findDOMNode(this.refs['static-gateway'])).hide();
                } else if (uplinkType == 'static') {
                    $(ReactDOM.findDOMNode(this.refs['wifi-name'])).hide();
                    $(ReactDOM.findDOMNode(this.refs['wifi-passphrase'])).hide();
                    $(ReactDOM.findDOMNode(this.refs['pppoe-name'])).hide();
                    $(ReactDOM.findDOMNode(this.refs['pppoe-password'])).hide();
                    $(ReactDOM.findDOMNode(this.refs['static-ip'])).show();
                    $(ReactDOM.findDOMNode(this.refs['static-mask'])).show();
                    $(ReactDOM.findDOMNode(this.refs['static-gateway'])).show();
                } else {
                    $(ReactDOM.findDOMNode(this.refs['wifi-name'])).hide();
                    $(ReactDOM.findDOMNode(this.refs['wifi-passphrase'])).hide();
                    $(ReactDOM.findDOMNode(this.refs['pppoe-name'])).show();
                    $(ReactDOM.findDOMNode(this.refs['pppoe-password'])).show();
                    $(ReactDOM.findDOMNode(this.refs['static-ip'])).hide();
                    $(ReactDOM.findDOMNode(this.refs['static-mask'])).hide();
                    $(ReactDOM.findDOMNode(this.refs['static-gateway'])).hide();
                }
            }
        };
    },
    parseData (data) {
        let originData = {};
        
        return originData;
    },
    getCMD (changeData, originData) {
        let cmd = '';
        if (changeData) {
            if (changeData['uplink-type'] == 'pppoe') {
                // pppoe
                cmd += 'pppoe-uplink-profile\n';
                cmd += 'pppoe-username ' + changeData['pppoe-name'] + '\n';
                cmd += 'pppoe-passwd ' + changeData['pppoe-password'] + '\n';
                cmd += 'exit\n';
            } else if (changeData['uplink-type'] == 'wifi') {
                 cmd += 'wlan sta-profile\n';
                 cmd += 'essid ' + changeData['wifi-name'] + '\n';
                 cmd += 'cipher-suite wpa2-ccmp-psk\n';
                 cmd += 'wpa-passphrase ' + changeData['wifi-passphrase'] + '\n';
                 cmd += 'uplink-band dot11a\n';
                 cmd += 'exit\n';
            }
        }

        return cmd;
    }
};

const Step2 = {
    getTabConfig () {
        return {
            title: 'SSID',
            showCmd : ['show summary'],
            items: [{
                ref: 'name',
                label: 'SSID'
            }, {
                ref: 'passphrase',
                label: 'Passphrase',
                type : 'password'
            }],
            handler: function () {
                
            }
        };
    },
    parseData (data) {
        let originData = {};
        
        return originData;
    },
    getCMD (changeData, originData) {
        let cmd = '';
        let defaultCmd = 'type employee\nopmode wpa2-psk-aes\nrf-band all\n';
        cmd += 'wlan ssid-profile ' + changeData['name']  + '\n' + 
                "wpa-passphrase " + changeData['passphrase'] + '\n' + 
                defaultCmd + 
                'set-role-unrestricted\n' + 
                'exit\n';

        return cmd;
    }
};

const FinishDialog = React.createClass({
    mixins: [buttonMixin],
    getInitialState() {
        return {
            loading: true
        };
    },
    getItems () {
        let loading = '';
        let content = '';
        if (this.state.loading) {
            loading = (<div><p className="network-init-loading">
                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                        <span className="sr-only">Loading...</span>
                        </p>
                        <p>Initializing...</p>
                        </div>);
        }
        if (!this.state.loading) {
            /*<div className="controls">
                        <button className="medium button medium-6" onClick={this.submitHandler}>OK</button>
                    </div>*/
            content = (<div>
                    <p className="network-init-message">{this.props.message}</p>
                    
                    </div>);
        }
        return [{
                type: 'template',
                template:(<div className="network-init-success-content">
                    {loading}
                    {content}
                </div>)
            }];
    },

    hideLoading () {
        this.setState({loading: false});
        setTimeout(this.autoRedirect, 2000);
    },
    autoRedirect () {
        // auto redirect to home page
        if (this.isMounted()) {
            this.submitHandler();
        }
    },
    componentDidMount() {
        let self = this;
        if (this.state.loading) {
            setTimeout(this.hideLoading, 3000);
        } 
    },
    render () {
        var items = this.getItems();
        
        return (<div className="network-init-finished-dialog">
                <Dialog className='message confirmation'
                items={items}
                footer={<div/>}
                />
            </div>)
    }
});

const NetworkInitWizard = ReactRouter.withRouter(React.createClass({
	wizards : [Step1, Step2],
    originData: {},
    getInitialState() {
        return {
            finished: false,
            wizardsData: []
        };
    },
    componentWillMount() {
        EventSystem.publish('AppInitializing', false);
    },
    getWizardsConfig () {
        var wizardsConfig = [];

        this.wizards.forEach((item, index) => {
            if ($.isFunction(item.getTabConfig)) {
                wizardsConfig.push(item.getTabConfig());
            }
        });

        // todo
        wizardsConfig[0].items[0].handler = this.handler;

        return {
            title: 'Initializing Network',
            wizardsConfig: wizardsConfig,
            onSubmit: this.onSubmit,
            onCancel: this.onCancel
        };
    },
    handler () {
        var panelContent = this.refs['network-init-wizard'].refs.panelContent;
        if(panelContent){
            panelContent.props.handler.call(panelContent);
        }
    },
    getCMD () {
        var networkWizard = this.refs['network-init-wizard'];
        var cmd = '';
        if (networkWizard) {
            networkWizard.goToStep(networkWizard.state.currentStep);
            this.wizards.forEach( (item, index)=> {
                if (typeof item.getCMD === 'function') {
                    cmd += item.getCMD(networkWizard.props.wizardsData[index],this.originData[index]);
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
                this.setState({finished: true});
                //this.props.router.replace('/');
            });
        }
    },
    comfrimSubmit () {
        EventSystem.publish('AppInitializing', true);
        this.props.router.replace('/');
    },
	render () {
        let finishedDialog = null;
        if (this.state.finished) {
            let msg = 'Network initialization successfully completed!';
            finishedDialog = (<div><FinishDialog message={msg} onSubmit={this.comfrimSubmit}/></div>);
        }

		return (
            <div className="network-init-wizard">
				<Wizard ref="network-init-wizard" wizardsData={this.state.wizardsData} {...this.getWizardsConfig()}/>
                {finishedDialog}
			</div>
        );
	}
}));

module.exports = {
	NetworkInitWizard : NetworkInitWizard
}