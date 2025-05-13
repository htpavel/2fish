import Dropdown from 'react-bootstrap/Dropdown';
import "./SpeciesFiltr.css";


const SpeciesFiltr = () => {
    return (
        <div className="filtr-container">
            <Dropdown>
                <Dropdown.Toggle className="button-menu" variant="secondary" id="dropdown-basic">
                    Všechny druhy
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default SpeciesFiltr;