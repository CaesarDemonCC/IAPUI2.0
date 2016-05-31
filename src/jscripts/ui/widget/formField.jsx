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
        var options = this.props.options.map(function (option, index) {
            if (typeof option === 'string') {
                option = {
                    text: option,
                    value: option
                }
            }
            return <option key={index} value={option.value}>{option.text}</option>;
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

module.exports = {
    TextInputRow: TextInputRow,
    CheckBoxInputRow: CheckBoxInputRow,
    SelectRow: SelectRow
}