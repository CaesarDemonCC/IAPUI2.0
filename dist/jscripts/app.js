var TextLabel = React.createClass({displayName: "TextLabel",
    render: function () {
        return React.createElement("p", null, this.props.label)
    }
})

var TextInput = React.createClass({displayName: "TextInput",
    render: function () {
        var props = this.props;
        return React.createElement("input", {type: "text", className: "input", id: props.id || '', style: props.style || {}})
    }
})

var TextInputRow = React.createClass({displayName: "TextInputRow",
    render: function () {
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement(TextLabel, {label: this.props.label}), 
                React.createElement(TextInput, React.__spread({},  this.props))
            )
        )
    }
})

var CheckBoxInput = React.createClass({displayName: "CheckBoxInput",
    render: function () {
        var props = this.props;
        return React.createElement("input", {type: "checkbox", className: "input", id: props.id || {}})
    }
})

var CheckBoxInputRow = React.createClass({displayName: "CheckBoxInputRow",
    render: function () {
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement(TextLabel, {label: this.props.label}), 
                React.createElement(CheckBoxInput, React.__spread({},  this.props))
            )
        )
    }
})

var Select = React.createClass({displayName: "Select",
    render: function () {
        var props = this.props;
        var options = this.props.options.map(function (option) {
            if (typeof option === 'string') {
                option = {
                    text: option,
                    value: option
                }
            }
            return React.createElement("option", {value: option.value}, option.text);
        })
        return (
            React.createElement("select", {className: "input", id: props.id || '', style: props.style || {}}, 
                options
            )
        )
    }
})

var SelectRow = React.createClass({displayName: "SelectRow",
    render: function () {
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement(TextLabel, {label: this.props.label}), 
                React.createElement(Select, React.__spread({},  this.props))
            )
        )
    }
});

var generateItem = function (item) {
    var field = '';
    switch (item.type) {
        case 'checkbox':
            field = React.createElement(CheckBoxInputRow, React.__spread({},  item));
            break;
        case 'select':
            field = React.createElement(SelectRow, React.__spread({},  item))
            break;
        default: 
            field = React.createElement(TextInputRow, React.__spread({},  item));
    }
    return field;
}

var Panel = React.createClass({displayName: "Panel",
    render: function() {
        return (
            React.createElement("div", {className: "panel"}, 
                React.createElement(PanelTitle, {title: this.props.config.title}), 
                React.createElement(PanelContent, {items: this.props.config.items}), 
                React.createElement(ButtonBar, null)
            )
        );
    }
});

var PanelTitle = React.createClass({displayName: "PanelTitle",
    render: function () {
        return (
            React.createElement("h2", {className: "title_heading form_heading"}, this.props.title)
        )
    }
})

var PanelContent = React.createClass({displayName: "PanelContent",
    render: function () {
        var items = this.props.items.map(generateItem);
        return (
            React.createElement("div", null, items)
        )
    }
})

var ButtonBar = React.createClass({displayName: "ButtonBar",
    render: function () {
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("button", {className: "medium button"}, "OK"), 
                React.createElement("button", {className: "medium button"}, "Cancel")
            )
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
    React.createElement(Panel, {config: systemPanelData}),
    document.getElementById('container')
);

var tab2Data = {
    title: 'Tab 2',
    items: [{
        label: 'Test'
    }]
}

ReactDOM.render(
    React.createElement(Panel, {config: tab2Data}),
    document.getElementById('container2')
);

var Tab = React.createClass({displayName: "Tab",
    render: function () {
        //var items = this.props.items.map(generateItem);
        return (
            React.createElement("div", {className: "tabs fullwidth responsive dark"}, 
                React.createElement("ul", {className: "tabcontrols"}, 
                    React.createElement("li", {className: "current"}, React.createElement("a", {href: "#"}, "Tab 1")), 
                    React.createElement("li", null, React.createElement("a", {href: "#"}, "Tab 2"))
                ), 

                React.createElement("div", {className: "tab"}), 
                React.createElement("div", {className: "tab"})

            )
        )
    }
})

// ReactDOM.render(
//     <Tab/>,
//     document.getElementById('container')
// );
