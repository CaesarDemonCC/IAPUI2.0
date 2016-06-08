import {Tab} from './ui/widget/tab'
import {SideNav} from './ui/widget/sideNav'
import {Wizard} from './ui/widget/wizard'
import {LoginDialog} from './factory/loginDialog'
import {Table} from './ui/widget/table'
import {Ajax} from './utils/ajax'
import {isLoggedIn, getUser} from './utils/auth'

var generalPanel = {
    title: 'General',
    items: [{
        id: 'input-1',
        label: 'Name'
    }, {
        label: 'System Location'
    }, {
        id: 'input-3',
        label: 'VC IP'
    }, {
        id: 'dynamic-proxy',
        type: 'checkbox',
        label: 'Dynamic Proxy'
    }, {
        label: 'MAS Integration',
        type: 'select',
        options: [{
            text: 'Enabled',
            value: 'enable'
        }, {
            text: 'Disabled',
            value: 'disable'
        }]
    }],
    handler: function () {
        document.getElementById('dynamic-proxy').onchange = function () {
            alert(this.checked);
        }
    }
}

var adminPanel = {
    title: 'Admin',
    items: [{
        label: 'Test'
    }],
    handler: function () {
        alert('adminPanel');
    }
}


var systemTabs = {
    title: 'System',
    tabsConfig: [generalPanel, adminPanel]
}

var TabFactory = React.createFactory(Tab);

// ReactDOM.render(
//     TabFactory(systemTabs),
//     document.getElementById('container')
// );

var basic = {
    title: 'Basic',
    items: [{
        label: 'Name'
    }]
}

var vlan = {
    title: 'VLAN',
    items: [{
        label: 'VLAN assignment'
    }]
}

var security = {
    title: 'Security',
    items: [{
        label: 'Passphase'
    }]
}

var networkWizardConfig = {
    title: 'Create new network',
    wizardsConfig: [basic, vlan, security]
}


var navConfig = [{
    'name': 'Monitoring',
    //'path': '/',
    'children': [{
        'name': 'Overview',
        'path': '#/'
    }, {
        'name': 'Networks',
        'path': '#/',
        'selected': true
    }]
}, {
    'name': 'Configuration',
    'children': [{
        'name': 'Networks',
        //'path': '#/',
        'children': [{
            'name': 'Wireless',
            'path': '#/'
        }, {
            'name': 'Wired',
            'path': '#/'
        }]
    }, {
        'name': 'Uplink',
        'path': '#/'
    }]
}, {
    'name': 'Maintenance',
    'children': [{
        'name': 'About',
        'path': '#/'
    }, {
        'name': 'Configuration',
        'path': '#/'
    }, {
        'name': 'Reboot',
        'path': '#/'
    }]
}];


var App = React.createClass({
    getInitialState() {
        return {
            displayLoginDialog: !isLoggedIn()
        };
    },
    setssidProps (ssidProps){
        this.setState({
            ssidProps: ssidProps
        });
    },
    showSummary() {
        var cmdList = [
            'show stats global',
            'show summary'
        ];
        Ajax.get({
            'opcode':'show',
            'cmd': cmdList.join('\n'),
            'ip' : '127.0.0.1',
            'sid' : getUser().sid
        }, function(data){
            var ssidProps = {
                columns : [{
                    name: 'Name',
                    dataIndex: 'name'
                }, {
                    name: 'Clients',
                    dataIndex: 'clients'
                }, {
                    name: 'Action',
                    dataIndex: 'action',
                    render: (text, record) => {
                        let onEditClick = (e) => {
                            console.log(record);
                            e.stopPropagation();
                        }
                        let onDeleteClick = (e) => {
                            console.log(record);
                            e.stopPropagation();
                        }
                        return (
                            <div>
                            <a className="icosolo icon_edit" onClick={onEditClick}></a>
                            <a className="icosolo icon_delete delete" onClick={onDeleteClick}></a>
                            </div>
                        );
                    }
                }],
                dataSource: [],
                rowKey: 'name',
                sortable: true,
                title: 'Networks'
            };
            $.each(data.showsummary, (key, value) => {
                if(key.indexOf('Networks') > 0) {
                    value.forEach((network, index) =>{
                        ssidProps.dataSource.push({
                            'name' : network.essid,
                            'clients' : network.clients
                        });
                    });
                }
            });
            this.setState({
                displayLoginDialog : !isLoggedIn(),
                ssidProps: ssidProps
            });
        }.bind(this));
    },
    componentDidUpdate(prevProps) {
        console.log(prevProps);
    },
    render () {
        var element;
        if (this.state.displayLoginDialog){
            element = (<LoginDialog hideAfterLogIn={true} cb={this.showSummary}/>);
        } else {
            //element = (<Wizard {...networkWizardConfig} />);   
            element = (<Table  {...this.state.ssidProps} />); 
            ReactDOM.render(
                <SideNav data={navConfig}/>,
                document.getElementById('sideNav')
            )
        }
        return (
            <div>
                {element}
            </div>
        );
    }
});

// ReactDOM.render(
//     <App />,
//     document.getElementById('container')
// )

var ssidProps = {
    columns : [{
        name: 'Name',
        dataIndex: 'name'
    }, {
        name: 'Clients',
        dataIndex: 'clients'
    }, {
        name: 'Action',
        dataIndex: 'action',
        render: (text, record) => {
            let onEditClick = (e) => {
                console.log(record);
                e.stopPropagation();
            }
            let onDeleteClick = (e) => {
                console.log(record);
                e.stopPropagation();
            }
            return (
                <div>
                <a className="icosolo icon_edit" onClick={onEditClick}></a>
                <a className="icosolo icon_delete delete" onClick={onDeleteClick}></a>
                </div>
            );
        }
    }],
    dataSource: [{
        name: 'test-ssid',
        clients: '3'
    }, {
        name: 'test-ssid-psk',
        clients: '2'
    }],
    rowKey: 'name',
    sortable: true,
    title: 'Networks'
};

 ReactDOM.render(
    <Table  {...ssidProps} />,
    document.getElementById('container')
)