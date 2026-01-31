import React from 'react';
import PropTypes from 'prop-types';
import SweetAlert from 'react-bootstrap-sweetalert';
import CloseBtn from '../CloseBtn';

export default function Modal({ showAlert, toggleAlert }) {

  const closeModal = () => {
    toggleAlert(false);
  };

  return (
    <SweetAlert
      show={showAlert}
      showCancel={false}
      showConfirm={false}
      onConfirm={()=>{}}
      style={{ padding: 0, borderRadius: 15 }}
      onCancel={closeModal}
      title=""
      showCloseButton
      customIcon="https://raw.githubusercontent.com/djorg83/react-bootstrap-sweetalert/master/demo/assets/thumbs-up.jpg"
    >
      <div className={'modalContainer'}>
        <CloseBtn closeModalOnly={true} handleClick={closeModal} />
        <p>Download App</p>
        <div className={'dFlex'}>
          <a
            onClick={closeModal}
            target="_blank"
            href="https://play.google.com/store/apps/details?id=com.workmob&hl=en"
            rel="noreferrer"
          >
            <img width="150" src={'https://cdn.workmob.com/stories_workmob/images/common/playstore.png'} alt="playstore" />
          </a>
          <a
            onClick={closeModal}
            target="_blank"
            href="https://apps.apple.com/in/app/workmob/id901802570"
            rel="noreferrer"
          >
            <img width="150" src={'https://cdn.workmob.com/stories_workmob/images/common/appstore.png'} alt="appstore" />
          </a>
        </div>
      </div>
    </SweetAlert>
  );
}

Modal.propTypes = {
  showAlert: PropTypes.bool.isRequired,
  toggleAlert: PropTypes.func.isRequired,
};
