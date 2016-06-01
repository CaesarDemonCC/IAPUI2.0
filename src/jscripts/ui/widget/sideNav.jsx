var toggleMenuMixin = {
    menuToggleHandler: function () {
        this.setState({
            expanded: !this.state.expanded
        })
    }
}

var setSelectMixin = {
    selectHandler: function () {
        this.props.setSelect();

        this.setState({
            selected: true
        })
    }
}

var SideNav = React.createClass({
    mixins: [toggleMenuMixin],
    getInitialState: function () {
        return {
            expanded: false 
        };
    },
    setSelect: function () {
        console.log(this);
    },
    render: function () {
        var self = this;
        var children = this.props.data.map(function (item, index) {
            return <Node key={index} data={item} setSelect={self.setSelect}/>
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
    mixins: [toggleMenuMixin, setSelectMixin],
    getInitialState: function () {
        return {
            selected: false,
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

                return <NodeType key={index} data={item} setSelect={self.props.setSelect} />
            })
        }
        return (
            <li className={'folder ' + this.state.selected?'':''} >
                <a href={data.path||null} onClick={data.path?this.selectHandler:this.menuToggleHandler}>{data.name}</a>
                <ul className={this.state.expanded?'expand':''} >
                    {children}
                </ul>
            </li>
        )
    }
})

var LeafNode = React.createClass({
    mixins: [setSelectMixin],
    getInitialState: function () {
        return {
            selected: false  
        };
    },
    render: function () {
        var data = this.props.data;
        return (
            <li className={this.state.selected?'current':''} onClick={this.selectHandler} >
                <a href={data.path}>{data.name}</a>
            </li>
        )
    }
})

module.exports = {
    SideNav: SideNav
}