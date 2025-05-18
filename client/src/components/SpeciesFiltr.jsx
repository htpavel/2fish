import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import "./SpeciesFiltr.css";

const SpeciesFiltr = ({ onSpeciesChange, species }) => {
  const [selectedSpeciesText, setSelectedSpeciesText] = useState('Vybrat druh');

  const allSpeciesItem = { name: 'Všechny druhy', id: 'all' };

  useEffect(() => {
    if (species && species.length > 0) {
      const initialSelected = species.find(s => s.id === 'all') || species[0] || allSpeciesItem;
      setSelectedSpeciesText(initialSelected.name);
    }
  }, [species]);

  const handleSelect = (selectedId) => {
    const selectedItem = species.find(s => s.id === selectedId) || allSpeciesItem;
    onSpeciesChange(selectedId); // Předáváme ID
    setSelectedSpeciesText(selectedItem.name);
  };

  return (
    <div className="filtr-container">
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle className="button-menu" variant="secondary" id="dropdown-basic">
          {selectedSpeciesText}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item key={allSpeciesItem.id} eventKey={allSpeciesItem.id}>
            {allSpeciesItem.name}
          </Dropdown.Item>
          {species && species.filter(s => s.id !== 'all').map((fish) => (
            <Dropdown.Item key={fish.id} eventKey={fish.id}>
              {fish.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default SpeciesFiltr;