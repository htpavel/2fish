/*pomocná komponenta, kde se vypisují všechny úlovky*/

import React from 'react';
import Catch from './Catch';

const CatchList = ({ catches }) => {
  // přeformátuje datum z formátu YYYY-MM-DD na formát DD.MM.YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() vrací měsíce od 0
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  //console.log(catches);

  if (!catches || catches.length === 0) {
    return <div>Žádné úlovky k zobrazení.</div>;
  }

  return (
    <div className="dashboard-catch">
      {catches.map((catchItem) => (
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