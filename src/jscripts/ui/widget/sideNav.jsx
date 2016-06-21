var toggleMenuMixin = {
    menuToggleHandler: function () {
        this.setState({
            expanded: !this.state.expanded
        })
    }
}

var SideNav = ReactRouter.withRouter(React.createClass({
    mixins: [toggleMenuMixin],
    componentWillReceiveProps: function (nextProps) {
        var data = this.calcData(nextProps.data);
        this.setState({
            treeData: data
        });
    },
    calcData: function (oData) {
        var data = $.extend(true, [], oData);
        var currentLocation = this.props.currentLocation;
        var self = this;

        var setId = function (d, opt_parentID) {
            d.forEach(function (item, index) {
                var parentID = opt_parentID? opt_parentID + '.' : '';
                item._id = parentID + index;

                if (item.path && item.path == currentLocation) {
                    item.selected = true;
                    // Set the parent node as selected
                    self.setSelected(opt_parentID, data, true);
                }

                if (item.children) {
                    setId(item.children, item._id)
                }
            })
        }

        if (data && $.isArray(data)) {
            setId(data)
        }

        return data;
    },
    getInitialState: function () {
        var data = this.calcData(this.props.data);
        return {
            expanded: false,
            treeData: data
        };
    },
    setSelected: function (nodeId, nodes, opt_doNotUnselectOthers) {
        if (nodes && nodes.length) {
            var item;
            for (var i = 0; i < nodes.length; i++) {
                item = nodes[i];
                if (opt_doNotUnselectOthers) {
                    if (item._id === nodeId) {
                        item.selected = true;
                        break;
                    }
                } else {
                    if (item._id === nodeId) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                }

                if (item.children) {
                    this.setSelected(nodeId, item.children);
                }
            }
        }
    },
    selectNode: function (nodeId) {
        var data = this.state.treeData;
        if (data && $.isArray(data)) {
            var newData = $.extend(true, [], data);
            this.setSelected(nodeId, newData);
            if (nodeId.match(/.\d+$/)) {
                this.setSelected(nodeId.replace(/.\d+$/, ''), newData, true);
            }

            this.setState({
                treeData: newData,
                expanded: false
            })
        }
    },
    render: function () {
        var self = this;
        if (!this.props.show) {
            return null;
        }
        var children = this.state.treeData.map(function (item, index) {
            return <Node key={index} data={item} selectNode={self.selectNode}/>
        });

        return (
            <div className='sidenav-wrapper'>
                <div className='mobile_menu_toggle' onClick={this.menuToggleHandler}>
                    <a className={this.state.expanded?'icon_arrow_up':'icon_arrow_down'}>Menu</a>
                </div>
                <ul className={'sidenav ' + (this.state.expanded?'expand':'')}>
                    {children}
                </ul>
            </div>
        )
    }
}));

var Node = React.createClass({
    mixins: [toggleMenuMixin],
    getInitialState: function () {
        return {
            expanded: true
        };
    },
    selectHandler: function (nodeId) {
        this.props.selectNode(nodeId);
    },
    render: function () {
        var self = this;
        var data = this.props.data;
        var children = [];
        var ul = null;
        if (data.children && data.children.length) {
            children = data.children.map(function (item, index) {
                return <Node key={index} data={item} selectNode={self.props.selectNode} />
            })

            ul = (<ul className={this.state.expanded?'expand':''}>{children}</ul>);
        }
        return (
            <li className={'folder ' + (data.selected?'current':'')} >
                <a href={data.path?'#'+data.path:null} onClick={data.path?this.selectHandler.bind(this, data._id):this.menuToggleHandler}>{data.name}</a>
                {ul}
            </li>
        )
    }
})

module.exports = {
    SideNav: SideNav
}