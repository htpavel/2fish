import "./Dashboard.css";
import SpeciesFiltr from "./SpeciesFiltr";
import Catch from "./Catch";
import ButtonAddFish from "./ButtonAddFish";
import ButtonSummary from "./ButtonSummary";

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                Úlovky
                <SpeciesFiltr />
            </div>
            <div className="dashboard-catch">
                <Catch />
                <Catch />
                <Catch />
                <Catch />
                <Catch />
                <Catch />
                <Catch />
                <Catch />
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