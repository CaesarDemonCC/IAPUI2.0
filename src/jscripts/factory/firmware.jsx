import {ComfirmDialog} from '../ui/widget/comfirmdialog'
import {Ajax} from '../utils/ajax'

var Firmware = React.createClass({
    getInitialState() {
        return {
            imageVersion: null,
            showConfirmDialog : false
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
        const id = this.getUID();

        Ajax.post({
            'opcode':'image-url-upgrade',
            'oper_id': id,
            'image_url': this.state.imageVersion + "@" + url,
            'auto_reboot': true
        }, function(data){ 
            // TBD
            this.onCancel();
        }.bind(this));
    },
    showImageVersion () {
        Ajax.get({
            'opcode':'show',
            'cmd': 'show image version'
        }, function(data){ 
            if (data.APImagesClasses && $.isArray(data.APImagesClasses)) {
                // TBD
                this.state.imageVersion = data.APImagesClasses[0]['class'];
            }
        }.bind(this));
    },
    onCancel () {
        this.setState({
            showConfirmDialog : false
        });
    },
    showUpgradeConfirm () {
        this.setState({
            showConfirmDialog : true
        });
    },
    componentWillMount () {
        this.showImageVersion();
    },
    render () {
        let comfirmDialog;

        if (this.state.showConfirmDialog) {
            const msg = 'All Access Points will reboot after the upgrade, and service will be interrupted during the reboot process.'
            comfirmDialog = (<div>
                <ComfirmDialog message={msg} onCancel={this.onCancel} onSubmit={this.upgradeByUrl}/>
            </div>);
        }

        return (<div className='panel no_border'>
            <h2 className='title_heading form_heading'>Firmware</h2>
            <p className="medium-2 columns">URL</p><input ref="url" className="medium-9 columns" type="text" class="input"/>
            <button className='medium button' style={{'margin-top':'1rem'}} onClick={this.showUpgradeConfirm}>Upgrade Now</button>
            {comfirmDialog}
        </div>)
    }
});

module.exports = {
    Firmware : Firmware
}