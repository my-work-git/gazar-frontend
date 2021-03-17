import React from 'react';
import Modal from 'react-modal';
import Translate from '../translate';

const ModalStyle = {
  overlay: {
    zIndex: 99,
    background: 'rgba(0, 0, 0, 0.65)',
  },

  content: {
    zIndex: 100,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    padding: 0,
    border: 'none',
    minWidth: 350,
  },
};

const modal = ({ open, title, children, onClose }) => {
  if (process.env.REACT_APP_BUILD_SERVER) {
    return <div />;
  }

  if (document) {
    document.body.style.overflow = open ? 'hidden' : 'auto';
  }

  return (
    <Modal isOpen={open} style={ModalStyle} appElement={document.body} onRequestClose={onClose}>
      <div className="modal-dialog" style={ModalStyle.dialog}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title"><Translate W={title}/></h4>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </Modal>
  )
};

export default modal;
