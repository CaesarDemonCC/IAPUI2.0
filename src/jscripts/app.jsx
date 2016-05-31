import {Tab} from './ui/widget/tab'
import {SideNav} from './ui/widget/sideNav'

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

ReactDOM.render(
    TabFactory(systemTabs),
    document.getElementById('container')
);

ReactDOM.render(
    <SideNav />,
    document.getElementById('sideNav')
)