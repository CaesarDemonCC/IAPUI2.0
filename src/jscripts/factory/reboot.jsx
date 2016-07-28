import {ComfirmDialog} from '../ui/widget/comfirmdialog'
import {SelectRow} from '../ui/widget/formField'
import {LoadingDialog} from '../ui/widget/loadingDialog'
import {Ajax} from '../utils/ajax'
import {Upload} from '../utils/upload'

var Reboot = ReactRouter.withRouter(React.createClass({
	getInitialState() {
        return {
            showReboot : false
        };
    },
    componentWillMount () {
        this.showAPs();
    },
    showAPs() {
        var cmdList= ['show aps'];
        var self = this;

        Ajax.get({
            'opcode':'show',
            'cmd': cmdList
        }, function(data){
            if (self.refs.loadingDialog && self.refs.loadingDialog.state.loading) {
                self.props.router.replace('/');
            }
            if (data) {
                var aps = [{text:'Reboot All',value:'all'}];

                $.each(data, (key, value) => {
                    if (key.match(/^\d+AccessPoint/)) {
                        value.forEach((item, index) => {
                            aps.push({
                              'value' : item.ipaddress,
                              'text' : item.name
                            });
                        })
                    }
                });
                self.setState({
                    aps : aps
                })
            }
        });

        if (self.refs.loadingDialog && self.refs.loadingDialog.state.loading) {
            setTimeout(function() {
                self.showAPs()
            }, 5000);
        }
    },
    reboot () {
  		var cmdList = [
            'reload all'
        ];
        if ($("#apselect").val() !== 'all') {
            cmdList = ['reload'];
        }
        var self = this;   
        Ajax.post({
            'opcode':'action',
            'cmd': cmdList.join('\n'),
            'ip' : $("#apselect").val()
        }, function(data){ 
            setTimeout(function() {
                self.showAPs()
            }, 10000);
        });
  	},
    onComfirmSubmit () {
        this.reboot();
        this.setState({
            showReboot : false,
            loading : true
        });
    },
  	onCancel () {
		this.setState({
		    showReboot : false
		})
  	},
  	showRebootConfirm () {
		this.setState({
		    showReboot : true
		});
  	},
  	render () {
		var titleElement = (<h2 className='title_heading form_heading'>Reboot</h2>)
		var comfirmDialog;
        if (this.state.showReboot) {
            comfirmDialog = (<div>
                <ComfirmDialog message='Service will be interrupted during the Reboot process. Do you want to continue?'
                onCancel={this.onCancel} onSubmit={this.onComfirmSubmit} 
                />
            </div>)
        }
        var loadingDialog = null;
        if (this.state.loading) {
            var msg = 'The Access Points have successfully rebooted.After clicking OK, you will need to re-login to the system.';
            var loadingTitle = 'Access Points are rebooting...';
            loadingDialog = (<div><LoadingDialog ref='loadingDialog' message={msg} loadingTitle={loadingTitle} onSubmit={this.reboot}/></div>);
        }

        var items = {
            id: 'apselect',
            ref: 'aps',
            label: 'Select the access point you wish to reboot:',
            type:'select',
            options: this.state.aps == undefined ? [] : this.state.aps
        };
		return (<div className='panel no_border'>
				{titleElement}
                <SelectRow {...items}/>
				<button className='medium button medium-2 columns' onClick={this.showRebootConfirm}>Reboot</button>
				{comfirmDialog}
                {loadingDialog}
		</div>)
    }
}));
// const props = {
//   action: '../swarm.cgi',
//   data: {psk: "", cert_type: "ca_cert", cert_format: "pem_format", opcode: "cert-upload"},
//   name: 'cert',
//   onStart(files) {
//     const file = files[0];
//     console.log('onStart', file, file.name);
//   },
//   onSuccess(ret) {
//     console.log('onSuccess', ret);
//   },
//   onProgress(step, file) {
//     console.log('onProgress', step, file);
//   },
//   onError(err) {
//     console.log('onError', err);
//   },
// };
module.exports = {
	Reboot : Reboot
}