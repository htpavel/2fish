import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./Summary.css"

const Summary = ({ onClose, catches }) => {

  const totalWeight = catches.reduce((sum, fish) => sum + fish.weight, 0).toFixed(2); // výpočet pro celkovou váhu
  const totalLength = (catches.reduce((sum, fish) => sum + fish.length, 0) / 100).toFixed(2); // výpočet pro celkovou délku

  // Seskupení úlovků podle druhu a výpočet součtů
  const summaryBySpecies = catches.reduce((acc, fish) => {
    const { name, weight, length } = fish;
    if (!acc[name]) {
      acc[name] = { totalWeight: 0, totalLength: 0, count: 0 };
    }
    acc[name].totalWeight += weight;
    acc[name].totalLength += length / 100; // Převod na metry 
    acc[name].count++;
    return acc;
  }, {});

  return (
    <div className="summary-modal-show">
      <Modal show={true} onHide={onClose}>
        <Modal.Header className="summary-header">
          <Modal.Title className="summary-header-title">Roční výkaz 2025</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="summary-sumWeight">Ceková váha ulovených ryb</div>
          <div className="summary-text">{totalWeight} kg</div>
          <div className="summary-sumLength">Ceková délka ulovených ryb</div>
          <div className="summary-text">{totalLength} m</div>
          <div className="summary-allSpecies">Délka a váha podle druhů ryb</div>
          {Object.entries(summaryBySpecies).map(([species, summary]) => (
            <div key={species}>
              <div className="summary-sumCatch">{species}: {summary.totalLength.toFixed(2)} m | {summary.totalWeight.toFixed(2)} kg</div>
              <p>Počet úlovků: {summary.count}</p>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer className="summary-footer">
          <Button className="summary-button-close" variant="secondary" onClick={onClose}>
            Zavřít
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Summary;