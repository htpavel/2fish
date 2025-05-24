/* klíčová komponenta
zde se zobrazují úlovky a je implementována veškerá logika */
import React, { useState, useEffect } from 'react';
import SpeciesFiltr from './SpeciesFiltr'; 
import CatchList from './CatchList';     
import './Dashboard.css';                
import Summary from './Summary';         
import Button from 'react-bootstrap/esm/Button'; 
import ItemForm from './ItemForm';       
import Modal from 'react-bootstrap/Modal'; 

const Dashboard = () => {
    // Stavy pro filtraci a zobrazení dat
    const [selectedSpeciesId, setSelectedSpeciesId] = useState('all');
    const [catches, setCatches] = useState([]);
    const [speciesList, setSpeciesList] = useState([]);

    // Stavy pro správu modalů (vyskakovacích oken)
    const [showSummaryModal, setShowSummaryModal] = useState(false); // Pro souhrnný výkaz
    const [showAddFishModal, setShowAddFishModal] = useState(false); // Pro formulář přidání
    const [showEditFishModal, setShowEditFishModal] = useState(false); // Pro formulář editace
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false); // Pro potvrzení smazání

    // Stavy pro dats předávaná do modalů
    const [catchToEdit, setCatchToEdit] = useState(null); // Uchovává data úlovku pro editaci
    const [catchIdToDelete, setCatchIdToDelete] = useState(null); // Uhovává ID úlovku ke smazání

    // Stavy pro načítání a chyby
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Handlery pro filtraci ---
    const handleSpeciesChange = (speciesId) => {
        setSelectedSpeciesId(speciesId);
    };

    // --- Handlery pro modal "Výkaz" (Summary) ---
    const handleShowSummaryModal = () => {
        setShowSummaryModal(true);
    };
    const handleCloseSummaryModal = () => {
        setShowSummaryModal(false);
    };

        const hadleShowAddFishModal = () => {
        setCatchToEdit(null); // Zajištění, že se modal otevře pro přidání (ne pro editaci)
        setShowAddFishModal(true);
    }
    const hadleCloseAddFishModal = () => {
        setShowAddFishModal(false);
    }

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
        if (!catchIdToDelete) return; // Zabrání spuštění, pokud není ID k smazání

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

            // Pokud je smazání úspěšné, aktualizujeme stav 
            setCatches(prevCatches => prevCatches.filter(catchItem => catchItem.id !== catchIdToDelete));
            console.log(`Úlovek s ID ${catchIdToDelete} byl úspěšně smazán.`);

        } catch (err) {
            setError(err);
            console.error("Chyba při mazání úlovku:", err);
            alert(`Chyba při mazání úlovku: ${err.message}`); // Zobrazí uživateli alert
        } finally {
            handleCloseConfirmDeleteModal(); // Vždy zavřeme modal po pokusu o smazání
        }
    };

    
    const handleSubmitCatch = async (catchData) => {
        const isEditing = catchData.id !== null; // Zjistíme, zda jde o editaci podle existence ID
        const url = isEditing ? 'http://localhost:3333/catch/update' : 'http://localhost:3333/catch/create';
        const method = 'POST'; 

        // Najdeme speciesId z speciesListu podle názvu druhu
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
                // Načtení úlovků
                const catchResponse = await fetch('http://localhost:3333/catch/List');
                if (!catchResponse.ok) {
                    throw new Error(`HTTP error! status: ${catchResponse.status} - catch/List`);
                }
                const catchData = await catchResponse.json();
                setCatches(catchData.listFish); 

                // Načtení seznamu druhů ryb
                const speciesResponse = await fetch('http://localhost:3333/species/List');
                if (!speciesResponse.ok) {
                    throw new Error(`HTTP error! status: ${speciesResponse.status} - species/List`);
                }
                const speciesData = await speciesResponse.json();
                // Přidání "Všechny druhy" na začátek seznamu a zformátování
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

    // Filtrování úlovků na základě vybraného druhu
    const filteredCatches = selectedSpeciesId === 'all'
        ? catches
        : catches.filter(catchItem => catchItem.speciesId === selectedSpeciesId);

    // při čekání na server
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
                    onDeleteCatch={handleRequestDeleteCatch} // Funkce pro smazání (s potvrzením)
                    onEditCatch={handleShowEditFishModal} // Funkce pro editaci
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
            {showConfirmDeleteModal && (
                <Modal show={true} onHide={handleCloseConfirmDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Potvrzení smazání</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Opravdu chcete smazat tento úlovek?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseConfirmDeleteModal}>
                            Zrušit
                        </Button>
                        <Button variant="danger" onClick={handleDeleteCatch}>
                            Smazat
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default Dashboard;