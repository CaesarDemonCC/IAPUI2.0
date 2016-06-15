var formField = require('./formField')

var generateItem = function (item, index) {
    var result,
        Field;
    switch (item.type) {
        case 'checkbox':
            Field = formField.CheckBoxInputRow;
            break;
        case 'select':
            Field = formField.SelectRow;
            break;
        case 'template':
            item.ref='template'
            Field = formField.Template;
            break;
            //return item.template;
        default: 
            Field = formField.TextInputRow;
    }
    result = <Field key={index} {...item}/>
    return result;
}


var Panel = React.createClass({
    render: function() {
        return (
            <div className='panel'>
                <PanelTitle title={this.props.title} />
                <PanelContent items={this.props.items} getData ={this.props.getData}/>
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
        console.log('componentDidMount');
        var handler = this.props.handler;
        if (handler && typeof handler === 'function') {
            handler.call(this);
        }

        this.setData(this.props);
    },
    componentWillUpdate: function (nextProps, nextState) {
        this.setData(nextProps);
    },
    setData : function (props) {
        if (props.tabData) {
            $.each(this.refs, (key, item) => {
                var value = props.tabData[key];
                if (key.indexOf('re-') > -1 && value == undefined
                    && props.tabData[key.substr(key.indexOf('re-') + 3)]) {
                    value = props.tabData[key.substr(key.indexOf('re-') + 3)];
                }
                $(ReactDOM.findDOMNode(item)).find('.input').val(value);
            });
        }
    },
    getData : function () {
        var result = {};
        $.each(this.refs, (index, item)=>{
            var inputVal = $(ReactDOM.findDOMNode(item)).find('.input').val();
            result[index] = inputVal;
        })
        return result;
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