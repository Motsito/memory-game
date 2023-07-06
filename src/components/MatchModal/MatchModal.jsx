import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function MatchModal({ modalStatus, modalText, setModalStatus }) {
  const handleClose = () => {
    setModalStatus(false);
  };
  return (
    <>
      <Modal show={modalStatus} onHide={handleClose}>
        <Modal.Body className="d-flex justify-content-between">
          <Modal.Title>{modalText}</Modal.Title>
          <Button variant="danger" size="md" onClick={() => handleClose()}>
            X
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
