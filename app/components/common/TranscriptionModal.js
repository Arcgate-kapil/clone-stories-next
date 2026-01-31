import React from 'react';
import PropTypes from 'prop-types';

const TranscriptionModal = props => {
  const { toggleTranscription, transcript, storyHeading, category   } = props;
  return (
    <>
    <div style={{background:'rgba(0,0,0,0.8)'}} className="modal fade show d-block" id="exampleModalCenter" tabIndex="-1" role="dialog" ariaLabelledBy="exampleModalCenterTitle" ariaHidden="true">
      <div style={{maxWidth:'100%'}} className="modal-dialog modal-dialog-centered justify-content-center animate__animated animate__fadeInDown animate__faster" role="document">
        <div  className="modal-content w-75">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">{storyHeading} - {category} Transcript</h5>
            <button onClick={(e)=>toggleTranscription(false)} type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div dangerouslySetInnerHTML={{ __html:transcript}} />
          </div>
          <div className="modal-footer">
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

TranscriptionModal.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  toggleTranscription: PropTypes.func
};

TranscriptionModal.defaultProps = {
  data: null,
  toggleTranscription: null
};

export default TranscriptionModal;
