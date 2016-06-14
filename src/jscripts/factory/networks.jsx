import {Ajax} from '../utils/ajax'
import Table from '../ui/widget/table'
import {getUser} from '../utils/auth'

var Networks = React.createClass({
	getInitialState() {
        return {
        	dataSource : []
    	};
    },
	showSummary() {
        var cmdList = [
            'show stats global',
            'show summary'
        ];
        Ajax.get({
            'opcode':'show',
            'cmd': cmdList.join('\n'),
            'ip' : '127.0.0.1',
            'sid' : getUser().sid
        }, function(data){    
        	var dataSource = [];        
        	$.each(data.showsummary, (key, value) => {
                if(key.indexOf('Network') > 0) {
                    value.forEach((network, index) =>{
                        dataSource.push({
                            'name' : network.essid,
                            'clients' : network.clients
                        });
                    });
                }
            });
            
            this.setState({
                'dataSource': dataSource
            });
        }.bind(this));
    },
    componentWillMount () {
		this.showSummary();
    },
    render () {
    	var ssidProps = {
	            columns : [{
	                name: 'Name',
	                dataIndex: 'name'
	            }, {
	                name: 'Clients',
	                dataIndex: 'clients'
	            }, {
	                name: 'Action',
	                dataIndex: 'action',
	                render: (text, record) => {
	                    let onEditClick = (e) => {
	                        console.log(record);
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
	            title: 'Networks'
	    	};
    	return <Table {...ssidProps} dataSource = {this.state.dataSource}/>
	}
});

module.exports = {
	Networks : Networks
}