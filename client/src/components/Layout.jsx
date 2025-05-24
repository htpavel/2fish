/*Layout aplikace*/
import { Outlet } from 'react-router-dom';
import HeaderMenu from './HeaderMenu';
import "./Layout.css";

const Layout = () => {

    //klik na rybičku přesměruje na dashboard
    const handleImageClick = () => {
        window.location.href = '/';
    };
    return (
        <div className="layout-container">
            <div className="layout-header">
                <img src="../logo-32x32.png" alt="logo" onClick={handleImageClick} />
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