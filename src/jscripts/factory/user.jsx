import Table from '../ui/widget/table'
import {Dialog} from '../ui/widget/dialog'
import {Ajax} from '../utils/ajax'

var User = React.createClass({
	showEditUser () {
		this.setState({
			editUser : true
		})
	},
	getInitialState() {
        return {
        	dataSource : [],
            editUser : false
    	};
    },
	showUser() {
        var cmdList = [
            'show users'
        ];
        Ajax.get({
            'opcode':'show',
            'cmd': cmdList.join('\n')
        }, function(data){    
        	var dataSource = [];        
        	data.UserTable.forEach((item, index) => {
                dataSource.push({
                	'name' : item.name,
                	'type' : item.attribute == 'Captive Portal' ? 'Guest' : 'Employee'
                })
            });
            
            this.setState({
                'dataSource': dataSource
            });
        }.bind(this));
    },
    componentDidMount () {
		this.showUser();
    },
	render () {
    	this.props = {
	        columns : [{
	            name: 'Name',
	            dataIndex: 'name'
	        }, {
	            name: 'Type',
	            dataIndex: 'type'
	        }, {
	            name: 'Action',
	            dataIndex: 'action',
	            render: (text, record) => {
	                let onEditClick = (e) => {
	                    console.log(record);
	                    this.showEditUser();
	                    e.stopPropagation();
	                }
	                let onDeleteClick = (e) => {
	                    console.log(record);
	                    e.stopPropagation();
	                }
	                return (
	                    <div>
	                    <a className="icosolo icon_edit" onClick={onEditClick}></a>
	                    <a className="icosolo icon_delete delete" onClick={onDeleteClick}></a>
	                    </div>
	                );
	            }
	        }],
	        dataSource: [],
	        rowKey: 'name',
	        sortable: true,
	        title: 'Users'
		};
		var editUserDialog;
		if(this.state.editUser) {
			editUserDialog = (<div>
					<Dialog title='edit User' ref='userEditDialog'
					onCancel={this.onCancel} onSubmit={this.onSubmit} 
					items={[{
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
			            }]}
					/>
				</div>);
		}
		return (<div>
				<Table {...this.props} dataSource={this.state.dataSource} />
				{editUserDialog}
			</div>)
	}
});

module.exports = {
	User : User
}