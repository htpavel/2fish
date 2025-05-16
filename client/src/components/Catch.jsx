import "./Catch.css";
import { useState } from 'react';


function Catch({ date, species, districtNr, weight, length }) {
    const [isVisible, setIsVisible] = useState(false);

    const handleClick = () => {
        setIsVisible(!isVisible);
    };
    return (
        <div>
            <div className="catch-sp-date" onClick={handleClick} style={{ cursor: 'pointer' }}>
                <div className="catch-date">{date}</div>
                <div className="catch-species">{species}</div>
            </div>
            <div className="catch-details-container" style={{ display: isVisible ? 'block' : 'none' }}>
                <div className="catch-districtNr">číslo revíru: {districtNr}</div>
                <div className="catch-weight">Váha: {weight} kg</div>
                <div className="catch-length">Délka: {length} cm </div>
            </div>
        </div>
    );
}

export default Catch;