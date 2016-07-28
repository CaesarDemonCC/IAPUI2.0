import {ComfirmDialog} from '../ui/widget/comfirmdialog'
import {Ajax} from '../utils/ajax'
import {LoadingDialog} from '../ui/widget/loadingDialog'

var Firmware = ReactRouter.withRouter(React.createClass({
    getInitialState() {
        return {
            imageVersion: null,
            showConfirmDialog : false,
            opid: ''
        };
    },
    getUID () {
        var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();

        return uid;
    },
    upgradeByUrl () {
        const url = ReactDOM.findDOMNode(this.refs.url).value;
        const id = this.state.opid;

        Ajax.post({
            'opcode':'image-url-upgrade',
            'oper_id': id,
            'image_url': this.state.imageVersion + "@" + url,
            'auto_reboot': true
        }, function(data){
            // TBD
            this.checkVersionStatus();
        }.bind(this));
    },
    checkVersionStatus() {
        var cmdList= [];
        var self = this;

        Ajax.get({
            'opcode':'image-url-upgrade-status',
            'oper_id':this.state.opid,
            'cmd': cmdList
        }, function(data){
            // if (self.refs.loadingDialog && self.refs.loadingDialog.state.loading) {
            //     self.props.router.replace('/');
            // }
            if (self.refs.loadingDialog && self.refs.loadingDialog.state.loading) {
                if (data.operationstate == 'in_progress') {
                    self.setState({
                        loadingTitle : data.operationmessage
                    })
                } else if (data.operationstate == 'success') {
                    self.refs.loadingDialog.setState({
                        loading : false
                    })
                    
                    self.setState({
                        success : true,
                        loadingmsg : 'The Access Points have successfully upgraded.After clicking OK, you will need to re-login to the system.'
                    })
                } else if (data.operationstate == 'error') {
                    self.refs.loadingDialog.setState({
                        loading : false
                    })

                    self.setState({
                        loadingmsg : 'Please check the URL then retry.'
                    })
                }
            }
        });

        if (self.refs.loadingDialog && self.refs.loadingDialog.state.loading) {
            setTimeout(function() {
                self.checkVersionStatus()
            }, 3000);
        }
    },
    showImageVersion (rebooting) {
        var self = this;
        Ajax.get({
            'opcode':'show',
            'cmd': 'show image version'
        }, function(data){
            if (rebooting && self.refs.loadingDialog && self.refs.loadingDialog.state.loading) {
                self.props.router.replace('/');
            }

            if (data.APImagesClasses && $.isArray(data.APImagesClasses)) {
                // TBD
                this.state.imageVersion = data.APImagesClasses[0]['class'];
            }
        }.bind(this));

        if (rebooting && self.refs.loadingDialog && self.refs.loadingDialog.state.loading) {
            setTimeout(function() {
                self.showImageVersion()
            }, 5000);
        }
    },
    onCancel () {
        this.setState({
            showConfirmDialog : false
        });
    },
    onComfirmSubmit () {
        this.upgradeByUrl();
        this.setState({
            showConfirmDialog : false,
            loading : true
        });
    },
    onLoadingSubmit () {
        if (this.state.success) {
            this.setState({
                loadingTitle : 'Rebooting...'
            })
            this.refs.loadingDialog.setState({
                loading : true
            })
            this.showImageVersion(true);
        } else {
            this.setState({
                loading : false
            });
        }
    },
    showUpgradeConfirm () {
        this.setState({
            showConfirmDialog : true
        });
    },
    componentWillMount () {
        this.setState({
            opid: this.getUID()
        })
        this.showImageVersion();
    },
    render () {
        let comfirmDialog;

        if (this.state.showConfirmDialog) {
            const msg = 'All Access Points will reboot after the upgrade, and service will be interrupted during the reboot process.'
            comfirmDialog = (<div>
                <ComfirmDialog message={msg} onCancel={this.onCancel} onSubmit={this.onComfirmSubmit}/>
            </div>);
        }

        var loadingDialog = null;
        if (this.state.loading) {
            loadingDialog = (<div><LoadingDialog ref='loadingDialog' message={this.state.loadingmsg} loadingTitle={this.state.loadingTitle} onSubmit={this.onLoadingSubmit}/></div>);
        }


        return (<div className='panel no_border'>
            <h2 className='title_heading form_heading'>Firmware</h2>
            <div className='row'>
                <p className="medium-2 columns">URL</p><input ref="url" style={{float: 'left'}} className="medium-8 columns input" type="text"/>
            </div>
            <button style={{marginTop: '0.625rem'}} className='medium button medium-2 columns' onClick={this.showUpgradeConfirm}>Upgrade Now</button>
            {comfirmDialog}
            {loadingDialog}
        </div>)
    }
}));

module.exports = {
    Firmware : Firmware
}
