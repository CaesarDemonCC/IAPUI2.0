import {SideNav} from './ui/widget/sideNav'
import {LoginDialog, Logout} from './factory/loginDialog'
import {isLoggedIn} from './utils/auth'
import {About} from './factory/about'
import {Reboot} from './factory/reboot'
import {Networks} from './factory/networks'
import {System} from './factory/system'
import {Users} from './factory/users'
import {Overview} from './factory/overview'

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

        return {
            isLoggedIn: false
        };
    },
    setssidProps (ssidProps){
        this.setState({
            ssidProps: ssidProps
        });
    },
    render () {
        var Header = React.createClass({
            render: function () {
                if (!this.props.show) {
                    return null;
                }
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
            <div className='app'>
                <Header show={this.state.isLoggedIn? true: false} />
                <div className='wrapper'>
                    <div classNav='nav'>
                        <SideNav data={navConfig} show={this.state.isLoggedIn? true: false} currentLocation={this.props.location.pathname} />
                    </div>
                    <div id='container' className='container'>
                        {this.props.children}
                    </div>
                </div>
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
        path: 'system',
        component: System
    }, {
        path: 'users',
        component: Users
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

window.App = App;

var onUpdate = function () {
    console.log('onUpdate');
    console.log(arguments);
}

var Router = ReactRouter.Router;
ReactDOM.render(<Router routes={routes} onUpdate={onUpdate} />, document.body);
