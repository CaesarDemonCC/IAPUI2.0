var ReactHighchart = React.createClass({
    componentWillReceiveProps (nextProps) {
        /*var chart = new Highcharts['Chart']({
            ...nextProps.config,
            credits: {
                enabled: false
            },
            chart: {
                renderTo: this.refs.chart
            }
        });*/

        if (this.chart) {
            
            var series = this.chart.series;
            var configS = nextProps.config.series;
            if (series && configS) {
                series.forEach(function (v, i, a) {
                    configS.forEach(function (cv, ci, ca) {
                        if (v.name == cv.name) {
                            v.setData(cv.data);
                        }
                    });
                    
                });
            }
            
        }
    },
    componentDidMount: function () {
        var defaultConfig = {
            credits: {
                enabled: false
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 454.4]
            }]
        };
        var config = {
            ...defaultConfig,
            ...this.props.config
        }

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        this.chart = new Highcharts['Chart']({
            ...config,
            chart: {
                plotBorderWidth: 1,
                renderTo: this.refs.chart
            }
        })  
    },
    render: function () {
        return (<div ref='chart'></div>);
    }
})

module.exports = ReactHighchart;