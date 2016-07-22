import {SideNav} from './ui/widget/sideNav'
import {LoginDialog, Logout} from './factory/loginDialog'
import {getUser, isLoggedIn} from './utils/auth'
import {About} from './factory/about'
import {Reboot} from './factory/reboot'
import {Networks} from './factory/networks'
import {System} from './factory/system'
import {Users} from './factory/users'
import {Overview} from './factory/overview'
import {NetworksEdit} from './factory/networksedit'
import {Firmware} from './factory/firmware'
import {NetworksOverview} from './factory/networksOverview'
import {NetworkInitWizard} from './factory/networkInitWizard'

import EventSystem from './utils/eventSystem'

// var navConfig = [{
//     'name': 'Monitoring',
//     //'path': '/',
//     'children': [{
//         'name': 'Overview',
//         'path': '/'
//     }/*, {
//         'name': 'Networks',
//         'path': '/networks'
//     }, {
//         'name': 'Access Points',
//         'path': '/aps'
//     }, {
//         'name': 'Clients',
//         'path': '/clients'
//     }*/]
// }, {
//     'name': 'Configuration',
//     'children': [{
//         'name': 'System',
//         'path': '/system'
//     },{
//         'name': 'Networks',
//         'path': '/network-config'
//     }, {
//         'name': 'Users',
//         'path': '/users'
//     }/*, {
//         'name': 'RF',
//         'path': '/rf'
//     }*/]
// }, {
//     'name': 'Maintenance',
//     'children': [{
//         'name': 'About',
//         'path': '/about'
//     }, {
//         'name': 'Firmware',
//         'path': '/firmware'
//     }/*, {
//         'name': 'Configuration',
//         'path': '/config'
//     }*/, {
//         'name': 'Reboot',
//         'path': '/reboot'
//     }]
// }];

const navConfigMap = {
    'monitoring': {
        'name': 'Monitoring',
        'children': [{
            'name': 'Networks',
            'path': '/networks'
        },{
            'name': 'Acess Points',
            'path': '/aps'
        }]
    },
    'settings' : {
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
        }]
    },
    'maintenance': {
        'name': 'Maintenance',
        'children': [{
            'name': 'About',
            'path': '/about'
        }, {
            'name': 'Firmware',
            'path': '/firmware'
        }, {
            'name': 'Reboot',
            'path': '/reboot'
        }]
    }
}

var headerMenuConfigMap = [
    {href:'#/',icon:'home',text:'Home'},
    {href:'#/networks',icon:'bar-chart',text:'Monitoring',type:'monitoring'},
    {href:'#/about',icon:'wrench',text:'Maintenance',type:'maintenance'},
    {href:'#/system',icon:'cog',text:'Settings',type:'settings'}
]

var App = React.createClass({
    getInitialState() {
        var self = this;

        function getNavConfig (path) {
            var config = null;

            for (var i in navConfigMap) {
                var children = navConfigMap[i].children;
                if (children) {
                    for (var j = 0; j < children.length; j++) {
                        if (children[j].path == path) {
                            return [navConfigMap[i]];
                        }
                    }
                }
            }

            return config;
        }

        EventSystem.subscribe('UserLoggedIn', function (loggedIn) {
            self.setState({
                isLoggedIn: loggedIn
            });
        })

        EventSystem.subscribe('RouteUpdated', function (path) {
            var navConfig = getNavConfig(path);
            self.setState({
                currentLocation: path,
                navConfig : navConfig
            });
        })

        EventSystem.subscribe('AppInitializing', function (isFinished) {
            self.setState({
                showHeaderMenu: isFinished
            });
        })

        EventSystem.subscribe('FingerSwipe', function (isForward) {
            self.go(isForward);
        })

        return {
            isLoggedIn: isLoggedIn(),
            currentLocation: '/',
            navConfig : null,
            showHeaderMenu: true
        };
    },
    showUserMenu () {

    },
    go: function (isForward) {
        if (!this.state.isLoggedIn || !this.state.showHeaderMenu) {
            return;
        }
        var currentIndex = 0;
        var self = this;
        headerMenuConfigMap.forEach(function (item, index) {
            if (self.state.currentLocation == item.href.replace(/^#/g, '') || self.isCurrentMenu(item)) {
                currentIndex = index;
            }
        })
        var index = isForward? currentIndex + 1 : currentIndex - 1;
        index = Math.min(Math.max(0, index), headerMenuConfigMap.length - 1);
        console.log(index);

        location.href = headerMenuConfigMap[index].href;
    },
    isCurrentMenu: function (item) {
        var result = false;
        var navConfig = navConfigMap[item.type];
        if (navConfig) {
            var menus = navConfig.children;
            for (var i = 0; i < menus.length; i++) {
                if (menus[i].path === this.state.currentLocation) {
                    result = true;
                    break;
                }
            }
        }

        return result;
    },
    render () {
        var self = this;
        // var isCurrentMenu = (item) => {
        //     var result = false;
        //     var navConfig = navConfigMap[item.type];
        //     if (navConfig) {
        //         var menus = navConfig.children;
        //         for (var i = 0; i < menus.length; i++) {
        //             if (menus[i].path === self.state.currentLocation) {
        //                 result = true;
        //                 break;
        //             }
        //         }
        //     }

        //     return result;
        // }
        var Menus = React.createClass({
            render : function () {
                var menus = headerMenuConfigMap;

                menus = menus.map((item, index)=>{
                    var iconClass = `fa-${item.icon} `;
                    var currentLocationClass = '';
                    if (self.state.currentLocation == item.href.replace(/^#/g, '') || self.isCurrentMenu(item)) {
                        currentLocationClass = 'current';
                    }
                    var className = 'menu ' + iconClass + currentLocationClass;
                    return (<a key={index} href={item.href} className={className}><span>{item.text}</span></a>);
                });

                var style = {
                    display: self.state.showHeaderMenu ? '' : 'none'
                }

                return (<div className='menus' style={style}>
                        {menus}
                    </div>)
            }
        });
        var Header = React.createClass({
            render: function () {
                if (!this.props.show) {
                    return null;
                }
                return (
                    <div className='header'>
                        <div className='logo small-3 columns' />
                        <div className='bannermenu small-9 columns'>
                            <div className='menu_block'></div>
                            <Menus currentLocation={this.props.currentLocation}/>
                            <div className='bannel_divider'></div>
                            <div className='user menu' onClick = {() => {$('.user .userMenu').toggle('display');}}>
                                <div className='icon_avatar'></div>
                                <div className='icon_arrow_down'></div>
                                <div className='userMenu'>
                                    <div>
                                        <label>Signed in as </label>
                                        <strong className='user_role'>{getUser().role}</strong>
                                    </div>
                                    <div className="divider"></div>
                                    <a className='fa-signout' href='#/logout'><span>Logout</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        });

        //TODO: Use one method to generate the same dom for footer and header menu
        var Footer = React.createClass({
            render: function () {
                var style = {
                    display: self.state.showHeaderMenu ? '' : 'none'
                }
                return (<div className='footer' style={style}>
                    <Menus currentLocation={this.props.currentLocation}/>
                </div>);
            }
        })

        return (
            <div className='app'>
                <Header show={this.state.isLoggedIn? true: false} currentLocation={this.state.currentLocation}/>
                <div className='wrapper'>
                    <SideNav data={this.state.navConfig} show={this.state.isLoggedIn? true: false} currentLocation={this.props.location.pathname} />
                    <div id='container' className='container'>
                        {this.props.children}
                    </div>
                </div>
                <Footer currentLocation={this.state.currentLocation}/>
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
    }, {
        path: 'networks',
        component: NetworksOverview
    }, {
        path: 'network-init',
        component: NetworkInitWizard
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



(function () {
    var startPoint = {x:0, y:0},
        endPoint = {x:0, y:0}

    //$(document.body).html('<div id="test" style="width:300px;height:300px;border:1px solid red;"></div>')

    $(document.body).bind('touchstart', function (e) {
        startPoint.x = e.originalEvent.touches[0].pageX;
        startPoint.y = e.originalEvent.touches[0].pageY;
    })

    $(document.body).bind('touchmove', function (e) {
        endPoint.x = e.originalEvent.touches[0].pageX;
        endPoint.y = e.originalEvent.touches[0].pageY;
    })

    $(document.body).bind('touchend', function (e) {
        var deltaX = endPoint.x - startPoint.x,
            deltaY = endPoint.y - startPoint.y;

        console.log(deltaX + " : " + deltaY);

        var angle = Math.round(Math.atan(deltaY/deltaX) * 180 / Math.PI);
        //$('#test').html('Angle is ' + angle);

        // If the angle is +/- 20, then consider it is a horizontal swipe
        // Make sure the swipe distance more than 40px to avoid this event be triggered by mistake
        if (Math.abs(angle) <= 20 && Math.abs(deltaX) >= 40) {
            if(deltaX < 0) {//Forward
                EventSystem.publish('FingerSwipe', true);
            } else {
                EventSystem.publish('FingerSwipe', false);
            }
        }
    })
})()
