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