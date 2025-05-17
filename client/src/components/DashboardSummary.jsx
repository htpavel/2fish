import React, { useState, useEffect } from 'react';

const DashboardSummary = ({ selectedSpecies }) =>{
  const [catches, setCatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.error("Chyba při načítání dat o úlovcích pro souhrn:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCatches = selectedSpecies === 'Všechny druhy'
    ? catches
    : catches.filter(catchItem => catchItem.name === selectedSpecies);

  const totalLength = filteredCatches.reduce((sum, catchItem) => sum + catchItem.length, 0).toFixed(2);
  const totalWeight = filteredCatches.reduce((sum, catchItem) => sum + catchItem.weight, 0).toFixed(2);

  if (loading) {
    return <div>Načítám souhrn...</div>;
  }

  if (error) {
    return <div>Chyba při načítání souhrnu: {error.message}</div>;
  }

  return (
    <div className="dashboard-summary-container">
      <div className="dashboard-weight">&#8721; kg: {totalWeight}</div>
      <div className="dashboard-length">&#8721; m: {(totalLength / 100).toFixed(2)}</div> {/* Převod cm na m */}
    </div>
  );
}

export default DashboardSummary;