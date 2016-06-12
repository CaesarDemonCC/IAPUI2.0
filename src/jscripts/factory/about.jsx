import {Ajax} from '../utils/ajax'
import Table from '../ui/widget/table'
import {getUser} from '../utils/auth'


var SpanLable = React.createClass({
    displayName: 'spanLable',
    render() {
    	var span ;
    	if (this.props.lable == 'Website') {
    		span = (<span><span className='medium-8 columns'>
            	<a target="_blank" href={this.props.text}>{this.props.text}</a></span></span>);
    	} else {
            span = (<span><span className='medium-8 columns'>{this.props.text}</span></span>);
    	}
        return (
            <div>
            	<span className='medium-4 columns'>{this.props.lable}</span>
            	{span}
            </div>
        );
    }
});

var About = React.createClass({
	getInitialState() {
        return {
        	about : null
    	};
    },
	showAbout() {
        var cmdList = [
            'show about'
        ];
        if (getUser().sid) {
	        Ajax.get({
	            'opcode':'show',
	            'cmd': cmdList.join('\n'),
	            'ip' : '127.0.0.1',
	            'sid' : getUser().sid
	        }, function(data){    
	        	var about = [];        
	        	$.each(data, (key, value) => {
	                    about.push({
	                        'lable' : key,
	                        'text' : value
	                    });
	            });
	            this.setState({
	                'about': about
	            });
	        }.bind(this), {'lowerCase': false, 'removeKeySpace': false});
        }
    },
    componentWillMount () {
		this.showAbout();
    },
	render () {
		var aboutElement = (<div/>);
		if(this.state.about) {
			aboutElement = this.state.about.map((item) => {
				return (<SpanLable {...item}/>)
			});
		}
		return (<div>
			{aboutElement}
		</div>)
	}
});


module.exports = {
	About : About
}