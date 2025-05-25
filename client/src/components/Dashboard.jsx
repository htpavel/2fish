import React, { useState, useEffect } from 'react';
import SpeciesFiltr from './SpeciesFiltr';
import CatchList from './CatchList';
import './Dashboard.css';
import Summary from './Summary';
import Button from 'react-bootstrap/esm/Button';
import ItemForm from './ItemForm';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const Dashboard = () => {
    // Stavy pro filtraci a zobrazení dat
    const [selectedSpeciesId, setSelectedSpeciesId] = useState('all');
    const [catches, setCatches] = useState([]);
    const [speciesList, setSpeciesList] = useState([]);

    // Stavy pro správu modalů (vyskakovacích oken)
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [showAddFishModal, setShowAddFishModal] = useState(false);
    const [showEditFishModal, setShowEditFishModal] = useState(false);
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false); // Stále potřebujeme tento stav

    // Stavy pro data předávaná do modalů
    const [catchToEdit, setCatchToEdit] = useState(null);
    const [catchIdToDelete, setCatchIdToDelete] = useState(null);

    // Stavy pro načítání a chyby
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSpeciesChange = (speciesId) => {
        setSelectedSpeciesId(speciesId);
    };

    const handleShowSummaryModal = () => {
        setShowSummaryModal(true);
    };
    const handleCloseSummaryModal = () => {
        setShowSummaryModal(false);
    };

    const hadleShowAddFishModal = () => {
        setCatchToEdit(null);
        setShowAddFishModal(true);
    };
    const hadleCloseAddFishModal = () => {
        setShowAddFishModal(false);
    };

    const handleShowEditFishModal = (catchItem) => {
        setCatchToEdit(catchItem);
        setShowEditFishModal(true);
    };
    const handleCloseEditFishModal = () => {
        setShowEditFishModal(false);
        setCatchToEdit(null);
    };

    const handleRequestDeleteCatch = (id) => {
        setCatchIdToDelete(id);
        setShowConfirmDeleteModal(true);
    };

    const handleCloseConfirmDeleteModal = () => {
        setShowConfirmDeleteModal(false);
        setCatchIdToDelete(null);
    };

    const handleDeleteCatch = async () => {
        if (!catchIdToDelete) return;

        try {
            const response = await fetch('http://localhost:3333/catch/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: catchIdToDelete }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Nepodařilo se smazat úlovek'}`);
            }

            setCatches(prevCatches => prevCatches.filter(catchItem => catchItem.id !== catchIdToDelete));
            console.log(`Úlovek s ID ${catchIdToDelete} byl úspěšně smazán.`);

        } catch (err) {
            setError(err);
            console.error("Chyba při mazání úlovku:", err);
            alert(`Chyba při mazání úlovku: ${err.message}`);
        } finally {
            handleCloseConfirmDeleteModal();
        }
    };

    const handleSubmitCatch = async (catchData) => {
        const isEditing = catchData.id !== null;
        const url = isEditing ? 'http://localhost:3333/catch/update' : 'http://localhost:3333/catch/create';
        const method = 'POST';

        const selectedSpecies = speciesList.find(s => s.name === catchData.speciesName);
        if (!selectedSpecies) {
            alert('Vyberte platný druh ryby.');
            return;
        }

        const payload = {
            date: catchData.date,
            districtNr: parseInt(catchData.districtNr),
            weight: parseFloat(catchData.weight),
            length: parseFloat(catchData.length),
            speciesId: selectedSpecies.id
        };

        if (isEditing) {
            payload.id = catchData.id;
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Nepodařilo se uložit úlovek'}`);
            }

            const responseData = await response.json();
            if (isEditing) {
                setCatches(prevCatches =>
                    prevCatches.map(c => (c.id === catchData.id ? { ...c, ...payload, name: catchData.speciesName } : c))
                );
                console.log(`Úlovek s ID ${catchData.id} byl úspěšně upraven.`);
            } else {
                setCatches(prevCatches => [...prevCatches, { ...payload, id: responseData.id || Date.now().toString(), name: catchData.speciesName }]);
                console.log('Nový úlovek byl úspěšně přidán.');
            }

            if (isEditing) {
                handleCloseEditFishModal();
            } else {
                hadleCloseAddFishModal();
            }

        } catch (err) {
            setError(err);
            console.error("Chyba při ukládání úlovku:", err);
            alert(`Chyba při ukládání úlovku: ${err.message}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const catchResponse = await fetch('http://localhost:3333/catch/List');
                if (!catchResponse.ok) {
                    throw new Error(`HTTP error! status: ${catchResponse.status} - catch/List`);
                }
                const catchData = await catchResponse.json();
                setCatches(catchData.listFish);

                const speciesResponse = await fetch('http://localhost:3333/species/List');
                if (!speciesResponse.ok) {
                    throw new Error(`HTTP error! status: ${speciesResponse.status} - species/List`);
                }
                const speciesData = await speciesResponse.json();
                const formattedSpeciesList = [{ name: 'Všechny druhy', id: 'all' }, ...speciesData.listSP];
                setSpeciesList(formattedSpeciesList);

            } catch (err) {
                setError(err);
                console.error("Chyba při načítání dat:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredCatches = selectedSpeciesId === 'all'
        ? catches
        : catches.filter(catchItem => catchItem.speciesId === selectedSpeciesId);

    if (loading) {
        return <div>Načítám data...</div>;
    }

    if (error) {
        return <div>Chyba při načítání dat: {error.message}</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                Úlovky
                <SpeciesFiltr species={speciesList} onSpeciesChange={handleSpeciesChange} />
            </div>
            <div className="dashboard-catch">
                <CatchList
                    catches={filteredCatches}
                    onDeleteCatch={handleRequestDeleteCatch}
                    onEditCatch={handleShowEditFishModal}
                />
            </div>
            <div className="footer-container">
                <hr className="dashboard-line"></hr>
                <div className="dashboard-summary-container">
                    <div className="dashboard-weight">&#8721; kg: {filteredCatches.reduce((sum, fish) => sum + fish.weight, 0).toFixed(2)}</div>
                    <div className="dashboard-length">&#8721; m: {(filteredCatches.reduce((sum, fish) => sum + fish.length, 0) / 100).toFixed(2)}</div>
                </div>
                <div className="dasboard-buttons">
                    <Button className="button-summary" onClick={handleShowSummaryModal}>Výkaz</Button>
                    <Button variant="primary" className="button-addfish" onClick={hadleShowAddFishModal}>Přidat úlovek</Button>
                </div>
            </div>

            {showSummaryModal && (
                <Summary onClose={handleCloseSummaryModal} catches={catches} />
            )}

            {showAddFishModal && (
                <ItemForm
                    onClose={hadleCloseAddFishModal}
                    speciesList={speciesList.filter(species => species.id !== 'all')}
                    initialData={null}
                    onSubmit={handleSubmitCatch}
                />
            )}

            {showEditFishModal && catchToEdit && (
                <ItemForm
                    onClose={handleCloseEditFishModal}
                    speciesList={speciesList.filter(species => species.id !== 'all')}
                    initialData={catchToEdit}
                    onSubmit={handleSubmitCatch}
                />
            )}

            <ConfirmDeleteModal
                show={showConfirmDeleteModal}
                onClose={handleCloseConfirmDeleteModal}
                onConfirm={handleDeleteCatch}
                title="Potvrzení smazání úlovku"
                message="Opravdu chcete smazat tento úlovek? Tuto akci nelze vrátit."
            />
        </div>
    );
}

export default Dashboard;