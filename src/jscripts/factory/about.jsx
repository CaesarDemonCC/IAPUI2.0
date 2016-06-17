import {Ajax} from '../utils/ajax'
import Table from '../ui/widget/table'

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
        Ajax.get({
            'opcode':'show',
            'cmd': cmdList
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
    },
    componentWillMount () {
		this.showAbout();
    },
	render () {
		var aboutElement = (<div />);
		var titleElement = (<h2 className='title_heading form_heading'>About</h2>)
		if(this.state.about) {
			aboutElement = this.state.about.map((item) => {
				return (<SpanLable {...item}/>)
			});
		}
		return (
		<div className='panel no_border'>
			{titleElement}
			<div className='about' >
				{aboutElement}
			</div>
		</div>)
	}
});


module.exports = {
	About : About
}