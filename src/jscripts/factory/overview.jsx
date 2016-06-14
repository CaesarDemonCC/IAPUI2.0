import Table from '../ui/widget/table'
import {Ajax} from '../utils/ajax'
import {getUser} from '../utils/auth'

const SummaryInfo = React.createClass({
	getInitialState() {
	    return {
	        data: {}  
	    };
	},
	
	getDefaultProps() {
	    return {
	        labels: [{
	    		label: 'Name',
	    		dataIndex: 'name'
	    	}, {
	    		label: 'Country Code',
	    		dataIndex: 'domain'
	    	}, {
	    		label: 'Virtual Controller IP',
	    		dataIndex: 'vcipaddress'
	    	}, {
	    		label: 'VC DNS',
	    		dataIndex: 'vcdns'
	    	}, {
	    		label: 'IP Mode',
	    		dataIndex: 'ipmode'
	    	}, {
	    		label: 'Management',
	    		dataIndex: 'managedvia'
	    	}, {
	    		label: 'Master',
	    		dataIndex: 'masteripaddress*'
	    	}, {
	    		label: 'Uplink Type',
	    		dataIndex: 'uplinktype'
	    	}, {
	    		label: 'Uplink Status',
	    		dataIndex: 'uplinkstatus'
	    	}],
	    	data:{}  
	    };
	},
	componentWillReceiveProps (nextProps) {
      	this.setState({ data: nextProps });
  	}, 
	getColumnClass(len, i) {
		let large = 3;
		let medium = 4;

		if (len <= 3) {
			large = 12/len;
			medium = 12/len;
		} else {
			if (len % 4 != 0 && (i == len - 1)) {
				large = 12 - (len % 4 - 1) * 3;
			}
			if (len % 3 != 0 && (i == len - 1)) {
				medium = 12 - (len % 3 - 1) * 4;
			}
		}

		return 'large-' + large + ' medium-' + medium + ' columns';
	},
    getBody(data) {
    	let body = [];
    	let labels = this.props.labels;
    	labels.map((c, i) => {
    		let label = c.label;
    		let v = data[c.dataIndex] || '';
    		body.push(<div className={this.getColumnClass(labels.length, i)}><div className="label">{label}</div><div className="value">{v}</div></div>);
    	});

    	return body;
    },
    render() {
        return (
			<div className="panel">
				<h2 className="title_heading form_heading">
					Info
				</h2>
				<div className="info_panel">
					{this.getBody(this.state.data)}
				</div>
			</div>
        );
    }
});

const SummaryChart = React.createClass({
    render() {
        return (
        	<div className="panel">
				<div className="medium-6 columns">
					<div>
						<h2 className="title_heading form_heading">
							Throughput (bps)
						</h2>
						<div className="chart_bubble">
							<span className="">
								<div className="chartLabel badge badge-medium badge-blue">0</div>
								<div className="chartLabel">
					                <label className="chartLabelHeader" style={{display:'inline-table'}}>
					                	<label style={{display:'table-row'}} className="chartUnits">bps</label>
					                	<span className="chartInlineLabel ng-binding" style={{display:'table-row'}}>In</span>
					                </label>
				                </div>
							</span>
							<span className="">
								<div className="chartLabel badge badge-medium badge-orange">0</div>
								<div className="chartLabel">
					                <label className="chartLabelHeader" style={{display:'inline-table'}}>
					                	<label style={{display:'table-row'}} className="chartUnits">bps</label>
					                	<span className="chartInlineLabel ng-binding" style={{display:'table-row'}}>Out</span>
					                </label>
				                </div>
							</span>
						</div>
					</div>
				</div>
				<div className="medium-6 columns">
					<div>
						<h2 className="title_heading form_heading">
							Clients Count
						</h2>
						<div className="chart_bubble">
				            <span>
				                <div className="chartLabel badge badge-medium badge-blue">0</div>
				                <div className="chartLabel">
				                	<label className="chartLabelHeader" style={{display:'inline-table'}}>
				                		<label style={{display:'table-row'}} className="chartUnits">  </label>
				                		<span className="chartInlineLabel ng-binding" style={{display:'table-row'}}>Clients</span>
				                	</label>
				                </div>
				            </span>
			         	</div>
					</div>
				</div>
			</div>
        );
    }
});

const SummaryTable = React.createClass({
	getInitialState() {
	    return {
	        networks: [],
	        aps: [],
	        clients: []  
	    };
	},
	componentWillReceiveProps (nextProps) {
      	this.setState(nextProps);
  	},
    render() {
    	let nTableConfig = {
			columns : [{
		        name: 'Name',
		        dataIndex: 'essid'
		    }, {
		        name: 'Clients',
		        dataIndex: 'clients'
		    }],
		    rowKey: 'essid',
		    sortable: true,
		    title: 'Networks'
		};
		let aTableConfig = {
			columns : [{
		        name: 'Name',
		        dataIndex: 'name'
		    }, {
		        name: 'Clients',
		        dataIndex: 'clients'
		    }],
		    rowKey: 'name',
		    sortable: true,
		    title: 'Access Points'
		};
		let cTableConfig = {
			columns : [{
		        name: 'Name',
		        dataIndex: 'name'
		    }, {
		        name: 'IP Address',
		        dataIndex: 'ip'
		    }, {
		        name: 'ESSID',
		        dataIndex: 'ssid'
		    }, {
		        name: 'Access Point',
		        dataIndex: 'ap'
		    }],
		    rowKey: 'name',
		    sortable: true,
		    title: 'Clients'
		};
        return (
            <div className="panel">
				<div className="medium-3 columns"><Table {...nTableConfig} dataSource={this.state.networks} /></div>
				<div className="medium-3 columns"><Table {...aTableConfig} dataSource={this.state.aps} /></div>
				<div className="medium-6 columns"><Table {...cTableConfig} dataSource={this.state.clients} /></div>
			</div>
        );
    }
});

const Overview = React.createClass({
	getInitialState() {
        return {
    		info: {},
    		chart: {
    			throughput: 0,
    			clients: 0
    		},
    		table: {
    			neworks: {},
    			aps: {},
    			clients: {}
    		}
    	};
    },

    parseChartData(chartData) {
    	return chartData;
    },
    parseTableData(tableData) {
    	let res = {};

    	for (let key in tableData) {
    		if (key.match(/^\d+Network/)) {
    			res.networks = tableData[key];
    		}
    		if (key.match(/^\d+AccessPoint/)) {
    			res.aps = tableData[key];
    		}
    		if (key.match(/^\d+Client/)) {
    			res.clients = tableData[key];
    		}
    	}

    	return res;
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
        	console.log(data);   

        	let chartData = this.parseChartData(data.showstatsglobal);
        	let tableData = this.parseTableData(data.showsummary);

        	this.setState({
        		info: data.showsummary,
        		chart: chartData,
        		table: tableData
        	});
        	
        }.bind(this));
    },

    componentWillMount () {
		this.showSummary();
    },

	componentDidMount () {
	    console.log('componentDidMount');
	},

  	componentWillReceiveProps (nextProps) {
  		console.log('componentWillReceiveProps');
  	},

  	componentDidUpdate () {
    	console.log('componentDidUpdate');
  	},

  	render () {
		return (
			<div>
				<SummaryChart {...this.state.chart} />
				<SummaryInfo {...this.state.info} />
				<SummaryTable {...this.state.table} />
			</div>
		);
	}
}) 

module.exports = {
	Overview: Overview,
	SummaryInfo: SummaryInfo,
	SummaryChart: SummaryChart,
	SummaryTable: SummaryTable
}