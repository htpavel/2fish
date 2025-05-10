import Dashboard from './Dashboard';
import HeaderMenu from './HeaderMenu';
import CustomMenu from './testcomp';
import "./Layout.css";

const Layout = () => {
    return (
        <div className="container">
            <div className="layout-header">
                <div className="layout-appname">2FISH</div>
                <div className="layout-menu"><HeaderMenu></HeaderMenu></div>
            </div>
            <div className="layout-dashboard">
                <Dashboard/>
            </div>
            <div>třetí</div>
        </div>
        )
}

export default Layout;