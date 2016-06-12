
import {SideNav} from './ui/widget/sideNav'
import {LoginDialog} from './factory/loginDialog'
import {isLoggedIn, getUser} from './utils/auth'

var navConfig = [{
    'name': 'Monitoring',
    //'path': '/',
    'children': [{
        'name': 'Overview',
        'path': '#/overview'
    }, {
        'name': 'Networks',
        'path': '#/networks-monitoring'
    }]
}, {
    'name': 'Configuration',
    'children': [{
        'name': 'Networks',
        //'path': '#/',
        'children': [{
            'name': 'Wireless',
            'path': '#/networks-config'
        }, {
            'name': 'Wired',
            'path': '#/wired'
        }]
    }, {
        'name': 'Uplink',
        'path': '#/uplink'
    }]
}, {
    'name': 'Maintenance',
    'children': [{
        'name': 'About',
        'path': '#/about'
    }, {
        'name': 'Configuration',
        'path': '#/config'
    }, {
        'name': 'Reboot',
        'path': '#/reboot'
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
    /*showSummary() {
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
    },*/
    componentDidUpdate(prevProps) {
        console.log(prevProps);
    },
    render () {
        var element;
        if (this.state.displayLoginDialog){
            element = (<LoginDialog hideAfterLogIn={true}/>);
        } else {
            ReactDOM.render(
                <SideNav data={navConfig}/>,
                document.getElementById('sideNav')
            )
        }
        return (
            <div>
                {element}
                {this.props.children}
            </div>
        );
    }
});

const routes = {
    path: '/',
    component: App,
    indexRoute: { component: App },
    childRoutes: [/*{
        path: 'overview',
        component: Overview
    }*/]
};

var Router = ReactRouter.Router;
ReactDOM.render(<Router routes={routes} />, document.getElementById('container'));
