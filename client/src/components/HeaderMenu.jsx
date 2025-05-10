import "./HeaderMenu.css";
import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    
    return (
        <div className="menu-container">
            <img src="./menu.svg" onClick={toggleMenu} alt="menu"  className="image-menu"  />
            <Dropdown.Menu show={isMenuOpen} align={'start'}> 
                <Dropdown.Item eventKey="1" onClick={toggleMenu} >Druhy ryb</Dropdown.Item>
                <Dropdown.Item eventKey="2"  onClick={toggleMenu}>O alikaci</Dropdown.Item>
            </Dropdown.Menu>
        </div>
    )
}

export default Header;