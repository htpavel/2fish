/*pomocná komponenta, kde se vypisují všechny úlovky*/

import React, { useState, useEffect } from 'react';
import Catch from './Catch';

const CatchList = ({ selectedSpecies }) => {
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

  // přeformátuje datum z formátu yyyy-mm-dd na formát dd.mm.yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() vrací měsíce od 0
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

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
          date={formatDate(catchItem.date)} 
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