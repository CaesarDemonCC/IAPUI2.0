
import {SideNav} from './ui/widget/sideNav'
import {LoginDialog, Logout} from './factory/loginDialog'
import {isLoggedIn} from './utils/auth'

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
    render () {
        var Header = React.createClass({
            render: function () {
                return (
                    <div className='header'>
                        <div className='logo small-5 columns' />
                        <div className='bannermenu small-7 columns'>
                            <div className='logout'>
                                <a href='#/logout'>Logout</a>
                            </div>
                            <div className='icon_help' />
                            <span className='search'>
                                <label className='icon_search' />
                                <input type='search' id='searchInput' />
                            </span>
                        </div>
                    </div>
                )
            }
        });

        return (
            <div>
                <Header />
                <div>
                    <div id='sideNav' className='medium-3 large-2 columns'>
                        <SideNav data={navConfig} />
                    </div>
                    <div id='container' className='medium-9 large-10 columns'>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});

var requireAuth = function (nextState, replace) {
    console.log(nextState);
    if (nextState.location.pathname !== '/login' && !isLoggedIn()) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

var redirectToHomePage = function (nextState, replace) {
    replace({
        pathname: '/home'
    })
}

var Home = React.createClass({
    render: function () {
        return <div>Home</div>;
    }
})

var Overview = React.createClass({
    render: function () {
        return <div>Overview</div>;
    }
})

const routes = {
    path: '/',
    component: App,
    onEnter: requireAuth,
    indexRoute: { component: Home },
    childRoutes: [{
        path: 'overview',
        component: Overview
    }, {
        path: 'login',
        component: LoginDialog
    }, {
        path: 'logout',
        component: Logout
    }, {
        path: '*',
        onEnter: redirectToHomePage
    }]
};

var Router = ReactRouter.Router;
ReactDOM.render(<Router routes={routes} />, document.body);
