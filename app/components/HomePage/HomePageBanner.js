import React, { useRef, useEffect } from 'react';
import ReactHlsPlayer from '../HSL/components/react-hls-player';
import CustomStyle from '../common/CustomStyle';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

function HomePageBanner() {
  const { pathname } = useLocation();
  const playerRef = useRef();
  const isFirstRenderRef = useRef(true);
  const isGlobalHindi = useSelector(state => state.blogs.isHindi);
  let isHindi = isFirstRenderRef.current ? /\/hindi\/?/.test(pathname) : isGlobalHindi;

  useEffect(() => {
    const player = playerRef.current;
    let timeout;

    const checkVisibility = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (
          player.getBoundingClientRect().top >= 0 &&
          player.getBoundingClientRect().bottom <= window.innerHeight
        ) {
          player.play();
        } else {
          player.pause();
        }
      }, 100);
    };

    document.addEventListener('scroll', checkVisibility);

    return () => document.removeEventListener('scroll', checkVisibility);
  }, []);

  useEffect(() => {
    const player = playerRef.current;

    player.controls = false;
    player.muted = true;
    player.play();
    isFirstRenderRef.current = false;
  }, []);

  function togglePlay() {
    const player = playerRef.current;

    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  }

  return (
    <div className='homeBanner'>
      <CustomStyle>{styleString}</CustomStyle>
      <div className='HomePageBanner-videoContainer'>
        <div style={{ paddingTop: '41.66%' }}></div>
        <ReactHlsPlayer
          playerRef={playerRef}
          className='HomePageBanner-video'
          url={
            isHindi
              ? 'https://cdn.workmob.com/stories_workmob/promotional/blog-home-hindi/blog-home-hindi.m3u8'
              : 'https://cdn.workmob.com/stories_workmob/promotional/blog-home/blog-home.m3u8'
          }
          poster={
            isHindi
              ? 'https://cdn.workmob.com/stories_workmob/promotional/blog-home-hindi.jpg'
              : 'https://cdn.workmob.com/stories_workmob/promotional/blog-home.jpg'
          }
          controls={false}
          autoPlay={true}
          preload='auto'
          muted={true}
          playsInline={true}
          onEnded={togglePlay}
          onCanPlay={event => {
            event.target.play();
          }}
        />
      </div>
      <div className='info-hide'>
        <h1>
          India's Professional Community | Meet Startups, Business Owners, Professionals & more
        </h1>
        <h2>
          Meet India's own professionals, startups, business owners, social workers, creators and
          more. Watch, discover and get to know professionals in your city.
        </h2>
      </div>
    </div>
  );
}

export default HomePageBanner;

const styleString = `
.info-hide{
  width: 0;
  height: 0;
  font-size: 0;
  opacity: 0;
  pointer-events: none;
}
.info-hide h1, .info-hide h2{
  width: 0;
  height: 0;
  font-size: 0;
}
  .HomePageBanner-videoContainer {
    background: #1c1c1c;
    position: relative;
  }

  .HomePageBanner-video {
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .HomePageBanner-bottomContent {
    font: bold 1.5em "Montserrat", sans-serif;
  }

  @media(max-width: 575px) {
    .HomePageBanner-bottomContent {
      font-size: 12px;
    }
  }
`;
