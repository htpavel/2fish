/*modální formulář pro druhy ryb*/
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const SpeciesForm = ({ onClose, onSubmit, initialData }) => {
    const [speciesName, setSpeciesName] = useState('');
    const [speciesId, setSpeciesId] = useState(null); // Pro uchování ID při editaci

    useEffect(() => {
        if (initialData) {
            // Režim editace: předvyplníme formulář
            setSpeciesName(initialData.name);
            setSpeciesId(initialData.id);
        } else {
            // Režim přidání: resetujeme formulář
            setSpeciesName('');
            setSpeciesId(null);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!speciesName.trim()) {
            alert('Název druhu nesmí být prázdný.');
            return;
        }

        // Odesíláme objekt s ID (pokud je editace) a názvem
        onSubmit({
            id: speciesId, // Bude null pro nové, nebo existující ID pro editaci
            name: speciesName.trim()
        });
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? 'Upravit druh ryby' : 'Přidat nový druh ryby'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Název druhu</Form.Label>
                        <Form.Control
                            type="text"
                            value={speciesName}
                            onChange={(e) => setSpeciesName(e.target.value)}
                            placeholder="Např. Kapr obecný"
                            required
                        />
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onClose}>
                            Zrušit
                        </Button>
                        <Button variant="primary" type="submit">
                            {initialData ? 'Uložit změny' : 'Přidat druh'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SpeciesForm;