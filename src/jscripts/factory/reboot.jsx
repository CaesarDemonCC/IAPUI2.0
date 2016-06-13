import {Dialog} from '../ui/widget/dialog'
import {Ajax} from '../utils/ajax'
import {getUser} from '../utils/auth'

var Reboot = React.createClass({
	getInitialState() {
        return {
          showReboot : false
        };
    },
    rebootAll () {
		var cmdList = [
            'reload all'
        ];
        Ajax.post({
            'opcode':'action',
            'cmd': cmdList.join('\n'),
            'ip' : '127.0.0.1',
            'sid' : getUser().sid
        }, function(data){    
        	
        }.bind(this));
	},
	onCancel () {
		this.setState({
			showReboot : false
		})
	},
	getRebootConfirm () {
		var items = [{
				type: 'template',
				template:(<div>
					<p>Service will be interrupted during the Reboot process. Do you want to continue?</p>
				      <div className="controls">
				        <button className="medium button secondary medium-4 columns" onClick={this.onCancel}>Cancel</button>
				        <button className="medium button medium-4 columns" onClick={this.rebootAll}>Yes</button>
				      </div>
				</div>)
			}];
		return (<div>
				<Dialog className='message confirmation' close={true} ref='rebootDialog'
				onCancel={this.onCancel} onSubmit={this.rebootAll} 
				items={items} 
                footer={<div></div>}
                />
			</div>)
	},
	showRebootConfirm () {
		this.setState({
			showReboot : true
		});
	},
	render () {
		var titleElement = (<div className='title_heading form_heading'>Reboot</div>)
		var rebootConfirm;
		if (this.state.showReboot) {
			rebootConfirm = this.getRebootConfirm();
		}
		return (<div className='panel'>
				{titleElement}
				<button className='medium button medium-2 columns' onClick={this.showRebootConfirm}>Reboot</button>
				{rebootConfirm}
			</div>)
	}
});

module.exports = {
	Reboot : Reboot
}