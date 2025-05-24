/* komponenta jednoho úlovku */
import "./Catch.css";
import { useState } from 'react';


const Catch = ({ id, date, species, districtNr, weight, length, onDelete, onEdit }) => {
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
                <div className="catch-districtNr">
                    číslo revíru: {districtNr}
                    <div className="catch-actions">
                        <div className="catch-edit" onClick={onEdit} style={{ cursor: 'pointer' }}><img src="../edit.svg" alt="edit" /></div> 
                        <div className="catch-delete" onClick={onDelete} style={{ cursor: 'pointer' }}><img src="../delete.svg" alt="delete"/></div>
                    </div>
                </div>
                <div className="catch-weight">Váha: {weight} kg</div>
                <div className="catch-length">Délka: {length} cm </div>
            </div>
        </div>
    );
}

export default Catch;