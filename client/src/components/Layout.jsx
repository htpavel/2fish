import  {Outlet}  from 'react-router-dom';
import HeaderMenu from './HeaderMenu';
import "./Layout.css";

const Layout = () => {
    return (
        <div className="layout-container">
             <div className="layout-header">
                <img src="../logo-32x32.png" alt="logo" />
                2FISH
                <HeaderMenu />
            </div>
            <div className="layout-dashboard-container">
                <div className="layout-left"></div>
                <div className="layout-dashboard">
                    <Outlet />
                </div>
                <div className="layout-right"></div>
            </div>
        </div>
    )
}

export default Layout;