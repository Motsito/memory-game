import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";

export default function MatchModal(modalInfo) {
  const { modalStatus, modalText, setModalStatus } = modalInfo;

  const handleClose = () => {
    setModalStatus(false);
  };
  return (
    <>
      <Modal show={modalStatus} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalText}</Modal.Title>
        </Modal.Header>
      </Modal>
    </>
  );
}
