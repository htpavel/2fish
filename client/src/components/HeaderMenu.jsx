import "./HeaderMenu.css";
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    return (
        <div className="menu-container">
            <img src="./menu.svg" onClick={toggleMenu} alt="menu"  className="image-menu"  />
            <Dropdown.Menu show={isMenuOpen} align={'start'}> 
                <Dropdown.Item eventKey="1" onClick={toggleMenu} as={Link} to="/">Dashboard</Dropdown.Item>
                <Dropdown.Item eventKey="2" onClick={toggleMenu} as={Link} to="/species">Druhy ryb</Dropdown.Item>
                <Dropdown.Item eventKey="3"  onClick={toggleMenu} as={Link} to="/about">O aplikaci</Dropdown.Item>
            </Dropdown.Menu>
        </div>
    )
}

export default Header;