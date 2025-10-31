import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AlertModal(props) {
    return (
        <>
            <Modal show={props.show} onHide={props.close}>
                <Modal.Body>{props.content}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={props.close}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AlertModal;