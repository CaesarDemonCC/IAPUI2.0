import {Dialog} from '../ui/widget/dialog'
import {Ajax} from '../utils/ajax'
import {Upload} from '../utils/upload'

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
            'cmd': cmdList.join('\n')
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
				<Upload {...props}><a >asdfasd</a></Upload>
				{rebootConfirm}
			</div>)
	}
});
const props = {
  action: '../swarm.cgi',
  data: {psk: "", cert_type: "ca_cert", cert_format: "pem_format", opcode: "cert-upload"},
  name: 'cert',
  onStart(files) {
    const file = files[0];
    console.log('onStart', file, file.name);
  },
  onSuccess(ret) {
    console.log('onSuccess', ret);
  },
  onProgress(step, file) {
    console.log('onProgress', step, file);
  },
  onError(err) {
    console.log('onError', err);
  },
};
module.exports = {
	Reboot : Reboot
}