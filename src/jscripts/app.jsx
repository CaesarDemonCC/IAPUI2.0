import {SideNav} from './ui/widget/sideNav'
import {LoginDialog, Logout} from './factory/loginDialog'
import {isLoggedIn} from './utils/auth'
import {About} from './factory/about'
import {Reboot} from './factory/reboot'
import {Networks} from './factory/networks'
import {System} from './factory/system'
import {Users} from './factory/users'
import {Overview} from './factory/overview'
import {NetworksEdit} from './factory/networksedit'
import {Firmware} from './factory/firmware'

import EventSystem from './utils/eventSystem'

var navConfig = [{
    'name': 'Monitoring',
    //'path': '/',
    'children': [{
        'name': 'Overview',
        'path': '/'
    }/*, {
        'name': 'Networks',
        'path': '/networks'
    }, {
        'name': 'Access Points',
        'path': '/aps'
    }, {
        'name': 'Clients',
        'path': '/clients'
    }*/]
}, {
    'name': 'Configuration',
    'children': [{
        'name': 'System',
        'path': '/system'
    },{
        'name': 'Networks',
        'path': '/network-config'
    }, {
        'name': 'Users',
        'path': '/users'
    }/*, {
        'name': 'RF',
        'path': '/rf'
    }*/]
}, {
    'name': 'Maintenance',
    'children': [{
        'name': 'About',
        'path': '/about'
    }, {
        'name': 'Firmware',
        'path': '/firmware'
    }/*, {
        'name': 'Configuration',
        'path': '/config'
    }*/, {
        'name': 'Reboot',
        'path': '/reboot'
    }]
}];


var App = React.createClass({
    getInitialState() {
        var self = this;

        EventSystem.subscribe('UserLoggedIn', function (loggedIn) {
            self.setState({
                isLoggedIn: loggedIn
            });
        })

        EventSystem.subscribe('RouteUpdated', function (path) {
            self.setState({
                currentLocation: path
            });
        })

        return {
            isLoggedIn: isLoggedIn(),
            currentLocation: '/'
        };
    },
    render () {
        var Header = React.createClass({
            render: function () {
                if (!this.props.show) {
                    return null;
                }
                return (
                    <div className='header'>
                        <div className='logo small-3 columns' />
                        <div className='bannermenu small-9 columns'>
                            <div className='user menu'>
                                <div className='icon_avatar'></div>
                                <div className='icon_arrow_down'></div>
                            </div>
                            <div className='bannel_divider'></div>
                            <div className='menu'>
                                <a className='fa-cog fa-fw' href='#/system'><span>Settings</span></a>
                            </div>
                            <div className='menu'>
                                <a className='fa-wrench fa-fw' href='#/about'><span>Maintenance</span></a>
                            </div>
                            <div className='menu'>
                                <a className='fa-bar-chart fa-fw' href='#/'><span>Monitoring</span></a>
                            </div>
                            <div className='menu current'>
                                <a className='fa-home fa-fw' href='#/'><span>Home</span></a>
                            </div>
                        </div>
                    </div>
                )
            }
        });

        //TODO: Use one method to generate the same dom for footer and header menu
        var Footer = React.createClass({
            render: function () {
                return (<div className='footer'>
                    <a href='#/' className='menu current fa-home'></a>
                    <a href='#/' className='menu fa-bar-chart'></a>
                    <a href='#/about' className='menu fa-wrench'></a>
                    <a href='#/system' className='menu fa-cog'></a>
                </div>);
            }
        })

        return (
            <div className='app'>
                <Header show={this.state.isLoggedIn? true: false} />
                <div className='wrapper'>
                    {/*<div classNav='nav'>
                        <SideNav data={navConfig} show={this.state.isLoggedIn? true: false} currentLocation={this.props.location.pathname} />
                    </div>*/}
                    <div id='container' className='container'>
                        {this.props.children}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
});

var requireAuth = function (nextState, replace) {
    if (nextState.location.pathname !== '/login' && !isLoggedIn()) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

var redirectToHomePage = function (nextState, replace) {
    replace({
        pathname: '/'
    })
}

var routes = {
    path: '/',
    component: App,
    onEnter: requireAuth,
    indexRoute: { component: Overview },
    childRoutes: [{
        path: 'login',
        component: LoginDialog
    }, {
        path: 'logout',
        component: Logout
    }, {
        path: 'about',
        component: About
    }, {
        path: 'reboot',
        component: Reboot
    }, {
        path: 'network-config',
        component: Networks
    }, {
        path: 'network-edit/:networkid',
        component: NetworksEdit
    }, {
        path: 'system',
        component: System
    }, {
        path: 'users',
        component: Users
    }, {
        path: 'firmware',
        component: Firmware
    }/*, {
        path: 'clients',
        component: Clients
    }*/, {
        path: '*',
        onEnter: redirectToHomePage
    }]
};

//TODO: Use a more graceful way to replace this!
function addOnEnterIntoChildRoutes (routes, listener) {
    var childRoutes = routes.childRoutes;
    if (childRoutes && childRoutes.length) {
        childRoutes.forEach(function (item) {
            if (!item.onEnter) {
                item.onEnter = listener;    
            }
        });
    }
}
addOnEnterIntoChildRoutes(routes, requireAuth);

var onUpdate = function () {
    EventSystem.publish('RouteUpdated', this.state.location.pathname)
}

var Router = ReactRouter.Router;
ReactDOM.render(<Router routes={routes} onUpdate={onUpdate} />, document.body);
