import {getUser, setUser,isLoggedIn} from '../utils/auth'
import {Dialog} from '../ui/widget/dialog'
import {Ajax} from '../utils/ajax'

var LoginDialog = React.createClass({
	getLoginItems () {
		return [{
        	ref: 'username',
	        label: 'username'
	    }, {
	    	ref: 'passwd',
	        label: 'password'
	    }];
	},
    getInitialState() {
        return {
          visible: !isLoggedIn()
        };
    },
    closeDialog() {
        this.setState({
            visible: !isLoggedIn()
        });
    },
    onSubmit (e) {
    	var data = this.refs.dialog.refs.panelContent.getData();
      	Ajax.post({
        'opcode':'login',
        'user':data.username,
        'passwd':data.passwd
    }, function(data){
        if(data.sid) {
            setUser({
                sid : data.sid,
                role : data.type
            });

            this.closeDialog();

            if(this.props.cb){
                this.props.cb();
            }
        }
    }.bind(this));
    },
    render () {
	    var loginEl =(<div></div>);
        if(this.state.visible){
            loginEl = (<div className='login-container'>
                <Dialog title={<div className='welcome'>Welcome</div>} ref='dialog'
                onCancel={this.onCancel} onSubmit={this.onSubmit} 
                items={this.getLoginItems()} 

                footer={<div><button className='button medium columns medium-12' onClick={this.onSubmit}>OK</button></div>}>
                </Dialog>
            </div>)
        }
        return loginEl;
    }
}); 

module.exports = {
	LoginDialog : LoginDialog
}