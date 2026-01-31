import React from 'react';

const CloseBtn = (props) => {
  const handleClick = () => {
    // props?.setLayoverPlayButton(false);
    if (!!props.closeModalOnly) {
      props.handleClick();
    } else {
      if (!!props.goBack) {
        if (props.history.action == 'POP') {
          props.history.push('/');
          props.location.pathname == "/voices" && localStorage.removeItem('searchValue');
          props.setLayoverPlayButton(false);
        } else {
          props.goBack();
          props.setLayoverPlayButton(false);
        }
      } else {
        if (!props.location.state && props.location.pathname == '/merikahani') {
          props.history.push('/');
        }else if(props.location.pathname == '/create') {
          props.history.push('/merikahani');
        } else {
          props.history.goBack();
          props.setLayoverPlayButton(false);
        }
      }
    }
  };

  return (
    <div className="waveBtn animate__animated animate__jello" style={{pointerEvents: 'none'}}>
      <i
        style={{pointerEvents: 'auto'}}
        onClick={handleClick}
        className={`btnClose icon icon-cancel d-flex align-items-center justify-content-center rounded-circle font-weight-bold`}
      />
      <div
        onClick={handleClick}
        className="closeBtnWave d-flex align-items-center justify-content-center"
        style={{ backgroundColor: props.bgColor || '#BF40E4', cursor: 'pointer', pointerEvents: 'auto' }}
      >
        &nbsp;
      </div>
    </div>
  );
};

export default CloseBtn;
