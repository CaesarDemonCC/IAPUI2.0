import {Tab} from './ui/widget/tab'
import {SideNav} from './ui/widget/sideNav'
import {AjaxGet, AjaxPost} from './utils/Ajax'
import {Wizard} from './ui/widget/wizard'

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

ReactDOM.render(
    <Wizard {...networkWizardConfig} />,
    document.getElementById('container')
)

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

ReactDOM.render(
    <SideNav data={navConfig}/>,
    document.getElementById('sideNav')
)

AjaxPost({
    'opcode':'login',
    'user':'admin',
    'passwd':'admin'
}, function(data){
    console.log(data);
    var cmdList = [
        'show ui-network-settings',
        'show tacacs-servers',
        'show external-captive-portal',
        'show dpi app all',
        'show dpi appcategory all',
        'show dpi webcategory all',
        'show dhcps config',
        'show facebook',
        'show bcast-filter-all',
        'show time-range',
        'show time-profile',
        'show dpi-error-page-urls',
        'show summary'
    ];
    AjaxGet({
        'opcode':'show',
        'cmd': cmdList.join('\n'),
        'ip' : '127.0.0.1',
        'sid' : data.sid
    }, function(data){
        console.log(data);
    });
});


