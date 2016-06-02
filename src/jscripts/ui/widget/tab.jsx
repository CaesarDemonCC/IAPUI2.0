//var panel = require('./panel');
import {PanelContent} from './panel'

var TabControls = React.createClass({
    goToTab : function (index) {
        this.props.clickHandler.call(this, index);
    },
    render: function () {
        var self = this;
        var tabCtrls = this.props.tabCtrls.map(function (tabCtrl, index) {
            return <li key={index} className={index == self.props.currentTab ? 'current' : ''} onClick={self.goToTab.bind(self, index)}><a href='#'>{tabCtrl}</a></li>;
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
        this.setState({currentTab: index});
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

        content = <PanelContent key={this.state.currentTab} items={tabsConfig[this.state.currentTab].items} handler={tabsConfig[this.state.currentTab].handler}/>;

        return (
            <div className='tabs responsive'>
                <TabControls tabCtrls={tabCtrls} clickHandler={this.goToTab} currentTab={this.state.currentTab}/>
                <div>
                    {content}
                </div>
            </div>
        )
    }
});

module.exports = {
    Tab: Tab
}