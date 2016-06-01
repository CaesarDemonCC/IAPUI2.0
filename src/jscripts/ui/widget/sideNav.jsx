var toggleMenuMixin = {
    menuToggleHandler: function () {
        this.setState({
            expanded: !this.state.expanded
        })
    }
}

var nodeMixin = {
    selectHandler: function (nodeId) {
        this.props.selectNode(nodeId);

        this.setState({
            selected: !this.state.selected
        })
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            selected: nextProps.data.selected
        })
    }
}

var SideNav = React.createClass({
    mixins: [toggleMenuMixin],
    getInitialState: function () {
        var data = $.extend(true, [], this.props.data),
            level = 0;

        var depthMap = {};

        var setId = function (data, level) {
            data.forEach(function (item) {
                if (depthMap[level] == undefined) {
                    depthMap[level] = 0;
                } else {
                    depthMap[level] += 1;
                }
                item._id = level + '.' + depthMap[level];
                if (item.children) {
                    setId(item.children, level + 1)
                }
            })
        }
        if (data && $.isArray(data)) {
            setId(data, level)
        }

        return {
            expanded: false,
            treeData: data
        };
    },
    selectNode: function (nodeId) {
        var data = this.state.treeData;
        if (data && $.isArray(data)) {
            var newData = $.extend(true, [], data);
            function setSelected (nodes) {
                nodes.forEach(function (item) {
                    if (item._id === nodeId) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }

                    if (item.children) {
                        setSelected(item.children);
                    }
                })
            }
            setSelected(newData);

            this.setState({
                treeData: newData
            })
        }
    },
    render: function () {
        var self = this;
        var children = this.state.treeData.map(function (item, index) {
            return <Node key={index} data={item} selectNode={self.selectNode}/>
        });

        return (
            <div>
                <div className='mobile_menu_toggle' onClick={this.menuToggleHandler}>
                    <a className={this.state.expanded?'icon_arrow_up':'icon_arrow_down'}>Menu</a>
                </div>
                <ul className={'sidenav ' + (this.state.expanded?'expand':'')}>
                    {children}
                </ul>
            </div>
        )
    }
})

var Node = React.createClass({
    mixins: [toggleMenuMixin, nodeMixin],
    getInitialState: function () {
        return {
            selected: this.props.data.selected || false,
            expanded: true
        };
    },
    render: function () {
        var self = this;
        var data = this.props.data;
        var children = [];
        if (data.children && data.children.length) {
            children = data.children.map(function (item, index) {
                var NodeType = LeafNode;
                if (item.children && item.children.length) {
                    NodeType = Node;
                }

                return <NodeType key={index} data={item} selectNode={self.props.selectNode} />
            })
        }
        return (
            <li className={'folder ' + this.state.selected?'':''} >
                <a href={data.path||null} onClick={data.path?this.selectHandler.bind(this, data._id):this.menuToggleHandler}>{data.name}</a>
                <ul className={this.state.expanded?'expand':''} >
                    {children}
                </ul>
            </li>
        )
    }
})

var LeafNode = React.createClass({
    mixins: [nodeMixin],
    getInitialState: function () {
        return {
            selected: this.props.data.selected || false
        };
    },
    render: function () {
        var data = this.props.data;
        return (
            <li className={this.state.selected?'current':''} onClick={this.selectHandler.bind(this, data._id)} >
                <a href={data.path}>{data.name}</a>
            </li>
        )
    }
})

module.exports = {
    SideNav: SideNav
}