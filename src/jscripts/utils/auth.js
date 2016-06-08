import {getCookie, setCookie} from './cookie'

var Auth = {
	user : null
};

Auth.setUser = function (user){
	Auth.user = user;
	setCookie('userType', user.role);
	setCookie('sid', user.sid);
};

Auth.getUser = function () {
	return Auth.user;
};

Auth.getSID = function (argument) {
	return Auth.getUser() ? Auth.getUser().sid : null;
};

Auth.isAdmin = function () {
	return Auth.getUser().role === 'Admin';
};

Auth.isLoggedIn = function () {
	return Auth.getUser() == null ? false : true;
};

Auth.logout = function () {
	Auth.setUser(null);
};

module.exports = {
	setUser : Auth.setUser,
	getUser : Auth.getUser,
	getSID : Auth.getSID,
	isAdmin : Auth.isAdmin,
	isLoggedIn : Auth.isLoggedIn,
	logout : Auth.logout
}