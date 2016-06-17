import {Ajax} from '../utils/ajax'
import Table from '../ui/widget/table'

var Networks = React.createClass({
	newHandler () {
	    this.props.history.replace('/network-edit/ ');
	},
	getInitialState() {
        return {
        	dataSource : []
    	};
    },
	showSummary() {
        var cmdList = [
            'show summary'
        ];
        Ajax.get({
            'opcode':'show',
            'cmd': cmdList
        }, function(data){    
        	var dataSource = [];        
        	$.each(data, (key, value) => {
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
    componentDidMount () {
		this.showSummary();
    },
    render () {
    	var props = {
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
	                var editTO = {
	                	pathname:"network-edit/" + record.name
	            	}
	            	var deleteHandler = () =>{
	            		Ajax.post({
	            			opcode : 'config',
	            			cmd : 'no wlan ssid-profile ' + record.name
	            		});
	            		this.showSummary();
	            	}; 
	                return (
	                    <div>
	                    <ReactRouter.Link className="icosolo icon_edit" to={editTO}/>
	                    <a className="icosolo icon_delete delete" onClick={deleteHandler}/>
	                    </div>
	                );
	            }
	        }],
	        dataSource: [],
	        rowKey: 'name',
	        sortable: true,
	        title: 'Networks',
	        newHandler: this.newHandler
		};
    	return (
            <div className="panel no_border">
                <h2 className='title_heading form_heading'>Networks</h2>
                <Table {...props} dataSource = {this.state.dataSource}/>
            </div>
        )
	}
});

module.exports = {
	Networks : Networks
}