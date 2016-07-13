import {Wizard} from '../ui/widget/wizard'

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
        

        return cmd;
    }
};

const NetworkInitWizard = ReactRouter.withRouter(React.createClass({
	wizards : [Step1, Step2],

    getInitialState() {
        return {
            wizardsData: []
        };
    },
    componentDidMount() {
        var route = this.props.route;
        var router = this.props.router;
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
    onSubmit (e) {
        this.props.router.replace('/');
    },
	render () {
		return (
            <div className="network-init-wizard">
				<Wizard ref="network-init-wizard" wizardsData={this.state.wizardsData} {...this.getWizardsConfig()}/>
			</div>
        );
	}
}));

module.exports = {
	NetworkInitWizard : NetworkInitWizard
}