import {SideNav} from './ui/widget/sideNav'
import {LoginDialog, Logout} from './factory/loginDialog'
import {isLoggedIn} from './utils/auth'
import {About} from './factory/about'
import {Reboot} from './factory/reboot'
import {Networks} from './factory/networks'
import {System} from './factory/system'
import {User} from './factory/user'
import {Overview} from './factory/overview'

var navConfig = [{
    'name': 'Monitoring',
    //'path': '/',
    'children': [{
        'name': 'Overview',
        'path': '/'
    }, {
        'name': 'Networks',
        'path': '/networks'
    }, {
        'name': 'Access Points',
        'path': '/aps'
    }, {
        'name': 'Clients',
        'path': '/clients'
    }]
}, {
    'name': 'Configuration',
    'children': [{
        'name': 'System',
        'path': '/system'
    },{
        'name': 'Networks',
        'path': '/network-config'
    }, {
        'name': 'User',
        'path': '/user'
    }, {
        'name': 'RF',
        'path': '/rf'
    }]
}, {
    'name': 'Maintenance',
    'children': [{
        'name': 'About',
        'path': '/about'
    }, {
        'name': 'Configuration',
        'path': '/config'
    }, {
        'name': 'Reboot',
        'path': '/reboot'
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
                        <SideNav data={navConfig} currentLocation={this.props.location.pathname} />
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
        pathname: '/'
    })
}

var Clients = React.createClass({
    componentDidMount: function () {
        var config = {
            xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          },
          series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 454.4]
          }]
        };

        var chart = new Highcharts['Chart']({
            ...config,
            chart: {
                renderTo: this.refs.chart
            }
        })
    },
    render: function () {
        return <div ref='chart' />
    }
})

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
        path: 'user',
        component: User
    }, {
        path: 'clients',
        component: Clients
    }, {
        path: '*',
        onEnter: redirectToHomePage
    }]
};

//TODO: Use a more graceful way to replace this!
function addOnEnterIntoChildRoutes (routes, listener) {
    var childRoutes = routes.childRoutes;
    if (childRoutes && childRoutes.length) {
        childRoutes.forEach(function (item) {
            item.onEnter = listener;
        });
    }
}
addOnEnterIntoChildRoutes(routes, requireAuth);

var Router = ReactRouter.Router;
ReactDOM.render(<Router routes={routes} />, document.body);
