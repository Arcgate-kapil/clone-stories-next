'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EVENT_TYPE } from '../../constants/firebaseString';
import CustomStyle from '../common/CustomStyle';
import ReactHlsPlayer from '../HSL';
import { customEvent } from '@/app/firebase/firebase';
import fullScreen from "../../Zoomicon.png";
import useWindowSize from '../../utils/useWindowSize';
import { useDispatch } from 'react-redux';
import Image from 'next/image';

const VideoContainerDetailPageWeb = (props) => {
  const { videoUrl, screenName, poster, isLayoverPlayBtn, setLayoverPlayButton } = props;
  const [showLoader, setShowLoader] = useState(true);
  const [isVideoMute, toggleVideoVoice] = useState(props?.userClick ? false : true);
  const [hasPlayed15Seconds, setHasPlayed15Seconds] = useState(false);
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoPlay, setIsVideoPlay] = useState(false);
  const [isMobVideoPlay, setIsMobVideoPlay] = useState(true);
  const [duration, setDuration] = useState(0);
  const { width } = useWindowSize();
  let dispatch = useDispatch();
  const videoRef = useRef();

  const vidControl = ['PlayPause', 'Seek', 'Time'];

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS detection
  const IOS = isIOSDevice && !window.MSStream;

  const cardVideoClick = () => {
    customEvent(EVENT_TYPE.videoClick, {
      screen_name: screenName,
      videoUrl: videoUrl,
    });
  };

  const volumClick = () => {
    toggleVideoVoice(prev => !prev);
    const _elem = document.getElementById('storyVideo');
    if (_elem) {
      _elem.muted = !isVideoMute;
      sessionStorage.setItem('isVideoMute', (!isVideoMute).toString());
    }
  };

  const videoPlay = (e) => {
    e.preventDefault();
    dispatch(setLayoverPlayButton(false));
    setIsVideoPlay(!isVideoPlay);
    const _elem = document.getElementById('storyVideo');
    _elem.play();
    localStorage.setItem('layoverPlayStorage', JSON.stringify("false"));
  };

  const toggleVideoPlayBack = (e) => {
    e.preventDefault();
    // const _elem = document.getElementById('storyVideo');
    const _elem = videoRef?.current;
    setIsMobVideoPlay(!isMobVideoPlay);
    if (isMobVideoPlay) {
      _elem.pause();
    } else {
      _elem.play();
    }
  };

  const startVideo = () => {
    setShowLoader(false);
  };

  const handleTimeUpdate = () => {
    const videoElem = document.getElementById('storyVideo');
    setCurrentTime(videoRef.current?.currentTime || 0)
    if (videoElem) {
      const currentTime = videoElem.currentTime;
      if (currentTime >= 15 && Math.abs(currentTime) < 15.3 && !hasPlayed15Seconds && !document.fullscreenElement) {
        setHasPlayed15Seconds(true);
        // dispatch(setLayoverPlayButton(true));
        // videoElem.pause();
        localStorage.setItem('layoverPlayStorage', JSON.stringify("true"));
      }
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const _elem = document.getElementById('storyVideo');
        _elem.pause();
      } else {
        if (localStorage.getItem('layoverPlayStorage') === 'false') {
          const _elem = document.getElementById('storyVideo');
          _elem.play();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const toggleMobileFullscreen = (e) => {
    e.preventDefault();
    const videoContainer = videoRef?.current;
    if (!videoContainer) return;

    if (!isMobileFullscreen) {
      if (IOS) {
        // iOS-specific: Use the video element's fullscreen method
        if (videoContainer.webkitEnterFullscreen) {
          videoContainer.webkitEnterFullscreen();
        }
      } else {
        if (videoContainer.requestFullscreen) {
          videoContainer.requestFullscreen();
        } else if (videoContainer.webkitRequestFullscreen) {
          videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
          videoContainer.msRequestFullscreen();
        }
      }
      setIsMobileFullscreen(true);
    } else {
      if (IOS) {
        // iOS-specific: Exit fullscreen
        if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        setIsMobileFullscreen(false);
      }
    }
  };

  // const handleSeek = (e) => {
  //   if (videoRef.current) {
  //     const seekTime = (e.target.value / 100) * duration;
  //     videoRef.current.currentTime = seekTime;
  //     setCurrentTime(seekTime);
  //   }
  // };

  const handleSeek = (e) => {
    if (videoRef.current && duration > 0) {
      const seekTime = (e.target.value / 100) * duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <CustomStyle>{styleString}</CustomStyle>
      <div className='videoContainerMailDiv'>
        <img
          loading='eager'
          className='mobileframe'
          src='https://workmob-v3.s3.ap-south-1.amazonaws.com/stories_workmob/images/common/phone-frame.png'
          alt='frame'
        />
        <div onClick={cardVideoClick} className={`videoContainerDetail ${width < 900 ? 'border-rr-10' : ''}`}>
          <ReactHlsPlayer
            className='videoPlayerClass'
            url={`${videoUrl}`}
            poster={poster}
            id={'storyVideo'}
            preload='auto'
            loop={false}
            controls={IOS ? false : vidControl}
            autoPlay
            width='100%'
            height='100%'
            startVideo={startVideo}
            playerRef={videoRef}
            muted={true}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          />
          {IOS && <><div className='play-pause-icon  d-flex justify-content-center' onClick={toggleVideoPlayBack}>
            {!isMobVideoPlay ? <i className="icon icon-play"></i> :
              <i className="icon icon-pause-1"></i>}
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            className="progress-bar-new"
          /></>}
          {IOS && <div className="timer timeMac">
            {formatTime(currentTime)}
          </div>}
          {IOS && <div id='btnMute' rel='btnMute' onClick={volumClick} className='mutem3u8BtnMac'>
            {!isVideoMute ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='36'
                height='36'
                viewBox='0 0 24 24'
                className='rh5v-Volume_icon'
                fill='#fff'
              >
                <path d='M14.016 3.234C18.047 4.125 21 7.734 21 12s-2.953 7.875-6.984 8.766v-2.063c2.906-.844 4.969-3.516 4.969-6.703s-2.063-5.859-4.969-6.703V3.234zM16.5 12a4.451 4.451 0 0 1-2.484 4.031V7.968c1.5.75 2.484 2.25 2.484 4.031zM3 9h3.984L12 3.984v16.031l-5.016-5.016H3v-6z'></path>
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='36'
                height='36'
                viewBox='0 0 24 24'
                className='rh5v-Volume_icon'
                fill='#fff'
              >
                <path d='M12 3.984v4.219L9.891 6.094zM4.266 3L21 19.734 19.734 21l-2.063-2.063c-1.078.844-2.297 1.5-3.656 1.828v-2.063c.844-.234 1.594-.656 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016H2.999v-6h4.734L2.999 4.264zm14.718 9c0-3.188-2.063-5.859-4.969-6.703V3.234c4.031.891 6.984 4.5 6.984 8.766a8.87 8.87 0 0 1-1.031 4.172l-1.5-1.547A6.901 6.901 0 0 0 18.984 12zM16.5 12c0 .234 0 .422-.047.609l-2.438-2.438V7.968c1.5.75 2.484 2.25 2.484 4.031z'></path>
              </svg>
            )}
          </div>}
          {IOS && <span className='fullSMac' onClick={toggleMobileFullscreen}><Image src={fullScreen} width={14} height={14} alt="Fullscreen" /></span>}
          {isLayoverPlayBtn && (
            <div className={`playAgainLayover ${width < 900 ? 'border-rr-13' : ''}`} onClick={videoPlay}>
              <span className='textContinueOne'>Hope you are liking this inspirational story!</span>
              <span className='textContinue mb-3'>{width < 1100 ? 'Tap' : 'Click'} to continue watching</span>
              <span className="layplayBtn text-white"><i className="icon icon-play"></i></span>
            </div>
          )}

          <div id='btnMute' rel='btnMute' onClick={volumClick} className='mutem3u8Btn'>
            {!isVideoMute ? (
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
            <p className='position-absolute muteText'>{`Tap to ${isVideoMute ? 'unmute' : 'mute'
              }`}</p>
          </div>
          {showLoader && <BufferVideo />}
        </div>
      </div>
    </>
  );
};

export default VideoContainerDetailPageWeb;

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
                calcMode='indefinite'
              />
            </circle>
          </g>
        </g>
      </svg>
    </span>
  );
};

const styleString = `
.mobileframe{
  z-index: 1;
  pointer-events: none;
  inset: 0px;
  transform: scale(1.03);
  height: 100%;
  width: 100%;
  position: absolute
}
.videoPlayerClass{  
    margin-top:0;
    margin-left:0;
    outline:none;
    background:black
} 
.videoContainerDetail{
    width:100%;
    height:100%;
    border-radius: 20px;
    overflow: hidden;
}
.videoContainerMailDiv{
    width: 100%;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
}
.videoContainerDetail video {
  object-fit: contain;
  border-radius: inherit;
}
.videoContainerDetail video[rel='hslVideo'] {
  object-fit: contain;
}
.videoContainerDetail video[rel='hslVideo']:fullscreen,
.videoContainerDetail :fullscreen video {
  object-fit: contain;
  height: 100% !important;
  width: 100% !important;
}

@media (min-width: 1700px){
  .videoContainerDetail{
    border-radius: 35px;
  }
}
@media (min-width: 3000px){
  .videoContainerDetail{
    border-radius: 60px;

  }
}
.playAgainLayover {
  position: absolute;
  top: 0px;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 23px;
  display: flex;
  justify-content: center;
  align-items: baseline;
  flex-direction: column;
  text-align: center;
  cursor: pointer;
  z-index: 2;
}
.playAgainLayover .layplayBtn {
  justify-content: center;
  display: flex;
  margin: 0 auto;
  width: 45px;
  height: 45px;
  background-color: rgba(178, 67, 40, 0.8);
  padding: 4px 5px;
  border-radius: 50%;
  font-size: 25px !important;
  -webkit-transition: all 0.2s ease-in;
}
.playAgainLayover .layplayBtn .icon-play {
  justify-content: center;
  display: flex;
  align-items: center;
  margin-left: 3px;
}
.playAgainLayover .textContinueOne {
  margin: 0 auto;
  font-size: 17px;
  line-height: 1.4;
  padding: 0px 22px;
  font-family: 'Alata';
}
.playAgainLayover .textContinue {
  margin: 0 auto;
  font-size: 17px;
  line-height: 1.4;
  padding: 0px 22px;
  font-family: 'Alata';
}
@media screen and (min-width: 676px) and (max-width: 1400px) {
  .playAgainLayover .layplayBtn {
    width: 33px !important;
    height: 33px !important;
    font-size: 21px !important;
  }
  .playAgainLayover .textContinue {
    font-size: 8px !important;
    padding: 0px 10px !important;
    }
    .playAgainLayover .textContinueOne {
      font-size: 9px !important;
      padding: 0px 10px !important;
      }
}
.border-rr-13 {
   border-radius: 13px;
}
.border-rr-10 {
   border-radius: 10px;
}
`;
