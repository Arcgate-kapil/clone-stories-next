/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BLACK } from '../../constants/colors';
import { EVENT_TYPE } from '../../constants/firebaseString';
import { customEvent } from '../../actions/firebase';
import { DefaultPlayer as Video } from './Video';
import ReactHlsPlayer from '../HSL';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';

const vidControl = [
  'PlayPause',
  'Seek',
  'Time',
  /*"Volume",*/
  // "Fullscreen"
];

const CardVideo = props => {
  const { videoUrl, screenName, videoId, poster, videoView, title, shareClassName,togglePlay} = props;
  const [isVideoMute, toggleVideoVoice] = React.useState(false);
  const [showLoader, toggleLoader] = React.useState(true);
  const playerRef = React.useRef();
  const { pathname } = useLocation();
 

  React.useEffect(() => {
    if (videoView == 'mobile') {
      document.getElementById('btnMute').click();
    }
  }, []);

  const prevVideoUrl = React.useRef(videoUrl);
  React.useEffect(() => {
    const vid = document.querySelectorAll('video');
    if (!!vid) {
      if (videoId == 'promoVideo') {
        return;
      } else {
        if (prevVideoUrl != videoUrl && videoId != 'promoVideo') {
          [].forEach.call(vid, function (vid) {
            // reload video
            if (vid.id != 'promoVideo') {
              // vid.load();
              if (videoUrl.split('.').pop() != 'm3u8') {
                vid.src = videoUrl;
              }
              vid.currentTime = 0;
            }
          });
        }
      }
    }
    if (props?.userClick != undefined) {
      toggleVideoSound();
    }
  }, [videoUrl]);

  const toggleVideoSound = () => {
    let isVideoMutes = sessionStorage.getItem('isVideoMute');
    isVideoMutes = !!isVideoMutes && isVideoMutes == 'false' ? false : true;

    const _elem = document.getElementById('storyVideo');
    if (!!_elem) {
      _elem.muted = !isVideoMutes;
      sessionStorage.setItem('isVideoMute', isVideoMutes);
    }

    toggleVideoVoice(typeof props.isMute === 'boolean' ? props.isMute : isVideoMutes);
  };

  const cardVideoClick = () => {
    customEvent(EVENT_TYPE.videoClick, {
      screen_name: screenName,
      videoUrl: videoUrl,
    });
  };

  const volumClick = () => {
    toggleVideoVoice(!isVideoMute);
    const _elem = document.getElementById('storyVideo');
    if (!!_elem) {
      _elem.muted = isVideoMute;
      sessionStorage.setItem('isVideoMute', !isVideoMute);
    }
  };

  const startVideo = () => {
    toggleLoader(false);
  };

  React.useEffect(() => {
    const player = playerRef?.current;

    const checkVisibility = () => {
      if (
        player?.getBoundingClientRect()?.top < innerHeight - 30 &&
        player?.getBoundingClientRect()?.bottom > 300
      ) {
        if (player?.paused) {
          player?.play();
        }
      } else {
        player?.pause();
      }
    };

    document.addEventListener('scroll', checkVisibility);

    return () => document.removeEventListener('scroll', checkVisibility);
  }, []);

  return (
    <div onClick={cardVideoClick} className='videoContainer mobileContianer'>
      {videoUrl.split('.').pop() == 'm3u8' ? (
        <div>
          <ReactHlsPlayer
            url={`${videoUrl}`}
            id={videoId}
            preload='auto'
            style={{ background: BLACK, outline: 'none', marginLeft: 0, marginTop: 0 }}
            loop={videoId == 'promoVideo' ? true : false}
            controls={shareClassName ?  false : videoId == 'promoVideo' ? [] : vidControl}
            autoPlay
            width='100%'
            height='521px'
            poster={poster}
            startVideo={startVideo}
            // onLoadedData={(event) => {
            //   event.target.style.height = 'auto';
            // }}
            playerRef={props.playerRef || playerRef}
            muted={props?.userClick ? false : true}
            title={title ? title : ''}
            className={shareClassName ? shareClassName : ''}
            onEnded={togglePlay}
          />
        </div>
      ) : (
        <Video
          id={videoId}
          preload='auto'
          style={{
            background: BLACK,
            outline: 'none',
            marginLeft: 0,
            marginTop: 0,
          }}
          muted
          loop={videoId == 'promoVideo' ? true : false}
          controls={videoId == 'promoVideo' ? [] : vidControl}
          autoPlay
          width='100%'
          height='521px'
          poster={poster}
          onCanPlayThrough={startVideo}
          onLoadedData={event => {
            event.target.style.height = 'auto';
          }}
          title={title ? title : ''}
        >
          <source src={JSON.parse(JSON.stringify(`${videoUrl}`))} type='video/mp4' />
        </Video>
      )}
      
      {videoId == 'storyVideo' && pathname !== '/merikahani' && (
        <div id='btnMute' rel='btnMute' onClick={volumClick} className='mutem3u8Btn'>
          {isVideoMute ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='30'
              height='30'
              viewBox='0 0 24 24'
              className='rh5v-Volume_icon'
              fill='#fff'
            >
              <path d='M14.016 3.234C18.047 4.125 21 7.734 21 12s-2.953 7.875-6.984 8.766v-2.063c2.906-.844 4.969-3.516 4.969-6.703s-2.063-5.859-4.969-6.703V3.234zM16.5 12a4.451 4.451 0 0 1-2.484 4.031V7.968c1.5.75 2.484 2.25 2.484 4.031zM3 9h3.984L12 3.984v16.031l-5.016-5.016H3v-6z'></path>
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='30'
              height='30'
              viewBox='0 0 24 24'
              className='rh5v-Volume_icon'
              fill='#fff'
            >
              <path d='M12 3.984v4.219L9.891 6.094zM4.266 3L21 19.734 19.734 21l-2.063-2.063c-1.078.844-2.297 1.5-3.656 1.828v-2.063c.844-.234 1.594-.656 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016H2.999v-6h4.734L2.999 4.264zm14.718 9c0-3.188-2.063-5.859-4.969-6.703V3.234c4.031.891 6.984 4.5 6.984 8.766a8.87 8.87 0 0 1-1.031 4.172l-1.5-1.547A6.901 6.901 0 0 0 18.984 12zM16.5 12c0 .234 0 .422-.047.609l-2.438-2.438V7.968c1.5.75 2.484 2.25 2.484 4.031z'></path>
            </svg>
          )}
          {
            <p className='position-absolute muteText'>{`Tap to ${
              !isVideoMute ? 'unmute' : 'mute'
            }`}</p>
          }
        </div>
      )}
      {!!showLoader && videoId != 'promoVideo' && <BufferVideo />}
    </div>
  );
};

CardVideo.defaultProps = {
  videoUrl: '',
  videoView: '',
  videoId: 'storyVideo',
};

CardVideo.propTypes = {
  videoUrl: PropTypes.string.isRequired,
};

export default CardVideo;

export const BufferVideo = () => {
  return (
    <span className='rh5v-Overlay_inner d-flex align-items-center justify-content-center'>
      <svg width='30' height='30' viewBox='0 0 58 58' xmlns='http://www.w3.org/2000/svg'>
        <g fill='none' fillRule='evenodd'>
          <g transform='translate(2 1)' stroke='#FFF' strokeWidth='1.5'>
            <circle cx='42.601' cy='11.462' r='5' fillOpacity='1' fill='#fff'>
              <animate
                attributeName='fill-opacity'
                begin='0s'
                dur='1.3s'
                values='1;0;0;0;0;0;0;0'
                calcMode='linear'
                repeatCount='indefinite'
              />
            </circle>
            <circle cx='49.063' cy='27.063' r='5' fillOpacity='0' fill='#fff'>
              <animate
                attributeName='fill-opacity'
                begin='0s'
                dur='1.3s'
                values='0;1;0;0;0;0;0;0'
                calcMode='linear'
                repeatCount='indefinite'
              />
            </circle>
            <circle cx='42.601' cy='42.663' r='5' fillOpacity='0' fill='#fff'>
              <animate
                attributeName='fill-opacity'
                begin='0s'
                dur='1.3s'
                values='0;0;1;0;0;0;0;0'
                calcMode='linear'
                repeatCount='indefinite'
              />
            </circle>
            <circle cx='27' cy='49.125' r='5' fillOpacity='0' fill='#fff'>
              <animate
                attributeName='fill-opacity'
                begin='0s'
                dur='1.3s'
                values='0;0;0;1;0;0;0;0'
                calcMode='linear'
                repeatCount='indefinite'
              />
            </circle>
            <circle cx='11.399' cy='42.663' r='5' fillOpacity='0' fill='#fff'>
              <animate
                attributeName='fill-opacity'
                begin='0s'
                dur='1.3s'
                values='0;0;0;0;1;0;0;0'
                calcMode='linear'
                repeatCount='indefinite'
              />
            </circle>
            <circle cx='4.938' cy='27.063' r='5' fillOpacity='0' fill='#fff'>
              <animate
                attributeName='fill-opacity'
                begin='0s'
                dur='1.3s'
                values='0;0;0;0;0;1;0;0'
                calcMode='linear'
                repeatCount='indefinite'
              />
            </circle>
            <circle cx='11.399' cy='11.462' r='5' fillOpacity='0' fill='#fff'>
              <animate
                attributeName='fill-opacity'
                begin='0s'
                dur='1.3s'
                values='0;0;0;0;0;0;1;0'
                calcMode='linear'
                repeatCount='indefinite'
              />
            </circle>
            <circle cx='27' cy='5' r='5' fillOpacity='0' fill='#fff'>
              <animate
                attributeName='fill-opacity'
                begin='0s'
                dur='1.3s'
                values='0;0;0;0;0;0;0;1'
                calcMode='linear'
                repeatCount='indefinite'
              />
            </circle>
          </g>
        </g>
      </svg>
    </span>
  );
};
