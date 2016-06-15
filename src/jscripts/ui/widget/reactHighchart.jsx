var ReactHighchart = React.createClass({
    componentDidMount: function () {
        var defaultConfig = {
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

        var chart = new Highcharts['Chart']({
            ...config,
            chart: {
                renderTo: this.refs.chart
            }
        })  
    },
    render: function () {
        return (<div ref='chart'></div>);
    }
})

module.exports = ReactHighchart;