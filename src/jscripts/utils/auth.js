import {getCookie, setCookie} from './cookie'
import EventSystem from '../utils/eventSystem'

var Auth = {
	user : {
		sid : '',
		role : ''
	}
};

Auth.setUser = function (user){
	Auth.user = user;
	setCookie('userType', user.role);
	setCookie('sid', user.sid);

	EventSystem.publish('UserLoggedIn', true);
};

Auth.getUser = function () {
	if (getCookie('sid')) {
		Auth.user.sid = getCookie('sid');
		Auth.user.role = getCookie('userType');
	}
	return Auth.user;
};

Auth.getSID = function (argument) {
	return Auth.getUser() ? Auth.getUser().sid : null;
};

Auth.isAdmin = function () {
	return Auth.getUser().role === 'Admin';
};

Auth.isLoggedIn = function () {
	return Auth.getUser().sid === '' ? false : true;
};

Auth.logout = function () {
	Auth.setUser({
		'userType': '',
		'sid': ''
	});

	EventSystem.publish('UserLoggedIn', false);
};

module.exports = {
	setUser : Auth.setUser,
	getUser : Auth.getUser,
	getSID : Auth.getSID,
	isAdmin : Auth.isAdmin,
	isLoggedIn : Auth.isLoggedIn,
	logout : Auth.logout
}