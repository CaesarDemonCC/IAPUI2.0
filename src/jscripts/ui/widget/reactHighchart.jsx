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
            } 
        };

        var chartConfig = {
            height: 230,
            backgroundColor: 'transparent',
            renderTo: this.refs.chart,
            ...this.props.config.chart
        };

        var config = {
            ...defaultConfig,
            ...this.props.config,
            chart : chartConfig
        };

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        this.chart = new Highcharts['Chart']({...config});  
    },
    render: function () {
        return (<div ref='chart' className={this.props.className}></div>);
    }
})

module.exports = ReactHighchart;