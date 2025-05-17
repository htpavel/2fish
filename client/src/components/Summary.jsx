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
    <div className="modalShow">
      <Modal show={true} onHide={onClose}>
        <Modal.Header className="summary-header">
          <Modal.Title className="summary-header-title">Roční výkaz 2025</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="summary-sumWeight">Ceková statistika</div>
          <p>Celková váha: {totalWeight} kg</p>
          <p>Celková délka: {totalLength} m</p>

          <h3>Souhrn podle druhů</h3>
          {Object.entries(summaryBySpecies).map(([species, summary]) => (
            <div key={species}>
              <h4>{species}</h4>
              <p>Celková váha: {summary.totalWeight.toFixed(2)} kg</p>
              <p>Celková délka: {summary.totalLength.toFixed(2)} m</p>
              <p>Počet úlovků: {summary.count}</p>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Zavřít
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Summary;