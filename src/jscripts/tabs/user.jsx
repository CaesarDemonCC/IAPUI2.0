var User = {
	originData: {},
	getTabConfig () {
		return {
            title: 'Admin',
            showCmd : 'show mgmt-user',
            items: [{
	                ref: 'name',
	                label: 'Username'
	            }, {
	                ref: 'password',
	                type: 'password',
	                label: 'Password'
	            }, {
	                ref: 're-password',
	                type: 'password',
	                label: 'Retype'
	            }, {
	            	ref: 'type',
	            	lable: 'Type',
	            	type: 'select',
	            	options:[
	            		'Guest',
	            		'Employee'
	            	]
	            }],
            handler: function () {

            }
        };
	},
	parseData (data) {
        var adminData = {};
        if (data['showmgmt-user'].ManagementUserTable) {
            $.each(data['showmgmt-user'].ManagementUserTable, (index, item)=> {
                if (item.type === 'Admin') {
                    this.originData = item;
                }
            });
        }
        return this.originData;
    },
    getCMD (changeData) {
        var cmd = '';
        if (changeData) {
            if (changeData['name'] !== this.originData['name'] || changeData['password'] !== this.originData['password']) {
                cmd += 'hash-mgmt-user ' + changeData['name'];
                if (changeData['password'] !== this.originData['password']) {
                    cmd += ' password clear ' + changeData['password'] + '\n';
                } else {
                    cmd += ' password hash ' + changeData['password'] + '\n';
                }
            }
        }
        return cmd;
    }
}

module.exports = User;