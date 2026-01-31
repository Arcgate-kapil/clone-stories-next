/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { EVENT_TYPE } from '../../constants/firebaseString';
import { customEvent } from '../../actions/firebase';
// import { MAIL_BODY, MAIL_SUBGECT, WM_CDN_PATH } from '../../constants/localString';

const PromoCard = ({ promoId, cardType }) => {
  const promoClick = () => {
    if (cardType == 'signupPromo') {
      customEvent(EVENT_TYPE.signupClick);
    } else if (cardType == 'promo_add_video') {
      customEvent(EVENT_TYPE.promoCardVideo);
    }
  };

  return (
    <div id={promoId} className="promoCard fixed-bottom transitionAl">
      {
        <a
          onClick={promoClick}
          href={cardType == 'promo_signup' ? `https://www.workmob.com/?step=signup` : `/merikahani`}
          target={cardType == 'promo_signup' ? '_blank' : '_self'}
        >
          <img
            className="w-100"
            src={`https://workmob-v3.s3.ap-south-1.amazonaws.com/stories_workmob/images/common/${cardType}.png`}
            alt={cardType}
          />
        </a>
      }
    </div>
  );
};

PromoCard.defaultProps = {
  promoId: 'promoCard',
};

PromoCard.propTypes = {};

export default PromoCard;

{
  /* <div id={storyId} className='signupPromo fixed-bottom transitionAll  d-flex align-items-center flex-column justify-content-center p-3'>
  <img width='105' className="mb-2" src='https://cdn.workmob.com/stories_workmob/images/common/mobile_banner.png' />
  <img width='100' className="mb-2" src='https://cdn.workmob.com/stories_workmob/images/common/logo.png' />
  <p className=" small text-center mb-2 opacity-5">{STORY_LIST.signupPromo}</p>
  <a className="btn btn-outline-secondary py-2 px-3 font-weight-normal btn-sm mx-auto text-white" onClick={signUpClick} href="https://www.workmob.com/?step=signup" target="_blank">{STORY_LIST.signupBtn}</a>
</div> */
}
