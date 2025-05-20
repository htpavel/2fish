import React, { useState, useEffect } from 'react'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import "./ItemForm.css";

const ItemForm = ({ onClose, speciesList, initialData, onSubmit }) => {
  
  // Stavy pro data formuláře
  const [formData, setFormData] = useState({
    date: '',
    speciesName: '', 
    districtNr: '',
    length: '',
    weight: ''
  });

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    // rohodnutí jestli okno je nový úlovek nebo editace
    if (initialData) {
      // Pokud máme initialData, použijeme je pro předvyplnění formuláře
      setFormData({
        date: initialData.date,
        speciesName: initialData.name, // Předpokládáme, že initialData.name je název druhu
        districtNr: initialData.districtNr,
        length: initialData.length,
        weight: initialData.weight
      });
    } else {
      // Jinak nastavíme výchozí hodnoty (pro nový úlovek)
      setFormData({
        date: currentDate,
        speciesName: '', // Nebo "Vyberte druh ryby"
        districtNr: '',
        length: '',
        weight: ''
      });
    }
  }, [initialData]); 

  // Získání unikátních názvů druhů ryb ze speciesList
  const uniqueSpeciesNames = [...new Set(speciesList.map(speciesItem => speciesItem.name))];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Zabrání výchozímu chování formuláře -- znovunačtení stránky

    // validace
    if (!formData.date || !formData.speciesName || !formData.districtNr || !formData.length || !formData.weight) {
      alert('Prosím vyplňte všechna pole.');
      return;
    }

    // Voláme onSubmit funkci předanou z rodičovské komponenty
    // Předáme ID úlovku, pokud existuje (pro úpravu), jinak undefined pro přidání
    onSubmit({ ...formData, id: initialData ? initialData.id : null });
  };

  return (
    <div className="itemForm-modal-show">
      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{initialData ? 'Upravit úlovek' : 'Přidat úlovek'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}> {/* Přesuneme onSubmit na Form element */}
            <Form.Group className="mb-3">
              <Form.Label>Datum</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]} // max na dnešní datum
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Druh ryby</Form.Label>
              <Form.Select
                aria-label="Vyberte druh ryby"
                name="speciesName" 
                value={formData.speciesName}
                onChange={handleChange}
                required
              >
                <option value="">Vyberte druh ryby</option> 
                {uniqueSpeciesNames.map((speciesName, index) => (
                  <option key={index} value={speciesName}>{speciesName}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Číslo revíru</Form.Label>
              <Form.Control
                type="number"
                name="districtNr"
                value={formData.districtNr}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Délka ryby (cm)</Form.Label> 
              <Form.Control
                type="number"
                name="length"
                value={formData.length}
                onChange={handleChange}
                placeholder="cm"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Váha ryby (kg)</Form.Label> 
              <Form.Control
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="kg"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer className="itemForm-buttons">
          <Button variant="primary" type="submit" onClick={handleSubmit}>Uložit</Button> 
          <Button variant="secondary" onClick={onClose}>Zrušit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ItemForm;