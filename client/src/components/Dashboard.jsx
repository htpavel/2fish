import React, { useState, useEffect } from 'react';
import SpeciesFiltr from './SpeciesFiltr';
import CatchList from './CatchList';
import './Dashboard.css';
import Summary from './Summary';
import Button from 'react-bootstrap/esm/Button';
import ItemForm from './ItemForm';


const Dashboard = () => {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState('all');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showAddFishModal, setShowAddFishModal] = useState(false);
  const [catches, setCatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speciesList, setSpeciesList] = useState([]); // Pro seznam druhů pro filtr

  const handleSpeciesChange = (speciesId) => {
    setSelectedSpeciesId(speciesId);
  };

  const handleShowSummaryModal = () => {
    setShowSummaryModal(true);
  };

  const handleCloseSummaryModal = () => {
    setShowSummaryModal(false);
  };

  const hadleShowAddFishModal = () => {
    setShowAddFishModal(true);
  }

  const hadleCloseAddFishModal = () => {
    setShowAddFishModal(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const catchResponse = await fetch('http://localhost:3333/catch/List');
        if (!catchResponse.ok) {
          throw new Error(`HTTP error! status: ${catchResponse.status} - catch/List`);
        }
        const catchData = await catchResponse.json();
        setCatches(catchData.listFish);

        const speciesResponse = await fetch('http://localhost:3333/species/List');
        if (!speciesResponse.ok) {
          throw new Error(`HTTP error! status: ${speciesResponse.status} - species/List`);
        }
        const speciesData = await speciesResponse.json();
        // Zpracujeme data o druzích pro SpeciesFiltr
        const formattedSpeciesList = [{ name: 'Všechny druhy', id: 'all' }, ...speciesData.listSP];
        setSpeciesList(formattedSpeciesList);

      } catch (err) {
        setError(err);
        console.error("Chyba při načítání dat:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCatches = selectedSpeciesId === 'all'
    ? catches
    : catches.filter(catchItem => catchItem.speciesId === selectedSpeciesId);

    console.log("selectedSpeciesId:", selectedSpeciesId);
    console.log("filteredCatches:", filteredCatches);
  if (loading) {;
    return <div>Načítám data...</div>;
  }

    if (error) {
    return <div>Chyba při načítání dat: {error.message}</div>;
  }
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        Úlovky
        <SpeciesFiltr species={speciesList} onSpeciesChange={handleSpeciesChange} />
      </div>
      <div className="dashboard-catch">
        <CatchList catches={filteredCatches} />
      </div>
      <div className="footer-container">
        <hr className="dashboard-line"></hr>
        <div className="dashboard-summary-container">
          <div className="dashboard-weight">&#8721; kg: {filteredCatches.reduce((sum, fish) => sum + fish.weight, 0).toFixed(2)}</div>
          <div className="dashboard-length">&#8721; m: {(filteredCatches.reduce((sum, fish) => sum + fish.length, 0) / 100).toFixed(2)}</div>
        </div>
        <div className="dasboard-buttons">
          <Button className="button-summary" onClick={handleShowSummaryModal}>Výkaz</Button>
          <Button variant="primary" className="button-addfish" onClick={handleShowSummaryModal}>Přidat úlovek</Button>
        </div>
      </div>
      {showSummaryModal && (
        <Summary onClose={handleCloseSummaryModal} catches={catches}/> // Předáváme všechny úlovky
      )}
      {showAddFishModal && (
        <ItemForm onClose={hadleShowAddFishModal} idCatch={catches}/> // oteření okna nového úlovku
      )}
    </div>
  );
}

export default Dashboard;