import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import "./SpeciesFiltr.css";


const SpeciesFiltr = ({ onSpeciesChange }) => {
 const [fishSpecies, setFishSpecies] = useState([]);
  const [selectedSpeciesText, setSelectedSpeciesText] = useState('Vybrat druh'); 
 
  
  const allSpeciesItem = { name: 'Všechny druhy', id: 'all' }; // Přidá položku Všechny druhy

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3333/species/List');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFishSpecies(data.listSP);
      } catch (error) {
        console.error("Chyba při načítání dat o druzích:", error);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (eventKey) => {
    onSpeciesChange(eventKey); // když se změní druh ryby
    setSelectedSpeciesText(eventKey); // vypíše vybraný druh ryby
  };

  return (
    <div className="filtr-container">
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle className="button-menu" variant="secondary" id="dropdown-basic">
          {selectedSpeciesText} 
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item key={allSpeciesItem.id} eventKey={allSpeciesItem.name}>
            {allSpeciesItem.name}
          </Dropdown.Item>
          {fishSpecies.map((fish) => (
            <Dropdown.Item key={fish.id} eventKey={fish.name}>
              {fish.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default SpeciesFiltr;