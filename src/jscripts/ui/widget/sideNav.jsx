var SideNav = React.createClass({
    render: function () {
        return (
            <div>
                <div className='mobile_menu_toggle'>
                    <a className='icon_arrow_up'>Menu</a>
                </div>
                <ul className='sidenav expand'>
                    <li className='folder current'>
                        <a href="#">Configuration</a>
                        <ul className='expand'>
                            <li className='current'><a href="#sidenav">Settings</a></li>
                            <li><a href="#offcanvas">Security</a></li>
                            <li><a href="#tabs">RF</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }
})

module.exports = {
    SideNav: SideNav
}