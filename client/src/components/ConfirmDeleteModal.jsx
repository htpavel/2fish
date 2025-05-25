/*modální okno k potvrzení k vymazání záznamu */

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ConfirmDeleteModal = ({ show, onClose, onConfirm, title, message }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title || 'Potvrzení smazání'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message || 'Opravdu chcete tuto položku smazat?'}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Zrušit
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Smazat
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmDeleteModal;