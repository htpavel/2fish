import React, { useState, useEffect } from 'react';
import SpeciesFiltr from './SpeciesFiltr'; // Předpokládám, že tato komponenta existuje
import CatchList from './CatchList';     // Předpokládám, že tato komponenta existuje
import './Dashboard.css';                 // Styly pro Dashboard
import Summary from './Summary';         // Předpokládám, že tato komponenta existuje
import Button from 'react-bootstrap/esm/Button'; // Bootstrap Button
import ItemForm from './ItemForm';       // Komponenta formuláře pro přidání/úpravu
import Modal from 'react-bootstrap/Modal'; // Bootstrap Modal pro potvrzení smazání

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

    // Stavy pro data předávaná do modalů
    const [catchToEdit, setCatchToEdit] = useState(null); // Uchovává data úlovku pro editaci
    const [catchIdToDelete, setCatchIdToDelete] = useState(null); // Uchovává ID úlovku ke smazání

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

    // --- Handlery pro modal "Přidat úlovek" (ItemForm pro přidání) ---
    const hadleShowAddFishModal = () => {
        setCatchToEdit(null); // Zajištění, že se modal otevře pro přidání (ne pro editaci)
        setShowAddFishModal(true);
    }
    const hadleCloseAddFishModal = () => {
        setShowAddFishModal(false);
    }

    // --- Handlery pro modal "Upravit úlovek" (ItemForm pro editaci) ---
    const handleShowEditFishModal = (catchItem) => {
        setCatchToEdit(catchItem); // Uložíme data úlovku, který chceme editovat
        setShowEditFishModal(true); // Zobrazíme ItemForm
    };
    const handleCloseEditFishModal = () => {
        setShowEditFishModal(false);
        setCatchToEdit(null); // Vynulujeme data
    };

    // --- Handlery pro smazání úlovku s potvrzením ---
    // 1. Krok: Uživatel klikne na smazat -> zobrazí se potvrzovací modal
    const handleRequestDeleteCatch = (id) => {
        setCatchIdToDelete(id);
        setShowConfirmDeleteModal(true);
    };
    // Uzavření potvrzovacího modalu
    const handleCloseConfirmDeleteModal = () => {
        setShowConfirmDeleteModal(false);
        setCatchIdToDelete(null);
    };
    // 2. Krok: Uživatel potvrdí smazání -> provede se API volání
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

            // Pokud je smazání úspěšné, aktualizujeme stav catches
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

    // --- Handler pro odeslání dat z ItemForm (přidání i úprava) ---
    const handleSubmitCatch = async (catchData) => {
        const isEditing = catchData.id !== null; // Zjistíme, zda jde o editaci podle existence ID
        const url = isEditing ? 'http://localhost:3333/catch/update' : 'http://localhost:3333/catch/create';
        const method = 'POST'; // Předpokládáme POST pro oba endpointy

        // Najdeme speciesId z speciesListu podle názvu druhu
        const selectedSpecies = speciesList.find(s => s.name === catchData.speciesName);
        if (!selectedSpecies) {
            alert('Vyberte platný druh ryby.');
            return;
        }

        // Sestavení payloadu pro API požadavek
        const payload = {
            date: catchData.date, // Datum je již ve správném formátu YYYY-MM-DD
            districtNr: parseInt(catchData.districtNr),
            weight: parseFloat(catchData.weight),
            length: parseFloat(catchData.length),
            speciesId: selectedSpecies.id // ID druhu, které API očekává
        };

        // Pokud upravujeme, přidáme ID úlovku do payloadu
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

            const responseData = await response.json(); // Očekáváme odpověď z API (např. nově vytvořený objekt s ID)

            if (isEditing) {
                // Aktualizujeme existující úlovek v catches stavu
                // Předpokládáme, že API buď vrací potvrzení, nebo data aktualizujeme z našeho payloadu
                setCatches(prevCatches =>
                    prevCatches.map(c => (c.id === catchData.id ? { ...c, ...payload, name: catchData.speciesName } : c))
                );
                console.log(`Úlovek s ID ${catchData.id} byl úspěšně upraven.`);
            } else {
                // Přidáme nový úlovek do catches stavu
                // Důležité: Pokud API nevrací ID nově vytvořeného úlovku, musíme si ho nějak vygenerovat
                // nebo provést opětovné načtení všech dat.
                // Zde předpokládám, že responseData.id bude obsahovat ID z API
                setCatches(prevCatches => [...prevCatches, { ...payload, id: responseData.id || Date.now().toString(), name: catchData.speciesName }]);
                console.log('Nový úlovek byl úspěšně přidán.');
            }

            // Zavřeme příslušný modal (pro editaci nebo přidání)
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

    // --- Efekt pro načítání dat při prvním renderování ---
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
                setCatches(catchData.listFish); // Předpokládá, že úlovky jsou v catchData.listFish

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
    }, []); // Prázdné pole závislostí znamená, že se spustí jen jednou po prvním renderu

    // Filtrování úlovků na základě vybraného druhu
    const filteredCatches = selectedSpeciesId === 'all'
        ? catches
        : catches.filter(catchItem => catchItem.speciesId === selectedSpeciesId);

    // --- Podmíněné renderování na základě stavu načítání a chyb ---
    if (loading) {
        return <div>Načítám data...</div>;
    }

    if (error) {
        return <div>Chyba při načítání dat: {error.message}</div>;
    }

    // --- Vlastní renderování komponenty Dashboard ---
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
                    {/* Suma váhy a délky úlovků */}
                    <div className="dashboard-weight">&#8721; kg: {filteredCatches.reduce((sum, fish) => sum + fish.weight, 0).toFixed(2)}</div>
                    <div className="dashboard-length">&#8721; m: {(filteredCatches.reduce((sum, fish) => sum + fish.length, 0) / 100).toFixed(2)}</div>
                </div>
                <div className="dasboard-buttons">
                    <Button className="button-summary" onClick={handleShowSummaryModal}>Výkaz</Button>
                    <Button variant="primary" className="button-addfish" onClick={hadleShowAddFishModal}>Přidat úlovek</Button>
                </div>
            </div>

            {/* Modální okno pro souhrnný výkaz */}
            {showSummaryModal && (
                <Summary onClose={handleCloseSummaryModal} catches={catches} />
            )}

            {/* Modální okno pro přidání nového úlovku */}
            {showAddFishModal && (
                <ItemForm
                    onClose={hadleCloseAddFishModal}
                    speciesList={speciesList.filter(species => species.id !== 'all')} // Bez "Všechny druhy"
                    initialData={null} // Nepředáváme initialData pro nový úlovek
                    onSubmit={handleSubmitCatch} // Funkce pro odeslání dat formuláře
                />
            )}

            {/* Modální okno pro úpravu existujícího úlovku */}
            {showEditFishModal && catchToEdit && ( // Zobrazí se, jen když je true a catchToEdit není null
                <ItemForm
                    onClose={handleCloseEditFishModal}
                    speciesList={speciesList.filter(species => species.id !== 'all')} // Bez "Všechny druhy"
                    initialData={catchToEdit} // Předáváme data úlovku k editaci
                    onSubmit={handleSubmitCatch} // Funkce pro odeslání dat formuláře
                />
            )}

            {/* Modální okno pro potvrzení smazání */}
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