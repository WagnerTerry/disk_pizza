import React from 'react';
import Modal from 'react-modal';
import './Modal.scss'

Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0.4)';

const customStyles = {
    content: {
        top: '22%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: "90%",
        height: '30vh'
    },
};

export default function MyModal(props) {
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = "black"
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div>
            <button onClick={openModal}>{props.show}</button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className="modal-header">
                    <h2 ref={(_subtitle) => (subtitle = _subtitle)}>{props.title}</h2>
                    <span onClick={closeModal}>X</span>
                </div>
                <div>{props.children}</div>
                {/* <form>
                    <input />
                    <button>tab navigation</button>
                    <button>stays</button>
                    <button>inside</button>
                    <button>the modal</button>
                </form> */}
            </Modal>
        </div>
    );
}