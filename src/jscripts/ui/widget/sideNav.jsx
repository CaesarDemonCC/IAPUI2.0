var SideNav = React.createClass({
    render: function () {
        var subnavs = this.props.data.map(function (item, index) {
            return <SubNav key={index} data={item} />
        });

        return (
            <div>
                <div className='mobile_menu_toggle'>
                    <a className='icon_arrow_up'>Menu</a>
                </div>
                <ul className='sidenav expand'>
                    {subnavs}
                </ul>
            </div>
        )
    }
})

var SubNav = React.createClass({
    getInitialState: function () {
        return {
            selected : false 
        };
    },
    render : function () {
        var data = this.props.data;
        var leafNodes = null;
        if (data.subNavs && data.subNavs.length) {
            leafNodes = data.subNavs.map(function (item, index) {
                return <LeafNode key={index} data={item}/>
            })
        }
        return (
            <li className={this.state.selected ? 'current' : ''} >
                <a href={data.path||null}>{data.name}</a>
                <ul className='expand'>
                    {leafNodes}
                </ul>
            </li>
        )
    }
})

var LeafNode = React.createClass({
    getInitialState: function () {
        return {
            selected: false  
        };
    },
    handleClick: function () {
        this.setState({
            selected: true
        })
    },
    render: function () {
        var data = this.props.data;
        return (
            <li className={this.state.selected ? 'current' : ''} onClick={this.handleClick} >
                <a href={data.path}>{data.name}</a>
            </li>
        )
    }
})

module.exports = {
    SideNav: SideNav
}