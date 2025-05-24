/* komponenta pro přidávání, editaci a mazání druhů ryb */
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Species.css';
import SpeciesForm from './SpeciesForm';


const Species = () => {
   const [speciesList, setSpeciesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showSpeciesFormModal, setShowSpeciesFormModal] = useState(false);
    const [speciesToEdit, setSpeciesToEdit] = useState(null);

    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [speciesIdToDelete, setSpeciesIdToDelete] = useState(null);

    const fetchSpecies = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3333/species/List');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - species/List`);
            }
            const data = await response.json();
            const fetchedSpecies = Array.isArray(data.listSP) ? data.listSP : [];

            const sortedSpecies = [...fetchedSpecies].sort((a, b) =>
                a.name.localeCompare(b.name, 'cs', { sensitivity: 'base' })
            );

            setSpeciesList(sortedSpecies);
        } catch (err) {
            setError(err);
            console.error("Chyba při načítání druhů:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecies();
    }, []);

    const handleAddSpecies = () => {
        setSpeciesToEdit(null);
        setShowSpeciesFormModal(true);
    };

    const handleEditSpecies = (species) => {
        setSpeciesToEdit(species);
        setShowSpeciesFormModal(true);
    };

    const handleCloseSpeciesFormModal = () => {
        setShowSpeciesFormModal(false);
        setSpeciesToEdit(null);
    };

    const handleSubmitSpecies = async (speciesData) => {
        const isEditing = speciesData.id !== null;
        const url = isEditing ? 'http://localhost:3333/species/Update' : 'http://localhost:3333/species/create';
        const method = 'POST';

        const payload = isEditing
            ? { id: speciesData.id, name: speciesData.name }
            : { name: speciesData.name };

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
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Nepodařilo se uložit druh'}`);
            }

            const responseData = await response.json();

            if (isEditing) {
                setSpeciesList(prevList => {
                    const updatedList = prevList.map(s => (s.id === responseData.id ? responseData : s));
                    return updatedList.sort((a, b) =>
                        a.name.localeCompare(b.name, 'cs', { sensitivity: 'base' })
                    );
                });
                console.log(`Druh s ID ${responseData.id} byl úspěšně upraven.`);
            } else {
                setSpeciesList(prevList => {
                    const newList = [...prevList, responseData];
                    return newList.sort((a, b) =>
                        a.name.localeCompare(b.name, 'cs', { sensitivity: 'base' })
                    );
                });
                console.log('Nový druh byl úspěšně přidán.');
            }

            handleCloseSpeciesFormModal();

        } catch (err) {
            setError(err);
            console.error("Chyba při ukládání druhu:", err);
            alert(`Chyba při ukládání druhu: ${err.message}`);
        }
    };

    const handleRequestDeleteSpecies = (id) => {
        setSpeciesIdToDelete(id);
        setShowConfirmDeleteModal(true);
    };

    const handleCloseConfirmDeleteModal = () => {
        setShowConfirmDeleteModal(false);
        setSpeciesIdToDelete(null);
    };

    const handleDeleteSpecies = async () => {
        if (!speciesIdToDelete) return;

        try {
            const response = await fetch('http://localhost:3333/species/Delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: speciesIdToDelete }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Nepodařilo se smazat druh'}`);
            }

            setSpeciesList(prevList => {
                const filteredList = prevList.filter(s => s.id !== speciesIdToDelete);
                return filteredList.sort((a, b) =>
                    a.name.localeCompare(b.name, 'cs', { sensitivity: 'base' })
                );
            });
            console.log(`Druh s ID ${speciesIdToDelete} byl úspěšně smazán.`);

        } catch (err) {
            setError(err);
            console.error("Chyba při mazání druhu:", err);
            alert(`Chyba při mazání druhu: ${err.message}`);
        } finally {
            handleCloseConfirmDeleteModal();
        }
    };

    if (loading) {
        return <div className="species-loading">Načítám seznam druhů...</div>;
    }

    if (error) {
        return <div className="species-error">Chyba při načítání druhů: {error.message}</div>;
    }

    return (
        <div className="species-dashboard-container">
            <h2>Správa druhů ryb</h2>
            <div className="species-header-controls">
                <Button variant="primary" onClick={handleAddSpecies}>Přidat nový druh</Button>
            </div>

            {speciesList.length === 0 ? (
                <p>Žádné druhy ryb nejsou k dispozici.</p>
            ) : (
                <ul className="species-list">
                    {speciesList.map((species) => (
                        <li key={species.id} className="species-item">
                            <span className="species-name">{species.name}</span>
                            <div className="species-actions">
                                <img
                                    src={"../edit.svg"}
                                    alt="Upravit"
                                    className="action-icon edit-icon"
                                    onClick={() => handleEditSpecies(species)}
                                    title="Upravit druh"
                                />
                                <img
                                    src={"../delete.svg"}
                                    alt="Smazat"
                                    className="action-icon delete-icon"
                                    onClick={() => handleRequestDeleteSpecies(species.id)}
                                    title="Smazat druh"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {showSpeciesFormModal && (
                <SpeciesForm
                    onClose={handleCloseSpeciesFormModal}
                    onSubmit={handleSubmitSpecies}
                    initialData={speciesToEdit}
                />
            )}

            {showConfirmDeleteModal && (
                <Modal show={true} onHide={handleCloseConfirmDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Potvrzení smazání</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Opravdu chcete smazat tento druh ryby?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseConfirmDeleteModal}>
                            Zrušit
                        </Button>
                        <Button variant="danger" onClick={handleDeleteSpecies}>
                            Smazat
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Species;