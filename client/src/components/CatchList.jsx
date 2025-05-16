import React, { useState, useEffect } from 'react';
import Catch from './Catch';

function CatchList({ selectedSpecies }) {
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
    return <div>Načítám úlovky...</div>;
  }

  if (error) {
    return <div>Chyba při načítání úlovků: {error.message}</div>;
  }

  return (
    <div className="dashboard-catch">
      {filteredCatches.map((catchItem) => (
        <Catch
          key={catchItem.id}
          date={catchItem.date}
          species={catchItem.name}
          districtNr={catchItem.districtNr}
          weight={catchItem.weight}
          length={catchItem.length}
        />
      ))}
    </div>
  );
}

export default CatchList;