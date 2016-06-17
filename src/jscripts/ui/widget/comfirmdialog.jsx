import {Dialog} from './dialog'
import {buttonMixin} from '../../utils/mixin'
var ComfirmDialog = React.createClass({
	mixins: [buttonMixin],
    showComfirm () {
    	this.setState({
    		show: true
    	})
    },
    getItems () {
    	return [{
				type: 'template',
				template:(<div>
					<p>{this.props.message}</p>
				      <div className="controls">
				        <button className="medium button white-button medium-4 columns" onClick={this.cancelHandler}>Cancel</button>
				        <button className="medium button medium-4 columns" onClick={this.submitHandler}>Yes</button>
				      </div>
				</div>)
			}];
    },
	render () {
		var items = this.getItems();
		return (<div>
				<Dialog className='message confirmation' close={true} ref='comfirmDialog'
				onCancel={this.cancelHandler}
				items={items} 
                footer={<div></div>}
                />
			</div>)
	}
});

module.exports = {
	ComfirmDialog : ComfirmDialog
}