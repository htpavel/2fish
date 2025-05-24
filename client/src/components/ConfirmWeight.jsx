/* Modální okno překročení váhy úlovků */
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ConfirmWeight = ({ show, onConfirm, onCancel, currentCatchWeight, dailyTotalWeight }) => {
    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Překročení denního limitu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Byl překročen denní váhový limit ryb (7 kg).<br />
                Dosud uložená váha pro tento den: {dailyTotalWeight.toFixed(2)} kg.<br />
                Váha tohoto úlovku: {currentCatchWeight.toFixed(2)} kg.<br />
                Celková váha po uložení: {(dailyTotalWeight + currentCatchWeight).toFixed(2)} kg.<br /><br />
                **Přejete si ulovenou rybu ponechat?**
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Ne (nezachovat úlovek)
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                    Ano (zachovat úlovek)
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmWeight;