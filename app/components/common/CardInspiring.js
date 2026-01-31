'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { YELLOW } from '../../constants/colors';
import { getAltImg } from '../../utils';
import { EVENT_TYPE } from '../../constants/firebaseString';
import { customEvent } from '@/app/firebase/firebase';

const CardInspiring = (props) => {
  const dispatch = useDispatch();
  const { colSize = 4, pageId = '', isHindi } = props;
  let {
    thumb,
    slug,
    storyType,
    location_hindi = '',
    storyHeading = '',
    storyHeading_hindi = '',
    screenName,
    location,
    company_name,
    company_name_hindi = '',
    industry_hindi = '',
  } = props.story;

  if (isHindi) {
    location = location_hindi || location;
    storyHeading = storyHeading_hindi || storyHeading;
    company_name = company_name_hindi || company_name;
    storyType = industry_hindi || storyType;
  }

  const cardClick = () => {
    customEvent(EVENT_TYPE.storyCardClick, {
      screen_name: screenName,
      story_slug: slug,
    });
  };

  const handleClick = () => {
    if (props?.onStoreSession) {
      props.onStoreSession();
    }
    cardClick();
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <Link
      href={isHindi ? `/hindi/${slug}` : `/${slug}`}
      style={{ minHeight: 243 }}
      onClick={handleClick}
      className={`col-6 col-md-${colSize} mb-sm-5 mb-2 mt-2 px-xl-5 px-md-3 px-1 insipiringCardContent`}
    >
      <div style={{ position: 'relative' }}>
        <div style={{ paddingTop: '178%' }}></div>
        <div style={styles.card}>
          <Image
            src="https://cdn.workmob.com/stories_workmob/images/common/phone-frame.png"
            alt="frame"
            fill
            style={{ zIndex: 1 }}
            className="h-100 position-absolute w-100 frame"
          />
          <div className='w-100 h-100 lazyLoad-card-inspiring lazy-load-image-background blur lazy-load-image-loaded' style={{ color: 'transparent', display: 'inline-block' }}>
            <Image
              src={thumb}
              alt={getAltImg(thumb)}
              fill
            />
          </div>
          <div
            style={styles.bottomBg}
            className="position-absolute w-100 py-lg-3 py-3 px-1 px-md-2 px-lg-2 px-xl-3 caption-container"
          >
            {!pageId && (
              <p className="px-0 px-md-2 mb-0 category-badge">
                <small className={`badge badge-dark rounded p-1 small ${isHindi ? 'font-khand' : ''}`}>{storyType}</small>
              </p>
            )}
            {!!location && (
              <span
                style={{ marginLeft: -2 }}
                className={`d-sm-flex d-md-none align-items-center location px-0 px-md-2 small mb-1 mt-0 ${isHindi ? 'font-khand' : ''}`}
              >
                <i className="icon icon-location" />
                {location}
              </span>
            )}
            <p
              style={styles.title}
              className={`m-0 px-2 px-md-2 text-left caption font-16 ${isHindi ? 'font-khand' : 'font-alata'}`}
            >
              {storyHeading}
            </p>
            <div className="d-md-flex flex-wrap d-none align-items-center justify-content-start mt-1">
              {!!company_name && (
                <span
                  style={{ marginLeft: -2 }}
                  className={`d-flex align-items-center location px-0 px-md-2 small mb-1 mt-0 mr-0 ${isHindi ? 'font-khand' : ''}`}
                >
                  <i className="icon icon-company" />
                  {company_name}
                </span>
              )}
              {!!location && (
                <span
                  style={{ marginLeft: -2 }}
                  className={`d-flex align-items-center location px-0 px-md-2 small mb-1 mt-0 ${isHindi ? 'font-khand' : ''}`}
                >
                  <i className="icon icon-location" />
                  {location}
                </span>
              )}
            </div>
          </div>
          <span className="position-absolute playBtn text-white">
            <i className="icon icon-play" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CardInspiring;

const styles = {
  card: {
    borderRadius: 10,
    background: 'rgba(255,255,255,0.1)',
    boxShadow: '0px 6px 12px rgba(255,255,255,0.3)',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
  bottomBg: {
    bottom: 5,
    left: 0,
    background:
      'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)',
  },
  title: {
    color: YELLOW,
    lineHeight: '1.3em',
    wordWrap: 'break-word',
  },
};
