import "./Dashboard.css";
import React, { useState } from 'react';
import SpeciesFiltr from "./SpeciesFiltr";
import CatchList from "./CatchList";
import ButtonAddFish from "./ButtonAddFish";
import ButtonSummary from "./ButtonSummary";


const Dashboard = () => {

    const [selectedSpecies, setSelectedSpecies] = useState('Všechny druhy');

    const handleSpeciesChange = (species) => {
         console.log('Změněn druh v Dashboardu:', species);
        setSelectedSpecies(species);
    };
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
                    <div className="dashboard-weight">&#8721; kg:12,4</div>
                    <div className="dashboard-length">&#8721; m: 1,6</div>
                </div>
                <div className="dasboard-buttons">
                    <div className="dasborad-btnSummary">
                        <ButtonSummary />
                    </div>
                    <div className="dasboard-btnAddFish">
                        <ButtonAddFish />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;