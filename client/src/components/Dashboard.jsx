import React, { useState, useEffect } from 'react';
import SpeciesFiltr from './SpeciesFiltr';
import CatchList from './CatchList';
import ButtonAddFish from './ButtonAddFish';
import './Dashboard.css';
import Summary from './Summary';

function Dashboard() {
  const [selectedSpecies, setSelectedSpecies] = useState('Všechny druhy');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [catches, setCatches] = useState([]); // Stav pro všechny úlovky
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSpeciesChange = (species) => {
    setSelectedSpecies(species);
  };

  const handleShowSummaryModal = () => {
    setShowSummaryModal(true);
  };

  const handleCloseSummaryModal = () => {
    setShowSummaryModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3333/catch/List');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCatches(data.listFish);
      } catch (err) {
        setError(err);
        console.error("Chyba při načítání dat o úlovcích:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCatches = selectedSpecies === 'Všechny druhy'
    ? catches
    : catches.filter(catchItem => catchItem.name === selectedSpecies);

  if (loading) {
    return <div>Načítám data...</div>;
  }

  if (error) {
    return <div>Chyba při načítání dat: {error.message}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        Úlovky
        <SpeciesFiltr onSpeciesChange={handleSpeciesChange} />
      </div>
      <div className="dashboard-catch">
        <CatchList selectedSpecies={selectedSpecies} />
      </div>
      <div className="footer-container">
        <hr className="dashboard-line"></hr>
        <div className="dashboard-summary-container">
          <div className="dashboard-weight">&#8721; kg: {filteredCatches.reduce((sum, fish) => sum + fish.weight, 0).toFixed(2)}</div>
          <div className="dashboard-length">&#8721; m: {(filteredCatches.reduce((sum, fish) => sum + fish.length, 0) / 100).toFixed(2)}</div>
        </div>
        <div className="dasboard-buttons">
          <button onClick={handleShowSummaryModal}>Výkaz</button>
          <ButtonAddFish />
        </div>
      </div>
      {showSummaryModal && (
        <Summary
          onClose={handleCloseSummaryModal}
          selectedSpecies={selectedSpecies}
          catches={filteredCatches} // Předáváme filtrovaná data
        />
      )}
    </div>
  );
}

export default Dashboard;