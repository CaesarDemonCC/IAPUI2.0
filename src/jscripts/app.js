var TextLabel = React.createClass({
    render: function () {
        return <p>{this.props.label}</p>
    }
})

var TextInput = React.createClass({
    render: function () {
        var props = this.props;
        return <input type='text' className='input' id={props.id || ''} style={props.style || {}}/>
    }
})

var TextInputRow = React.createClass({
    render: function () {
        return (
            <div className='row'>
                <TextLabel label={this.props.label}/>
                <TextInput {...this.props} />
            </div>
        )
    }
})

var CheckBoxInput = React.createClass({
    render: function () {
        var props = this.props;
        return <input type='checkbox' className='input' id={props.id || {}}/>
    }
})

var CheckBoxInputRow = React.createClass({
    render: function () {
        return (
            <div className='row'>
                <TextLabel label={this.props.label}/>
                <CheckBoxInput {...this.props} />
            </div>
        )
    }
})

var Select = React.createClass({
    render: function () {
        var props = this.props;
        var options = this.props.options.map(function (option) {
            if (typeof option === 'string') {
                option = {
                    text: option,
                    value: option
                }
            }
            return <option value={option.value}>{option.text}</option>;
        })
        return (
            <select className='input' id={props.id || ''} style={props.style || {}}>
                {options}
            </select>
        )
    }
})

var SelectRow = React.createClass({
    render: function () {
        return (
            <div className='row'>
                <TextLabel label={this.props.label}/>
                <Select {...this.props} />
            </div>
        )
    }
});

var generateItem = function (item) {
    var field = '';
    switch (item.type) {
        case 'checkbox':
            field = <CheckBoxInputRow {...item} />;
            break;
        case 'select':
            field = <SelectRow {...item} />
            break;
        default: 
            field = <TextInputRow {...item} />;
    }
    return field;
}

var Panel = React.createClass({
    render: function() {
        return (
            <div className='panel'>
                <PanelTitle title={this.props.title} />
                <PanelContent items={this.props.items} />
                <ButtonBar />
            </div>
        );
    }
});

var PanelTitle = React.createClass({
    render: function () {
        return (
            <h2 className='title_heading form_heading'>{this.props.title}</h2>
        )
    }
})

var PanelContent = React.createClass({
    componentDidMount: function () {
        var handler = this.props.handler;
        if (handler && typeof handler === 'function') {
            handler.call(this);
        }
    },
    render: function () {
        var items = this.props.items.map(generateItem);
        return (
            <div>{items}</div>
        )
    }
})

var PanelFactory = React.createFactory(Panel);

var ButtonBar = React.createClass({
    render: function () {
        return (
            <div className='row'>
                <button className='medium button'>OK</button>
                <button className='medium button'>Cancel</button>
            </div>
        )
    }
})

var generalPanel = {
    title: 'General',
    items: [{
        id: 'input-1',
        label: 'Name'
    }, {
        label: 'System Location'
    }, {
        id: 'input-3',
        label: 'VC IP',
        style: {
            border: '1px solid red' // Not recommend to set styles into component directly, please use sass instead
        }
    }, {
        id: 'dynamic-proxy',
        type: 'checkbox',
        label: 'Dynamic Proxy'
    }, {
        label: 'MAS Integration',
        type: 'select',
        style: {
            width: '11.75rem'
        },
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

    }
}

var TabControls = React.createClass({
    goToTab : function (index) {
        this.props.clickHandler.call(this, index);
    },
    render: function () {
        var self = this;
        var tabCtrls = this.props.tabCtrls.map(function (tabCtrl, index) {
            return <li className={index == self.props.currentTab ? 'current' : ''} onClick={self.goToTab.bind(self, index)}><a href='#'>{tabCtrl}</a></li>;
        })
        return (
            <ul className='tabcontrols'>
                {tabCtrls}
            </ul>
        )
    }
})

var systemTabs = {
    title: 'System',
    tabsConfig: [generalPanel, adminPanel]
}

var Tab = React.createClass({

    getInitialState: function () {
        return {
            currentTab: 0
        }
    },

    goToTab: function (index) {
        this.setState({currentTab: index});
    },

    render: function () {
        var tabCtrls = [],
            panel = null,
            handlers = [];

        var tabsConfig = this.props.tabsConfig;
        tabsConfig.forEach(function (tab) {
            tabCtrls.push(tab.title);
            handlers.push(tab.handler || function () {})
        })

        panel = <PanelContent items={tabsConfig[this.state.currentTab].items} handler={tabsConfig[this.state.currentTab].handler}/>;

        return (
            <div className='tabs fullwidth responsive dark'>
                <TabControls tabCtrls={tabCtrls} clickHandler={this.goToTab} currentTab={this.state.currentTab}/>
                <div>
                    {panel}
                </div>
            </div>
        )
    }
})

var TabFactory = React.createFactory(Tab);

ReactDOM.render(
    TabFactory(systemTabs),
    document.getElementById('container')
);