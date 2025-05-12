import "./Catch.css";
import { useState } from 'react';


function Catch() {
  const [isVisible, setIsVisible] = useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };
    return (
        <div>
            <div className="catch-sp-date" onClick={handleClick} style={{ cursor: 'pointer' }}>
                <div className="catch-date">10.2.2025</div>
                <div className="catch-species">Ostroretka stěhovavá</div>
            </div>
            <div className="catch-details-container" style={{ display: isVisible ? 'block' : 'none' }}>
                <div className="catch-districtNr">číslo revíru: 51484</div>
                <div className="catch-weight">Váha: 10 kg</div>
                <div className="catch-length">Délka: 55 cm </div>
            </div>

        </div>
    )
}

export default Catch;