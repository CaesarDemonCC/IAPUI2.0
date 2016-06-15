//var panel = require('./panel');
import {PanelContent} from './panel'
import {Ajax} from '../../utils/ajax'

var TabControls = React.createClass({
    goToTab : function (index) {
        this.props.clickHandler.call(this, index);
    },
    render: function () {
        var self = this;
        var tabCtrls = this.props.tabCtrls.map(function (tabCtrl, index) {
            return <li key={index} className={index == self.props.currentTab ? 'current' : ''} onClick={self.goToTab.bind(self, index)}><a>{tabCtrl}</a></li>;
        })
        return (
            <ul className='tabcontrols'>
                {tabCtrls}
            </ul>
        )
    }
})

var Tab = React.createClass({

    getInitialState: function () {
        return {
            currentTab: 0
        }
    },

    goToTab: function (index) {
        var currentTabData = this.refs.panelContent.getData();
        this.props.tabsData[this.state.currentTab] = currentTabData;
        this.setState({currentTab: index});
    },

    onSubmit: function (e) {
        this.props.onSubmit(e)
    },

    onCancel: function (e) {
        this.props.onCancel(e)
    },

    componentDidMount: function() {
        var cmdList= [];
        this.props.tabsConfig.forEach((prop) => {
            if ($.isArray(prop.showCmd)) {
                prop.showCmd.forEach((cmd)=>{
                    cmdList.push(cmd);
                });
            } else {
                cmdList.push(prop.showCmd);
            }
        });
        Ajax.get({
            'opcode':'show',
            'cmd': cmdList
        }, function(data){
            if (this.props.parseData) {
                this.props.parseData(data);
            }
        }.bind(this));  
    },

    render: function () {
        var tabCtrls = [],
            content = null,
            handlers = [];

        var tabsConfig = this.props.tabsConfig;
        tabsConfig.forEach(function (tab) {
            tabCtrls.push(tab.title);
            handlers.push(tab.handler || function () {})
        })

        content = <PanelContent ref='panelContent' key={this.state.currentTab} tabData={this.props.tabsData[this.state.currentTab]} items={tabsConfig[this.state.currentTab].items} handler={tabsConfig[this.state.currentTab].handler}/>;

        return (
            <div className='tabs responsive wizard'>
                <TabControls tabCtrls={tabCtrls} clickHandler={this.goToTab} currentTab={this.state.currentTab}/>
                <div className='panel-content'>
                    {content}
                </div>
                <div className='wizard-footer'>
                    <button className='button medium-1' onClick={this.onSubmit}>OK</button>
                    <button className='button white-button medium-1' onClick={this.onCancel}>Cancel</button>
                </div>
            </div>
        )
    }
});

module.exports = {
    Tab: Tab
}