'use client';

import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { WHITE } from '../../constants/colors';
import SocialShare from '../common/SocialShare';
import { COMMON_HASHTAG } from '../../constants/localString';
import { getAltImg } from '../../utils';
import AudioPlayer from 'react-h5-audio-player';

const PodcastAudioPlaySection = (props) => {
  const {
    metaTitle,
    profile_pic,
    company_name,
    location,
    storyType,
    storyHeading,
    workmobUserId,
    videoUrl,
  } = props.audioStory;

  const [showSocial, toggleSocialOption] = React.useState(false);

  React.useEffect(() => {}, []);

  const updateButtonIcon = (type) => {
    if (!!document.getElementById('audio-play-pause-active')) {
      if (type == 'pause') {
        document.getElementById('audio-play-pause-active').classList.remove('icon-pause-1');
        document.getElementById('audio-play-pause-active').classList.add('icon-play');
      } else {
        document.getElementById('audio-play-pause-active').classList.remove('icon-play');
        document.getElementById('audio-play-pause-active').classList.add('icon-pause-1');
      }
    }
  };

  const autoPlayOnLoad = () => {
    //
  };

  return (
    <div className="fixed-bottom animate__animated animate__slideInUp d-flex align-items-center justify-content-between py-2 py-md-0 px-2 audio-main-container">
      <div className="col-left d-none d-md-block">
        <figure className={`m-0 d-flex align-items-center`}>
          <div className={`rounded-circle rounded-image small position-relative active mr-3`}>
            <LazyLoadImage
              style={{ position: 'relative', zIndex: 2, borderRadius: 'inherit' }}
              visibleByDefault={true}
              effect="blur"
              width="100%"
              height="100%"
              wrapperClassName="figure-img img-fluid rounded-circle overflow-hidden"
              alt={getAltImg(profile_pic)}
              src={profile_pic}
            />
            <div className="sonar-wave"></div>
          </div>
          <figcaption className="figure-caption text-left">
            <p className="badge dark mb-2"> {storyType} </p>
            <div>
              <div className="d-flex align-items-start justify-content-start">
                <p style={styles.title} className="m-0 text-left caption montserrat-regular font-weight-bold font-16">
                  {storyHeading}
                </p>
              </div>
              <div className="d-md-flex flex-wrap d-none align-items-start justify-content-start mt-1">
                {!!company_name && (
                  <span
                    style={{ marginLeft: -2 }}
                    className="d-flex font-weight-bold align-items-center location px-0 pr-md-2 small mb-1 mt-0 mr-0"
                  >
                    <i className="icon icon-company" />
                    {company_name}
                  </span>
                )}
                {!!location && (
                  <span
                    style={{ marginLeft: -2 }}
                    className="d-flex font-weight-bold align-items-center location px-0 pr-md-2 small mb-1 mt-0"
                  >
                    <i className="icon icon-location" />
                    {location}
                  </span>
                )}
              </div>
            </div>
          </figcaption>
        </figure>
      </div>
      <div className="col-center flex-grow-1">
        <AudioPlayer
          autoPlay={true}
          src={videoUrl}
          muted={false}
          layout="stacked-reverse"
          showJumpControls={false}
          onPause={(e) => updateButtonIcon('pause')}
          onPlay={(e) => updateButtonIcon('play')}
          onCanPlayThrough={autoPlayOnLoad}
        />
        <button id="unmuteButton"></button>
      </div>
      <div className="col-right">
        <ul className="d-flex list-inline justify-content-end mb-0 align-items-center audio-btns">
          <li className="position-relative" onClick={(e) => toggleSocialOption(!showSocial)}>
            <i className="icon icon-share" />
            {!!showSocial && (
              <SocialShare
                shareFrom="podcast"
                emailText={metaTitle}
                storyHeading={storyHeading}
                twitterTitle={COMMON_HASHTAG.common}
                emailSub="Listen to this inspiring story"
                fbTitle={COMMON_HASHTAG.inspiringStories}
              />
            )}
          </li>
          <li>
            <a
              className="text-white"
              href={`https://workmob.com/?likeVideo=${workmobUserId}`}
              target="_blank"
            >
              <i className="icon icon-heart-filled" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PodcastAudioPlaySection;

const styles = {
  title: {
    color: WHITE,
    lineHeight: '1.3em',
  },
};
