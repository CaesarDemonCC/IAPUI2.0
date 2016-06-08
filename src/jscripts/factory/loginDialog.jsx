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
            loginEl = (<div>
                <Dialog title='Welcome' ref='dialog'
                onCancel={this.onCancel} onSubmit={this.onSubmit} 
                items={this.getLoginItems()}>
                </Dialog>
            </div>)
        }
        return loginEl;
    }
}); 

module.exports = {
	LoginDialog : LoginDialog
}