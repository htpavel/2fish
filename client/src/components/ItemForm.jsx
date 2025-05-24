/* Formulář pro editaci stávajícího a přidání nového úlovku */
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ConfirmWeightLimitModal from './ConfirmWeight';

const ItemForm = ({ onClose, initialData, speciesList, onSubmit }) => {

  const [date, setDate] = useState('');
  const [districtNr, setDistrictNr] = useState(''); // Uchováváme jako řetězec pro formátování
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [speciesName, setSpeciesName] = useState('');
  const [id, setId] = useState(null); // ID úlovku pro režim editace


  const [showWeightLimitModal, setShowWeightLimitModal] = useState(false); // Řídí zobrazení potvrzovacího modalu
  const [tempCatchData, setTempCatchData] = useState(null); // Dočasně uchovává data úlovku před potvrzením uložení
  const [dailyTotalWeight, setDailyTotalWeight] = useState(0); // Celková váha ryb pro daný den, získaná ze serveru

  useEffect(() => {
    if (initialData) {

      setId(initialData.id);
      setDate(initialData.date);
      // Zajištění formátu čísla revíru s vedoucími nulami - 5 číseč
      setDistrictNr(String(initialData.districtNr).padStart(5, '0'));
      setWeight(initialData.weight);
      setLength(initialData.length);

      const foundSpecies = speciesList.find(s => s.id === initialData.speciesId);
      setSpeciesName(foundSpecies ? foundSpecies.name : '');
    } else {
      // Režim přidání nového úlovku: Nastavíme datum na aktuální den
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [initialData, speciesList]); // Závislosti efektu

  const handleDistrictNrChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 5) {
      setDistrictNr(value);
    }
  };


  const handleFinalSubmit = (data) => {
    onSubmit(data);
    onClose(); 
    setShowWeightLimitModal(false); 
    setTempCatchData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!date || !districtNr || !weight || !length || !speciesName) {
      alert('Prosím vyplňte všechna pole.');
      return;
    }

    if (districtNr.length !== 5) {
      alert('Číslo revíru musí mít přesně 5 číslic.');
      return;
    }

    const formattedDistrictNr = String(districtNr).padStart(5, '0');


    const currentCatchData = {
      id: id,
      date: date,
      districtNr: formattedDistrictNr,
      weight: parseFloat(weight), 
      length: parseFloat(length),
      speciesName: speciesName, 
    };

    // Kontrola denního váhového limitu se provádí při přidávání nového úlovku
    if (!initialData) {
      try {
        const apiUrl = `http://localhost:3333/catch/checkWeight?date=${currentCatchData.date}`;

        const response = await fetch(apiUrl, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text(); 
          throw new Error(`Chyba při HTTP požadavku! Status: ${response.status}. Detaily: ${errorText}`);
        }

        const serverResponse = await response.json();
        const { totalWeight, overWeight } = serverResponse; 

        const dailyLimit = 7.0; // denní váhový limit

        const potentialTotalWeight = totalWeight + currentCatchData.weight;

        if (overWeight || potentialTotalWeight > dailyLimit) {
          setTempCatchData(currentCatchData); 
          setDailyTotalWeight(totalWeight); 
          setShowWeightLimitModal(true); 
          return; 
        }

      } catch (error) {
        console.error('Chyba při kontrole váhového limitu:', error);
        alert(`Nepodařilo se zkontrolovat denní limit. Zkuste to prosím znovu. Detaily: ${error.message}`);
        return;
      }
    }

    handleFinalSubmit(currentCatchData);
  };

  return (
    <>

      <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{initialData ? 'Upravit úlovek' : 'Přidat úlovek'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Datum</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Číslo revíru (5 číslic)</Form.Label>
              <Form.Control
                type="text"
                value={districtNr}
                onChange={handleDistrictNrChange}
                maxLength={5}
                required
                placeholder="Např. 00123"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Váha (kg)</Form.Label>
              <Form.Control
                type="number"
                step="0.01" // Umožňuje zadání desetinných čísel
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Délka (cm)</Form.Label>
              <Form.Control
                type="number"
                step="1" // Umožňuje zadání celých čísel
                value={length}
                onChange={(e) => setLength(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Druh ryby</Form.Label>
              <Form.Select
                value={speciesName}
                onChange={(e) => setSpeciesName(e.target.value)}
                required
              >
                <option value="">Vyberte druh</option>
                {speciesList.map((species) => (
                  <option key={species.id} value={species.name}>
                    {species.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={onClose}>
                Zrušit
              </Button>
              <Button variant="primary" type="submit">
                {initialData ? 'Uložit změny' : 'Přidat'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>


      {showWeightLimitModal && tempCatchData && (
        <ConfirmWeightLimitModal
          show={showWeightLimitModal} 
          onConfirm={() => handleFinalSubmit(tempCatchData)} 
          onCancel={() => {
            setShowWeightLimitModal(false);
            setTempCatchData(null); 
          }}
          currentCatchWeight={tempCatchData.weight} 
          dailyTotalWeight={dailyTotalWeight} 
        />
      )}
    </>
  );
};

export default ItemForm;