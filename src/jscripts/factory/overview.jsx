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
			<div className="panel no_border">
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

    	let inData = [];
    	let outData = [];
    	let clientData = [];

    	timestamp.forEach((v, i, a) => {
    		inData.push([v, throughputIn[i]]);
    		outData.push([v, throughputOut[i]]);
    		clientData.push([v, clients[i]]);
    	});


    	let throughputConfig = {
    		title: {
    			text: 'Traffic Trends',
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
            	visible: false,
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
    	let clientConfig = {
    		title: {
    			text: null
    		},
    		xAxis: {
    			gridLineWidth: 1,
                type: 'datetime'
            },
            yAxis: {
            	minorTickInterval: 'auto',
            	allowDecimals: false,
            	title: {
            		text: null
            	}
            },
            series: [{
            	name: 'clients',
            	type: 'area',
            	color: '#02a7ec',
                data: clientData
            }]
    	};

        /*return (
        	<div className="panel no_border">
				<div className="medium-6 columns">
					<div>
						<h2 className="title_heading form_heading">
							Throughput (bps)
						</h2>
						<div className="chart_bubble">
							<span className="">
								<div className="chartLabel badge badge-medium badge-blue">{badgeIn}</div>
								<div className="chartLabel">
					                <label className="chartLabelHeader">
					                	<label className="chartUnits">bps</label>
					                	<span className="chartInlineLabel">In</span>
					                </label>
				                </div>
							</span>
							<span className="">
								<div className="chartLabel badge badge-medium badge-orange">{badgeOut}</div>
								<div className="chartLabel">
					                <label className="chartLabelHeader">
					                	<label className="chartUnits">bps</label>
					                	<span className="chartInlineLabel">Out</span>
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
				                	<label className="chartLabelHeader">
				                		<label className="chartUnits">  </label>
				                		<span className="chartInlineLabel">Clients</span>
				                	</label>
				                </div>
				            </span>
			         	</div>
			         	<br/>
                        <ReactHighchart key='client' config={clientConfig}/>
					</div>
				</div>
			</div>
        );*/

        let networksConfig = {
    		
	        title: {
	            text: 'Client Counts',
	            style: {
    				fontSize: '0.875rem'
	            }
	        },
	        xAxis: {
	            categories: ['SSID-1', 'SSID-2', 'SSID-3', 'SSID-4', 'SSID-5']
	        },
	        legend: {
	        	enabled: false
	        },
	        yAxis: {
	            min: 0,
	            allowDecimals: false,
	            title: {
	                text: null
	            }
	        },
	        
	        series: [{
	        	type: 'column',
	            name: 'Clients',
	            color: '#02a7ec',
	            data: [15, 4, 3, 2, 1]
	        }]
    	};

        return (
        	<div className="panel no_border item_panel medium-12">
        		<div className="medium-6 columns">
					<p className="item_title">
						<span className="icon_connectivity icofirst"></span>Internet  
						<span className="green_text right"> Connected</span>
					</p>
					<p className="item_content_text">
						<span className="icon_pointer_down green icofirst"></span> <span>{badgeIn} Kbs</span>
						<span className="divider-v">&nbsp;</span>
						<span className="icon_pointer_up green icofirst"></span> <span>{badgeOut} Kbs</span>  
					</p>

					<p className="item_content_text">
						<span>My Instant <span className="divider-v">|</span> 192.168.10.5 <span className="divider-v">|</span> Ethenet</span>
					</p>
					<ReactHighchart className="item_content_chart" key='throughput' config={throughputConfig}/>
				</div>

				<div className="medium-6 columns">
					<p className="item_title">
						<span className="icon_wifi icofirst"></span>Networks<a> 5</a>
					</p>
					<p className="item_content_text">
						<span>&nbsp;</span>
					</p>
                    <ReactHighchart className="item_content_chart" key='throughput' config={networksConfig}/>
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
    	let self = this;
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
		        name: 'MAC Address',
		        dataIndex: 'mac'
		    }, {
		        name: 'OS',
		        dataIndex: 'os'
		    }, {
		        name: 'ESSID',
		        dataIndex: 'essid'
		    }, {
		        name: 'Access Point',
		        dataIndex: 'accesspoint'
		    }, {
		        name: 'Signal',
		        dataIndex: 'signal'
		    }, {
		        name: 'Speed(mbps)',
		        dataIndex: 'speed'
		    }],
		    rowKey: 'name',
		    sortable: true
		    	
		};
		/*<div className="medium-3 columns"><Table key='networks' {...nTableConfig} dataSource={this.state.networks} /></div>
				<div className="medium-3 columns"><Table key='aps' {...aTableConfig} dataSource={this.state.aps} /></div>*/
        return (
            <div className="summary panel no_border">
            	<h2 className="title_heading form_heading">
            		Clients
				</h2>
				<div className="medium-12 columns"><Table key='clients' {...cTableConfig} dataSource={this.state.clients} /></div>
			</div>
        );
    }
});

const InternetPanel = React.createClass({
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
    		
    		title: {
    			text: 'Traffic Trends',
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
    		<div className="panel no_border item_panel">
				<p className="item_title">
					<span className="icon_connectivity icofirst"></span>Internet  
					<span className="green_text right"> Connected</span>
				</p>
				<p className="item_content_text">
					<span>192.168.10.5<span className="divider-v">|</span>Ethernet</span>
				</p>
				<ReactHighchart className="item_content_chart" key='throughput' config={throughputConfig}/>
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
    	let networksConfig = {
    		
	        title: {
	            text: 'Client Counts',
	            style: {
    				fontSize: '0.875rem'
	            }
	        },
	        xAxis: {
	            categories: ['SSID-11111111111', 'SSID-2', 'SSID-3', 'SSID-4', 'SSID-5', 'SSID-6', 'SSID-7', 'SSID-8', 'SSID-9', 'SSID-10', 'SSID-5', 'SSID-6', 'SSID-7', 'SSID-8', 'SSID-9', 'SSID-10']
	        },
	        legend: {
	        	enabled: false
	        },
	        yAxis: {
	            min: 0,
	            allowDecimals: false,
	            title: {
	                text: null
	            }
	        },
	        
	        series: [{
	        	type: 'column',
	            name: 'Clients',
	            color: '#02a7ec',
	            data: [15, 4, 3, 2, 1, 15, 4, 3, 2, 1, 15, 4, 3, 2, 1]
	        }]
    	};

        return (
			<div className="panel no_border item_panel">
				<p className="item_title">
					<span className="icon_wifi icofirst"></span>Networks<a> 5</a>
				</p>
				<p className="item_content_text">
					<span className="icon_pointer_down green icofirst"></span> <span>255 Kbs</span>
					<span className="divider-v">&nbsp;</span>
					<span className="icon_pointer_up green icofirst"></span> <span>255 Kbs</span>  
				</p>
                <ReactHighchart className="item_content_chart" key='throughput' config={networksConfig}/>
			</div>
        );
    }
});

const ClientsPanel = React.createClass({
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
    	let clientsConfig = {
    		title: {
    			text: 'Traffic Top 5',
    			style: {
    				fontSize: '0.875rem'
	            }
    		},
    		xAxis: {
	            categories: ['USER-1', 'USER-2', 'USER-3', 'USER-4', 'USER-5']
	        },
	        legend: {
	        	enabled: false
	        },
            yAxis: {
            	visible: false,
            	max: 155,
            	minorTickInterval: 'auto',
            	allowDecimals: false,
            	title: {
            		text: null
            	}
            },
            tooltip: {
	            shared: true,
	            valueSuffix: ' bps'
	        },
	        
            series: [{
	            name: 'Traffic',
	            type: 'bar',
	            color: '#02a7ec',
	            data: [155, 94, 73, 42, 11]
	        }]
    	};

        return (
			<div className="panel no_border item_panel">
				<p className="item_title">
					<span className="icon_phone icofirst"></span> Clients <a> 25</a>
				</p>
				<p className="item_content_text">
					<span>Max usage: </span><span>USER-1<span className="divider-v">|</span>155 bps</span>
				</p>
                <ReactHighchart className="item_content_chart" key='throughput' config={clientsConfig}/>
			</div>
        );
    }
});

const APsPanel = React.createClass({
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
    	let apsConfig = {
    		title: {
    			text: 'AP Status',
    			style: {
    				fontSize: '0.875rem'
	            }
    		},
    		xAxis: {
    			visible: false,
	            categories: ['AP Status']
	        },
            yAxis: {
            	visible: false,
            	max: 6,
            	minorTickInterval: 'auto',
            	allowDecimals: false,
            	title: {
            		text: null
            	}
            },
            tooltip: {
	            shared: true,
	            valueSuffix: ' '
	        },
	        legend: {
	        	//enabled: false
	        },
	        plotOptions: {
	            series: {
	                stacking: 'normal',
	                dataLabels: {
	                    enabled: true,
	                    color: '#FFF'
	                }
	            }
	        },
            series: [{
	            name: 'Down',
	            type: 'bar',
	            color: '#FF0000',
	            data: [1]
	        }, {
	            name: 'Up',
	            type: 'bar',
	            color: '#00CC00',
	            data: [5]
	        }]
    	};

        return (
			<div className="panel no_border item_panel">
				<p className="item_title">
					<span className="icon_ap icofirst"></span> Access Points <a> 6</a>
				</p>
				<p className="item_content_text">
					<span className="icon_alert icofirst red"></span>
					<span className="icon_empty red">1</span><span> AP (ac:a3:1e...) is down</span>
				</p>
                <ReactHighchart className="item_content_chart" key='throughput' config={apsConfig}/>
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
            'show summary'
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

	        	this.setState({
	        		info: data.showsummary,
	        		chart: chartData,
	        		table: tableData
	        	});
        	}
        	
        }.bind(this));
    },

    componentWillMount () {
    	
		
    },

    componentWillUnmount () {
		
    },

	componentDidMount () {
	    console.log('overview----componentDidMount');
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
  		console.log('overview----componentWillReceiveProps');
  	},

  	componentDidUpdate () {
    	console.log('overview----componentDidUpdate');
  	},

  	/*render () {
  		//<SummaryTable {...this.state.table} />
  		//<SummaryInfo {...this.state.info} />
		return (
			<div className="overview-container">
				<SummaryChart {...this.state.chart} />
				<SummaryChart1 {...this.state.chart} />
			</div>
		);
	}*/
	render () {
		return (
			<div className="overview-container">
				<div className="row">
					<InternetPanel {...this.state.chart} />
					<NetworksPanel {...this.state.chart} />
				</div>
				<div className="row">
					<ClientsPanel {...this.state.chart} />
					<APsPanel {...this.state.chart} />
				</div>
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