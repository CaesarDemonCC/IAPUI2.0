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
                <PanelTitle title={this.props.config.title} />
                <PanelContent items={this.props.config.items} />
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
    render: function () {
        var items = this.props.items.map(generateItem);
        return (
            <div>{items}</div>
        )
    }
})

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

var systemPanelData = {
    title: 'System',
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
        id: 'input-1',
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
    }]
}

ReactDOM.render(
    <Panel config={systemPanelData} />,
    document.getElementById('container')
);

var tab2Data = {
    title: 'Tab 2',
    items: [{
        label: 'Test'
    }]
}

ReactDOM.render(
    <Panel config={tab2Data} />,
    document.getElementById('container2')
);

var Tab = React.createClass({
    render: function () {
        //var items = this.props.items.map(generateItem);
        return (
            <div className='tabs fullwidth responsive dark'>
                <ul className='tabcontrols'>
                    <li className='current'><a href='#'>Tab 1</a></li>
                    <li><a href='#'>Tab 2</a></li>
                </ul>

                <div className='tab'></div>
                <div className='tab'></div>

            </div>
        )
    }
})

// ReactDOM.render(
//     <Tab/>,
//     document.getElementById('container')
// );
