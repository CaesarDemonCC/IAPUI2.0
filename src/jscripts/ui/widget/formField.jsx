var TextLabel = React.createClass({
    render: function () {
        return <p>{this.props.label}</p>
    }
})

var TextInput = React.createClass({
    render: function () {
        var props = this.props;
        return <input type={props.type || 'text'} className='input' id={props.id || ''} style={props.style || {}}/>
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
        return <input type='checkbox' id={props.id || {}} onChange={this.props.onChange}/>
    }
})

var CheckBoxInputRow = React.createClass({
    setData: function () {
        var checked = ReactDOM.findDOMNode(this.refs.checkboxHiddenInput).value == 'Disabled' ? false : true;
        $(ReactDOM.findDOMNode(this.refs.checkbox)).attr('checked',checked);
        this.onChange();
    },
    componentDidMount: function () {
        $(ReactDOM.findDOMNode(this.refs.checkboxHiddenInput)).change(function (){
            this.setData();
        }.bind(this));
    },
    onChange: function (e) {
        if(e){
            ReactDOM.findDOMNode(this.refs.checkboxHiddenInput).value = e.target.checked ? 'Enable' : 'Disabled';
        }
        if(this.props.handler){
            this.props.handler();
        }
    },
    render: function () {
        return (
            <div className='row'>
                <input type='text' className='input' style={{display:'none'}} ref='checkboxHiddenInput' onChange={this.setData} />
                <TextLabel label={this.props.label}/>
                <CheckBoxInput {...this.props} ref='checkbox' onChange={this.onChange}/>
            </div>
        )
    }
})

var Select = React.createClass({
    onChange: function () {
        if(this.props.handler){
            this.props.handler();
        }
    },
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
            <select onChange={this.onChange} className='input' id={props.id || ''} style={props.style || {}}>
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

var Radio = React.createClass({
    render: function () {
        return (
            <div>
                <input type='radio' id={this.props.id || ''} name={this.props.name} onChange={this.props.onChange}/>
                <label htmlFor={this.props.id}>{this.props.label} </label>
            </div>
        )
    }
});

var RadioGroup = React.createClass({
    setData: function () {
        var id = ReactDOM.findDOMNode(this.refs.radioHiddenInput).value;
        $('#' + id).attr('checked','checked');
        this.onChange();
    },
    componentDidMount: function () {
        $(ReactDOM.findDOMNode(this.refs.radioHiddenInput)).change(function (){
            this.setData();
        }.bind(this));
    },
    onChange: function (e) {
        if(e){
            ReactDOM.findDOMNode(this.refs.radioHiddenInput).value = e.target.id;
        }
        if(this.props.handler){
            this.props.handler();
        }
    },
    render: function () {
        var radios = this.props.options.map(function (option, index) {
            return <Radio key={index} {...option} name = {this.props.name} onChange={this.onChange}/>;
        }.bind(this))
        return (
            <div className='radiogroup row'>
                <input type='text' className='input' style={{display:'none'}} ref='radioHiddenInput' onChange={this.setData} />
                <TextLabel className='medium-6' label={this.props.label}/>
                {radios}
            </div>
        )
    }
});

var Template = React.createClass({
    render: function () {
        return (
            <div>
                {this.props.template}
            </div>
        )
    }
});

module.exports = {
    TextInputRow: TextInputRow,
    CheckBoxInputRow: CheckBoxInputRow,
    SelectRow: SelectRow,
    RadioGroup: RadioGroup,
    Template: Template
}