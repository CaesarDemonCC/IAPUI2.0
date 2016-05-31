var formField = require('./formField')

var generateItem = function (item) {
    var field = '';
    switch (item.type) {
        case 'checkbox':
            field = <formField.CheckBoxInputRow {...item} />;
            break;
        case 'select':
            field = <formField.SelectRow {...item} />
            break;
        default: 
            field = <formField.TextInputRow {...item} />;
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

module.exports = {
   Panel: Panel,
   PanelContent: PanelContent,
   ButtonBar: ButtonBar
}