import {getUser, setUser, isLoggedIn, logout} from '../utils/auth'
import {Dialog} from '../ui/widget/dialog'
import {Ajax} from '../utils/ajax'

var LoginDialog = ReactRouter.withRouter(React.createClass({
	getLoginItems () {
		return [{
            type:'template',
            template:(
                <div>
                    <div>
                        <div className='logo-container'>
                            <div className='logo' />
                        </div>
                    <div className='welcome'>Welcome</div>
                    <input className='medium-12 columns input' placeholder='Username' type='text' ref='username'/>
                    <input className='medium-12 columns input'  placeholder='Password' onKeyDown={this.onKeyDown} type='password'  ref='passwd'/>
                    <button className='button medium columns medium-12' onClick={this.onSubmit}>OK</button>
                    </div>
                </div>)
	    }];
	},
    componentDidMount() {
        this.refs.username.focus();
    },
    getInitialState() {
        return {
          visible: !isLoggedIn()
        };
    },
    onKeyDown(e) {
      if (e.keyCode  === 13) {
        this.onSubmit(e);
      }
    },
    closeDialog() {
        this.setState({
            visible: !isLoggedIn()
        });
    },
    onSubmit (e) {
    	//var data = this.refs.dialog.refs.panelContent.getData();
      	Ajax.post({
            'opcode':'login',
            'user':this.refs.username.value,
            'passwd':this.refs.passwd.value
        }, function(data){
            if(data.sid) {
                setUser({
                    sid : data.sid,
                    role : data.type
                });

                var location = this.props.location,
                    router = this.props.router;

                //router.replace('/');
                if (location.state && location.state.nextPathname) {
                    router.replace(location.state.nextPathname)
                } else {
                    router.replace('/');
                }

            }
        }.bind(this));
    },
    render () {
	    var loginEl =(<div></div>);
        if(this.state.visible){
            loginEl = (<div>
                <Dialog ref='dialog'
                onCancel={this.onCancel} onSubmit={this.onSubmit} 
                items={this.getLoginItems()} 
                footer={<div></div>}
                className='login-container'>
                </Dialog>
            </div>)
        }
        return loginEl;
    }
}));

var Logout = ReactRouter.withRouter(React.createClass({
    componentWillMount: function () {
        Ajax.post({
            'opcode':'logout'
        }, function(data){
            logout();
            var router = this.props.router;
            router.replace('/login');
        }.bind(this));
    },
    render: function () {
        return <div>Logging out...</div>
    }
}));

module.exports = {
	LoginDialog : LoginDialog,
    Logout: Logout
}