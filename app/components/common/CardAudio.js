'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { getAltImg } from '../../utils';
import { EVENT_TYPE } from '../../constants/firebaseString';
import { customEvent } from '@/app/firebase/firebase';
import { fetchStoryDetail } from '@/app/lib/features/blogSlice';
import PodcastAudioPlaySection from '../PodcastDetail/PodcastAudioPlaySection';
import { WHITE } from '../../constants/colors';

const CardAudio = (props) => {
  const dispatch = useDispatch();
  const isHindi = useSelector(state => state.blog.isHindi);
  const { cardId, clickBtn, play, colSize = 4, screenName, handleClick } = props;
  let {
    thumb,
    job_title,
    job_title_hindi = '',
    profile_pic,
    slug,
    company_name,
    company_name_hindi = '',
    location,
    location_hindi = '',
    storySlug,
    storyType,
    storyHeading,
    storyHeading_hindi = '',
    industry_hindi = '',
  } = props.audioStory;

  if (isHindi) {
    job_title = job_title_hindi || job_title;
    company_name = company_name_hindi || company_name;
    location = location_hindi || location;
    storyHeading = storyHeading_hindi || storyHeading;
    storyType = industry_hindi || storyType;
  }

  const cardClick = () => {
    if (handleClick) {
      handleClick();
    }
    customEvent(EVENT_TYPE.insightCardClick, {
      screen_name: screenName,
      audio_slug: slug,
    });

    dispatch(fetchStoryDetail(slug, 'audio-story'));
  };

  return (
    <>
      <div
        className={`col-lg-${colSize} col-md-4 col-6 mb-sm-5 mt-2 text-decoration-none mb-2 px-sm-2 px-1 d-flex`}
      >
        <div style={styles.card} className="position-relative card-audio">
          <figure className="mb-0">
            <Link
              style={{ maxHeight: 400, maxWidth: 400 }}
              href={isHindi ? `/hindi/podcasts/${slug}` : `/podcasts/${slug}`}
              className={`text-decoration-none rounded-circle rounded-image position-relative ${
                play == cardId ? 'active' : 'inactive'
              }`}
              onClick={cardClick}
            >
              <span
                className="figure-img img-fluid rounded-circle overflow-hidden lazy-load-image-background blur"
                style={{
                  color: 'transparent',
                  display: 'inline-block',
                  height: '100%',
                  width: '100%',
                  maxWidth: 'inherit',
                  maxHeight: 'inherit',
                }}
              >
                <img
                  loading="lazy"
                  style={{ position: 'relative', zIndex: 2, borderRadius: 'inherit' }}
                  width="100%"
                  height="100%"
                  alt={getAltImg(profile_pic || thumb)}
                  src={profile_pic || thumb}
                />
              </span>
              {play == cardId && <div className="sonar-wave"></div>}
            </Link>
            <figcaption className="figure-caption text-right text-center">
              {colSize == 8 ? (
                <Link
                  style={{ color: 'rgba(255,255,255,0.8)', pointerEvents: 'auto' }}
                  href={`/podcasts/${storySlug}`}
                  className={`badge dark ${isHindi ? 'font-khand' : ''}`}
                >
                  {storyType}
                </Link>
              ) : (
                <p className={`badge dark ${isHindi ? 'font-khand' : ''}`}> {storyType} </p>
              )}
              <div>
                <div className="d-flex align-items-start justify-content-center">
                  {!!clickBtn && (
                    <span
                      onClick={(e) => clickBtn(e, cardId, play == cardId ? 'active' : 'inactive')}
                      className="audioPlay"
                    >
                      <i
                        id={`audio-play-pause-${play == cardId ? 'active' : 'inactive'}`}
                        className={`icon icon-${play == cardId ? 'pause-1' : 'play'}`}
                      ></i>
                    </span>
                  )}
                  <Link
                    className="text-decoration-none"
                    href={`/podcasts/${slug}`}
                    onClick={cardClick}
                  >
                    <p
                      style={styles.title}
                      className={`m-0 px-2 px-md-2 text-center caption font-weight-bold font-30 ${isHindi ? 'font-khand' : 'montserrat-regular'}`}
                    >
                      {storyHeading}
                    </p>
                  </Link>
                </div>
                <Link
                  className="text-decoration-none"
                  href={`/podcasts/${slug}`}
                  onClick={cardClick}
                >
                  <div className="d-flex flex-wrap align-items-center justify-content-center mt-3">
                    {!!company_name && (
                      <span
                        style={{ marginLeft: -2 }}
                        className={`d-flex font-weight-bold align-items-start location px-0 px-md-2 medium mb-1 mt-0 mr-md-0 mr-2 ${isHindi ? 'font-khand' : ''}`}
                      >
                        <i className="icon icon-company" />
                        {!!job_title && colSize == 8
                          ? `${job_title} at ${company_name}`
                          : company_name}
                      </span>
                    )}
                    {!!location && (
                      <span
                        style={{ marginLeft: -2 }}
                        className={`d-flex font-weight-bold align-items-center location px-0 px-md-2 medium mb-1 mt-0 text-capitalize ${isHindi ? 'font-khand' : ''}`}
                      >
                        <i className="icon icon-location" />
                        {location}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
      {play == cardId && <PodcastAudioPlaySection {...props} />}
    </>
  );
};

export default CardAudio;

const styles = {
  card: {
    padding: '20px 10px',
    overflow: 'hidden',
    borderRadius: 10,
    minHeight: 200,
    background: '#070707',
    margin: '0 auto',
    boxShadow: '0px 6px 12px #00000029',
  },
  bottomBg: {
    bottom: 5,
    left: 0,
    background:
      'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)',
  },
  title: {
    color: WHITE,
    lineHeight: '1.5em',
  },
};
