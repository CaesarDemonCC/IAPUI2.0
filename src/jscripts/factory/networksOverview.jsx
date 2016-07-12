import Table from '../ui/widget/table'
import {Ajax} from '../utils/ajax'
import {getUser} from '../utils/auth'
import ReactHighchart from '../ui/widget/reactHighchart'

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
    	let totalSSID = this.state.networks.length;

    	let self = this;
    	let nTableConfig = {
			columns : [{
		        name: 'Name',
		        dataIndex: 'essid'
		    }, {
		        name: 'Clients',
		        dataIndex: 'clients'
		    }, {
		        name: 'Band',
		        dataIndex: 'band'
		    }, {
		        name: 'Active',
		        dataIndex: 'active'
		    }],
		    rowKey: 'essid',
		    sortable: false
		};
        return (
			<div className="panel no_border item_panel medium-12 columns">
				<p className="item_title">
					Networks<a> {totalSSID}</a>
				</p>
				<Table key='networks' {...nTableConfig} dataSource={this.state.networks} />
			</div>
        );
    }
});

const NetworksPanel = React.createClass({
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

    	let inData = [];
    	let outData = [];
    	let clientData = [];

    	timestamp.forEach((v, i, a) => {
    		inData.push([v, throughputIn[i]]);
    		outData.push([v, throughputOut[i]]);
    		clientData.push([v, clients[i]]);
    	});

    	let throughputConfig = {
    		chart: {
    			height: 240
    		},
    		title: {
    			text: 'Throughput Trends',
    			style: {
    				fontSize: '0.875rem'
    			}
    		},
    		xAxis: {
    			//visible: false,
    			//gridLineWidth: 1,
    			type: 'datetime'
            },
            yAxis: {
            	//visible: false,
            	//minorTickInterval: 'auto',
            	allowDecimals: false,
            	title: {
            		text: null
            	}
            },
            tooltip: {
	            shared: true,
	            valueSuffix: ' bps'
	        },
	        plotOptions: {
        		area: {
	                //fillOpacity: 0.5,
	                lineWidth: 1,
	                marker: {
	                    enabled: false,
	                    symbol: 'circle',
	                    radius: 1,
	                    states: {
	                        hover: {
	                            enabled: false
	                        }
	                    }
	                }
	            }
	        },
            series: [{
            	name: 'In',
            	type: 'area',
            	color: '#02a7ec',
                data: inData
            }, {
            	name: 'Out',
            	type: 'area',
            	color: '#F5831E',
                data: outData
            }]
    	};

        return (
			<div className="panel no_border item_panel medium-6 columns">
				<p className="item_title">
					Throughput
				</p>
				<p className="item_content_text">
					<span className="icon_pointer_down green icofirst"></span> <span>{badgeIn} Kbs</span>
					<span className="divider-v">&nbsp;</span>
					<span className="icon_pointer_up green icofirst"></span> <span>{badgeOut} Kbs</span>  
				</p>
				<ReactHighchart className="item_content_chart" key='throughput' config={throughputConfig}/>
			</div>
        );
    }
});

const SpeedAndSignalPanel = React.createClass({
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
    	
        return (
			<div className="panel no_border item_panel medium-6 columns">
				<p className="item_title">
					RF Dashboard
				</p>
				<div className='item_content_text'>
					<table className='data responsive'>
						<tr>
							<th>Clients</th>
							<th>Speed</th>
							<th>Signal</th>
						</tr>

						<tr>
							<td>All clients</td>
							<td>Good</td>
							<td>Good</td>
						</tr>
						<tbody className="item_content_chart">
							<tr>
								<th>Access Points</th>
								<th>Noise</th>
								<th>Errors</th>
							</tr>

							<tr>
								<td>ac:a3:1e:cd:7f:9a</td>
								<td>Good</td>
								<td>Good</td>
							</tr>
							<tr>
								<td>ac:a3:1e:cd:7f:9a</td>
								<td>Good</td>
								<td>Good</td>
							</tr>
							<tr>
								<td>ac:a3:1e:cd:7f:9a</td>
								<td>Good</td>
								<td>Good</td>
							</tr>
							<tr>
								<td>ac:a3:1e:cd:7f:9a</td>
								<td>Good</td>
								<td>Good</td>
							</tr>
						</tbody>
					</table> 
				</div>
			</div>
        );
    }
});


const Overview = React.createClass({
	timer: null,
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
    		},
    		testData: null
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
        		statsData.timestamp.push(v['timestamp'] * 1000);
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

    parseNetworkData(networksData) {
    	let res = [];

    	if (networksData['Networks']) {
    		res.networks = networksData['Networks'];
    	} 
    	// test data
    	let total = 10;
    	let datas = [];

    	for (let i = 0; i < total; i++) {

    		let clientCounts = parseInt(Math.random() * (25 - i) + 1);
    		let ssid = 'SSID-' + (i + 1);
    		let band = ['all', '5', '2.4'][Math.random() * 3 | 0];

    		let o = {
    			active:"Yes",
    			authenticationmethod:"None",
				band: band,
				clients: clientCounts,
				coding:"Default",
				essid: ssid,
				ipassignment:"Default VLAN",
				keymanagement:"WPA2-AES",
				profilename:"test-swsun",
				status:"Enabled",
				type:"employee",
				zone:"-"
    		};

    		datas.push(o);
    	}
    	res.networks = datas;

    	return res;
    },

    getTestData(data) {
    	let stats = data['SwarmGlobalStats'];
    	let res = [];

    	for (let i = 0; i < stats.length; i++) {
    		let o = {
    			'clients': parseInt(Math.random() * 20) + 15,
    			'frames[in](fps)': "1",
				'frames[out](fps)': "0",
				'throughput[in](bps)': parseInt(Math.random() * 500) + 500,
				'throughput[out](bps)': parseInt(Math.random() * 500) + 500,
				'timestamp': stats[i]['timestamp']
    		};
    		res.push(o);
    	}

    	this.state.testData = res;

    	return res;
    },

    createNewPoint(data) {
    	let stats = data['SwarmGlobalStats'];

		let res = {
			'clients': parseInt(Math.random() * 20) + 15,
			'frames[in](fps)': "1",
			'frames[out](fps)': "0",
			'throughput[in](bps)': parseInt(Math.random() * 500) + 500,
			'throughput[out](bps)': parseInt(Math.random() * 500) + 500,
			'timestamp': stats[0]['timestamp']
		};

    	return res;
    },

    showSummary() {
        const cmdList = [
            'show stats global',
            'show summary',
            'show network'
        ];
        Ajax.get({
            'opcode':'show',
            'cmd': cmdList, 
            'refresh': true
        }, function(data){
        	if (this.isMounted()) {
        		// test data
	        	data.showstatsglobal.SwarmGlobalStats = this.props.testData ? this.props.testData : this.getTestData(data.showstatsglobal);
	        	data.showstatsglobal.SwarmGlobalStats[0] = this.createNewPoint(data.showstatsglobal);

	        	let chartData = this.parseChartData(data.showstatsglobal);
	        	let tableData = this.parseTableData(data.showsummary);
	        	let networksData = this.parseNetworkData(data.shownetwork);

	        	this.setState({
	        		info: data.showsummary,
	        		chart: chartData,
	        		table: tableData,
	        		networks: networksData
	        	});
        	}
        	
        }.bind(this));
    },

    componentWillMount () {
    	
		
    },

    componentWillUnmount () {
		
    },

	componentDidMount () {
	    
	    let self = this;
	    this.showSummary();

	    if (this.timer) {
	    	clearInterval(this.timer);
	    	this.timer = null;
	    }

	    this.timer = setInterval(function () {
			self.showSummary();
		}, 30000)
	},

  	componentWillReceiveProps (nextProps) {
  		
  	},

  	componentDidUpdate () {
    	
  	},

	render () {
		return (
			<div className="overview-networks-container">
				<div className="row">
					<NetworksPanel {...this.state.chart} />
					<SpeedAndSignalPanel {...this.state.chart} />
				</div>
				<div className="row">
					<SummaryTable {...this.state.networks} />
				</div>
			</div>
		);
	}
}) 

module.exports = {
	NetworksOverview: Overview
}