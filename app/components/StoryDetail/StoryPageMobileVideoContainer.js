'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WHITE } from '../../constants/colors';
import CustomStyle from '../common/CustomStyle';
import ReactHlsPlayer from '../HSL';
// import { BufferVideo } from '../common/CardVideo';

const StoryPageMobileVideoContainer = ({ poster, url, userClick, title, isLayoverPlayBtn, setLayoverPlayButton }) => {
  const [mute, setMute] = useState(true);
  const [play, setPlay] = useState(true);
  const [videoPlay, setVideoPlay] = useState(false);
  const playStateRef = useRef(play);
  const playBtn = useRef();
  const playerRef = useRef();
  const [initialPlayBanner, setInitialPlayBanner] = useState(true);
  const firstRenderBanner = useRef(true);
  const [hasPlayed15Seconds, setHasPlayed15Seconds] = useState(false);

  useEffect(() => {
    if (playerRef?.current) {
      setMute(playerRef.current.muted);
    }
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    const checkVisibility = () => {
      if (
        player.getBoundingClientRect().top < innerHeight - 30 &&
        player.getBoundingClientRect().bottom > 30
      ) {
        if (player.paused) {
          // playBtn.current.style.opacity = 0;
          // player.play();
          // setPlay(true);
        }
      } else {
        // player.pause();
        // setPlay(false);
      }
    };

    document.addEventListener('scroll', checkVisibility);

    return () => document.removeEventListener('scroll', checkVisibility);
  }, []);

  function toggleMute() {
    playerRef.current.muted = !mute;
    setMute(!mute);
  }

  function togglePlay(event) {
    event.preventDefault();
    playBtn.current.style.opacity = 1;

    if (event.type === 'click') {
      setTimeout(() => {
        playBtn.current.style.opacity = 0;
      }, 1000);
    }

    if (play) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }

    setPlay(!play);
    playStateRef.current = !play;
  }

  function makeFullscreen() {
    if (playerRef.current.webkitEnterFullScreen) {
      playerRef.current.webkitEnterFullScreen();
    } else {
      playerRef.current.requestFullscreen();
    }
  }

  function isMobile() {
    if (typeof window !== 'undefined') {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        window?.navigator?.userAgent
      );
    }
  }

  function isIphone() {
    if (typeof window !== 'undefined') {
      return /iPhone/i.test(
        window?.navigator?.userAgent
      );
    }
  }

  useEffect(() => {
    const player = playerRef.current;
    player?.addEventListener('loadedmetadata', function () {
      player?.play();
      setVideoPlay(true);
    });
  }, []);

  const handlePlaying = () => {
    setInitialPlayBanner(false);
    firstRenderBanner.current = false;
    // if (playerRef.current.muted) {
    //   toggleMute();
    // }
  };

  const handlePlay = () => {
    if (firstRenderBanner.current) {
      setInitialPlayBanner(true);
    }
  };

  const mobileVideoPlay = (e) => {
    e.preventDefault();
    setLayoverPlayButton(false);
    const _elem = document.getElementById('storyVideo');
    _elem.play();
    localStorage.setItem("layoverPlayStorage", JSON.stringify("false"));
  };

  const handleTimeUpdate = () => {
    if (document?.getElementById('storyVideo')) {
      const _elem = document.getElementById('storyVideo');
      const currentTime = document?.getElementById('storyVideo')?.currentTime;
      // if (currentTime >= 10 && !hasPlayed15Seconds && !document.fullscreenElement) {
      if (currentTime >= 15 && Math.abs(currentTime) < 15.3 && !hasPlayed15Seconds && !document.fullscreenElement) {
        setHasPlayed15Seconds(true);
        // setLayoverPlayButton(true);
        // _elem.pause();
        localStorage.setItem("layoverPlayStorage", JSON.stringify("true"));
      }
    }
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const _elem = document.getElementById('storyVideo');
        _elem.pause();
      } else {
        if (localStorage?.getItem('layoverPlayStorage') === "false") {
          const _elem = document.getElementById('storyVideo');
          _elem.play();
        }
      }
    });
  }, [playerRef]);

  return (
    <React.Fragment>
      <CustomStyle>{styleString}</CustomStyle>
      {videoPlay && (
        <div style={styles.videoControls} className='promotionVideo'>
          <div style={styles.muteIconContainer} onClick={toggleMute}>
            <p style={{ margin: '0 0.4em 0 0' }}>Tap to {mute ? 'unmute' : 'mute'}</p>
            <i style={styles.iconBtn} className={`icon-${mute ? 'mute' : 'unmute'}`}></i>
          </div>
          <div style={styles.iconBtn} onClick={makeFullscreen}>
            <div style={styles.fullScreenIcon}>
              <div style={styles.partFirst}></div>
              <div style={styles.partSecond}></div>
              <div style={styles.partThird}></div>
              <div style={styles.partFourth}></div>
            </div>
          </div>
        </div>
      )}
      {/* {initialPlayBanner && <BufferVideo />} */}
      {videoPlay && (
        isIphone() ? (
          <div style={styles.playPause} ref={playBtn} onTouchStart={togglePlay}>
            <div style={styles.iconBtn}>
              <i className={`icon-${play ? 'pause-1' : 'play'}`}></i>
            </div>
          </div>
        ) : (
          <div style={styles.playPause} ref={playBtn} onClick={togglePlay}>
            <div style={styles.iconBtn}>
              <i className={`icon-${play ? 'pause-1' : 'play'}`}></i>
            </div>
          </div>
        )
      )}
      <div style={styles.promoVideo} className='mobileVideoDetail'>
        <ReactHlsPlayer
          url={url}
          preload='auto'
          poster={poster}
          controls={false}
          autoPlay={isMobile() ? true : false}
          playerRef={playerRef}
          onClick={togglePlay}
          onEnded={togglePlay}
          playsInline={true}
          onCanPlay={() => setVideoPlay(true)}
          onPlaying={handlePlaying}
          onPlay={handlePlay}
          // muted={userClick ? false : true}
          muted={true}
          title={title}
          onTimeUpdate={handleTimeUpdate}
          // setLayoverPlayButton={setLayoverPlayButton}
          // bufferTime={true}
        />
      </div>
      {isLayoverPlayBtn && (
        <div className='playAgainLayover' onClick={(e) => mobileVideoPlay(e)}>
          <span className='textContinueOne'>Hope you are liking this inspirational story!</span>
          <span className='textContinue mb-3'>Tap to continue watching</span>
          <span className="layplayBtn text-white">
            <i className="icon icon-play"></i>
          </span>
        </div>
      )}
    </React.Fragment>
  );
};

export default StoryPageMobileVideoContainer;

const styleString = `
  @media(max-width: 770px) {
    .mobileVideoDetail video{
      height:100%
    }
    .promotionVideo {
      bottom: 2.25%;
      right: 1.25%;
    }
  }
  .playAgainLayover {
    position: absolute;
    top: 0px;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    // border-radius: 23px;
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
    .playAgainLayover .textContinue {
      font-size: 11px !important;
      padding: 0px 15px !important;
    }
    .playAgainLayover .textContinueOne {
      font-size: 12px !important;
      padding: 0px 15px !important;
    }
  }
  @media screen and (max-width: 386px) {
    .playAgainLayover .textContinue {
      padding: 0px 9px !important;
    }
    .playAgainLayover .textContinueOne {
      padding: 0px 9px !important;
    }
  }
`;

const styles = {
  promoBanner: {
    backgroundColor: 'transparent',
    backgroundSize: 'contain',
    backgroundAttachment: 'fixed',
    marginBottom: '0',
  },
  promoVideo: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%'
  },
  playPause: {
    fontSize: '18px',
    width: 'max-content',
    height: 'max-content',
    margin: 'auto',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    opacity: '0',
    transition: 'opacity linear 200ms',
    borderRadius: '50%',
    background: 'rgba(0,0,0,.5)',
    zIndex: '1',
  },
  videoControls: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    zIndex: '1',
  },
  muteIconContainer: {
    marginRight: '0.6em',
    display: 'flex',
    alignItems: 'center',
  },
  iconBtn: {
    width: '2em',
    height: '2em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: '50%',
    background: 'rgba(0,0,0,.5)',
  },
  fullScreenIcon: {
    width: '15px',
    height: '15px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '5px',
    gridGap: '5px',
  },
  partFirst: {
    borderTop: '2px solid #ffffff',
    borderLeft: '2px solid #ffffff',
  },
  partSecond: {
    borderTop: '2px solid #ffffff',
    borderRight: '2px solid #ffffff',
  },
  partThird: {
    borderBottom: '2px solid #ffffff',
    borderLeft: '2px solid #ffffff',
  },
  partFourth: {
    borderBottom: '2px solid #ffffff',
    borderRight: '2px solid #ffffff',
  },
  shareStoryBtn: {
    width: 'max-content',
    margin: '1.5em auto 0',
  },
  shareStoryLink: {
    color: WHITE,
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    backgroundPosition: 'center',
    backgroundSize: '105%',
    borderRadius: 100,
  },
};
