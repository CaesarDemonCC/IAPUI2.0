
var Admin = {
	getTabConfig () {
		return {
            title: 'Admin',
            showCmd : 'show mgmt-user',
            items: [{
                ref: 'name',
                label: 'Username'
            }, {
                ref: 'password',
                label: 'Password',
                type : 'password'
            }, {
                ref: 're-password',
                label: 'Retype',
                type : 'password'
            }],
            handler: function () {

            }
        };
	},
	parseData (data) {
		var adminData = {};
		if (data['showmgmt-user'].ManagementUserTable) {
            $.each(data['showmgmt-user'].ManagementUserTable, (index, item) => {
                if (item.type === 'Admin') {
                    adminData = item;
                }
            });
        }
        return adminData;
	}
};

module.exports = {
	Admin : Admin
}