import Table from '../ui/widget/table'
import {Ajax} from '../utils/ajax'
import {getUser} from '../utils/auth'
import ReactHighchart from '../ui/widget/reactHighchart'

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
    		body.push(<div key={i} className={this.getColumnClass(labels.length, i)}><div className="label">{label}</div><div className="value">{v}</div></div>);
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
	getInitialState() {
	    return {
	    	timestamp: [],
	        throughputIn: [],
            throughputOut: [],
			clients: [] 
	    };
	},
	getDefaultProps() {
	    return {
	    	
	    };
	},
	componentWillReceiveProps (nextProps) {
      	this.setState(nextProps);
  	},

    render() {
    	let throughputIn = this.state.throughputIn;
    	let throughputOut = this.state.throughputOut;
    	let clients = this.state.clients;
    	let timestamp = this.state.timestamp;

    	let badgeIn = throughputIn.length > 0 ? throughputIn[throughputIn.length - 1] : 0;
    	let badgeOut = throughputOut.length > 0 ? throughputOut[throughputOut.length - 1] : 0;
    	let badgeClient = clients.length > 0 ? clients[clients.length - 1] : 0;


    	let throughputConfig = {
    		title: {
    			text: null
    		},
    		xAxis: {
                categories: timestamp
            },
            yAxis: {
            	title: {
            		text: null
            	}
            },
            series: [{
            	name: 'In',
            	type: 'areaspline',
            	color: '#02a7ec',
                data: throughputIn
            }, {
            	name: 'Out',
            	type: 'areaspline',
            	color: '#F5831E',
                data: throughputOut
            }]
    	};
    	let clientConfig = {
    		title: {
    			text: null
    		},
    		xAxis: {
                categories: timestamp
            },
            yAxis: {
            	title: {
            		text: null
            	}
            },
            series: [{
            	name: 'clients',
            	type: 'areaspline',
            	color: '#02a7ec',
                data: clients
            }]
    	};

        return (
        	<div className="panel">
				<div className="medium-6 columns">
					<div>
						<h2 className="title_heading form_heading">
							Throughput (bps)
						</h2>
						<div className="chart_bubble">
							<span className="">
								<div className="chartLabel badge badge-medium badge-blue">{badgeIn}</div>
								<div className="chartLabel">
					                <label className="chartLabelHeader" style={{display:'inline-table'}}>
					                	<label style={{display:'table-row'}} className="chartUnits">bps</label>
					                	<span className="chartInlineLabel ng-binding" style={{display:'table-row'}}>In</span>
					                </label>
				                </div>
							</span>
							<span className="">
								<div className="chartLabel badge badge-medium badge-orange">{badgeOut}</div>
								<div className="chartLabel">
					                <label className="chartLabelHeader" style={{display:'inline-table'}}>
					                	<label style={{display:'table-row'}} className="chartUnits">bps</label>
					                	<span className="chartInlineLabel ng-binding" style={{display:'table-row'}}>Out</span>
					                </label>
				                </div>
							</span>
						</div>
						<br/>
                        <ReactHighchart key='throughput' config={throughputConfig}/>
					</div>
				</div>
				<div className="medium-6 columns">
					<div>
						<h2 className="title_heading form_heading">
							Clients Count
						</h2>
						<div className="chart_bubble">
				            <span>
				                <div className="chartLabel badge badge-medium badge-blue">{badgeClient}</div>
				                <div className="chartLabel">
				                	<label className="chartLabelHeader" style={{display:'inline-table'}}>
				                		<label style={{display:'table-row'}} className="chartUnits">  </label>
				                		<span className="chartInlineLabel ng-binding" style={{display:'table-row'}}>Clients</span>
				                	</label>
				                </div>
				            </span>
			         	</div>
			         	<br/>
                        <ReactHighchart key='client' config={clientConfig}/>
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
		        dataIndex: 'ipaddress'
		    }, {
		        name: 'ESSID',
		        dataIndex: 'essid'
		    }, {
		        name: 'Access Point',
		        dataIndex: 'accesspoint'
		    }],
		    rowKey: 'name',
		    sortable: true,
		    title: 'Clients'
		};
        return (
            <div className="summary panel">
            	<h2 className="title_heading form_heading">
					Summary
				</h2>
				<div className="medium-3 columns"><Table key='networks' {...nTableConfig} dataSource={this.state.networks} /></div>
				<div className="medium-3 columns"><Table key='aps' {...aTableConfig} dataSource={this.state.aps} /></div>
				<div className="medium-6 columns"><Table key='clients' {...cTableConfig} dataSource={this.state.clients} /></div>
			</div>
        );
    }
});

const Overview = React.createClass({
	getInitialState() {
        return {
    		info: {},
    		chart: {
    			timestamp: [],
    			throughputIn: [],
                throughputOut: [],
    			clients: []
    		},
    		table: {
    			neworks: {},
    			aps: {},
    			clients: {}
    		}
    	};
    },

    formatTime(content, fullFormat) {
	    var result = content;
	    var timest = parseInt(content, 10);
	    if (!isNaN(timest)) {
	        var d = new Date(timest * 1000);
	        var h = d.getHours();
	        var m = d.getMinutes();
	        var s = d.getSeconds();
	        if (h < 10) {
	            h = '0' + h;
	        }
	        if (s < 10) {
	            s = '0' + s;
	        }
	        if (m < 10) {
	            m = '0' + m;
	        }
	        result = h + ':' + m + ':' + s;
	        if (fullFormat) {
	            var date = d.getDate(),
	                mon = d.getMonth() + 1,
	                year = d.getFullYear();
	            result = year + '/' + mon + '/' + date + ' ' + result;
	        }
	    }
	    return result;
	},

    parseChartData(chartData) {
        let statsData = {
        	timestamp: [],
            throughputIn: [],
            throughputOut: [],
            clients: []
        };
        if (chartData && $.isArray(chartData['SwarmGlobalStats'])) {
        	let datas = chartData['SwarmGlobalStats'];

        	datas.forEach((v, i) => {
        		statsData.timestamp.push(this.formatTime(v['timestamp']));
        		statsData.throughputIn.push(v['throughput[in](bps)'] * 1);
        		statsData.throughputOut.push(v['throughput[out](bps)'] * 1);
        		statsData.clients.push(v['clients'] * 1);
        	});

        	statsData.timestamp.reverse();
        	statsData.throughputIn.reverse();
        	statsData.throughputOut.reverse();
        	statsData.clients.reverse();
        }

        return statsData;
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

    getTestData(data) {
    	let stats = data['SwarmGlobalStats'];
    	let res = [];

    	for (let i = 0; i < stats.length; i++) {
    		let o = {
    			'clients': parseInt(Math.random() * 50) + 5,
    			'frames[in](fps)': "1",
				'frames[out](fps)': "0",
				'throughput[in](bps)': parseInt(Math.random() * 1000) + 100,
				'throughput[out](bps)': parseInt(Math.random() * 2000) + 50,
				'timestamp': stats[i]['timestamp']
    		};
    		res.push(o);
    	}

    	return res;
    },

    showSummary() {
        const cmdList = [
            'show stats global',
            'show summary'
        ];
        Ajax.get({
            'opcode':'show',
            'cmd': cmdList
        }, function(data){    
        	console.log(data);

        	// test data
        	data.showstatsglobal.SwarmGlobalStats = this.getTestData(data.showstatsglobal);

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
		let self = this;

		setInterval(function () {
			self.showSummary();
		}, 30000)
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