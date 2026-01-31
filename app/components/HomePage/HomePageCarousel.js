import React, { useEffect, useState, useRef } from 'react';
import Slider from '../common/Slider';
import CustomStyle from '../common/CustomStyle';
import ReactHlsPlayer from '../HSL/components/react-hls-player';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';
import { useFetch } from '../../utils/useFetch';

export default function HomePageCarousel() {
  const isHindi = useSelector(state => state.blogs.isHindi);
  const [slideIndex, setSlideIndex] = useState(1);
  const [isMute, setIsMute] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIconRef = useRef();
  const sliderRef = useRef();
  const playerRef = useRef();
  const videoData = useFetch(
    'https://cdn.workmob.com/stories_workmob/config/youtube-trending.json'
  );

  useEffect(() => {
    if (!videoData) return;

    const player = playerRef.current;
    let isThrottle = false;

    function listenScroll() {
      if (isThrottle) return;

      isThrottle = true;

      setTimeout(() => {
        if (window.scrollY && player.getBoundingClientRect().bottom > 0) {
          player.play();
          playIconRef.current.style.opacity = 0;
        }

        else {
          player.pause();
        }

        isThrottle = false;
      }, 200);
    }

    listenScroll();
    window.addEventListener('scroll', listenScroll);

    return () => window.removeEventListener('scroll', listenScroll);
  }, [videoData, slideIndex]);

  function handleSlideChange(slide) {
    const slideList = document.querySelectorAll('.HomeSlider-sliderItem');

    slideList.forEach((slide, i) => {
      if (slide.className.includes('Slider-activeSlide')) {
        setSlideIndex(i);
      }
    });

    setIsPlaying(false);
    setIsMute(true);
  }

  function toggleMute() {
    const player = playerRef.current;

    player.muted = isMute ? false : true;
    setIsMute(isMute ? false : true);
  }

  function togglePlay() {
    const player = playerRef.current;
    const playIcon = playIconRef.current;

    if (player.paused) {
      setIsPlaying(true);
      player.play();
    }

    else {
      setIsPlaying(false);
      player.pause();
    }

    playIcon.style.opacity = 1;

    setTimeout(() => {
      playIcon.style.opacity = 0;
    }, 1000);
  }

  return (
    <>
      <CustomStyle>{styles}</CustomStyle>
      <div className='HomeSlider' ref={sliderRef}>
        <div className='HomeSlider-slider'>
          {!!videoData ? (
            <Slider speed={1.8} initialSlide={1} onSlideChange={handleSlideChange}>
              {videoData.map((v, i) => (
                <div key={i} className='HomeSlider-sliderItem'>
                  <div className='HomeSlider-videoContainer'>
                    {slideIndex === i && (
                      <ReactHlsPlayer
                        playerRef={playerRef}
                        onClick={togglePlay}
                        draggable='false'
                        className={`carouselvideo-${i}`}
                        url={v.short_video}
                        controls={false}
                        // onPlay={() => {playIconRef.style.opacity = 0}}
                        preload='none'
                        poster={v.mobileThumb}
                        playsInline={true}
                        muted={true}
                      />
                    )}
                    <LazyLoadImage
                      className='HomeSlider-videoPoster'
                      src={v.mobileThumb}
                      alt='poster'
                      draggable='false'
                      threshold={25}
                    />
                    {slideIndex === i && (
                      <i
                        ref={playIconRef}
                        className={'HomeSlider-playIcon icon-' + (isPlaying ? 'pause-1' : 'play')}
                      ></i>
                    )}
                  </div>
                  <div className='HomeSlider-controlsContainer'>
                    <Link
                      className='HomeSlider-storyLink'
                      to={{
                        pathname: `${isHindi ? '/hindi' : ''}/${v.slug}`,
                        state: { userClick: true },
                      }}
                    >
                      Watch full story
                    </Link>
                    <div className='HomeSlider-muteContainer' onClick={toggleMute}>
                      <p className='mr-2 mb-0'>Tap to {isMute ? 'unmute' : 'mute'}</p>
                      <i className={`HomeSlider-muteIcon icon-${isMute ? 'mute' : 'unmute'}`}></i>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className='HomeSlider-shimmer'>
              <div className='HomeSlider-shimmerItem1'></div>
              <div className='HomeSlider-shimmerItem2'></div>
              <div className='HomeSlider-shimmerItem3'></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = `
  .HomeSlider {
    margin: 2em 0;
    color: #fff;
  }

  .HomeSlider-sliderItem {
    --item-width: 75%;
    width: var(--item-width);
    position: relative;
    flex-shrink: 0;
  }

  .HomeSlider-sliderItem:not(.Slider-activeSlide) .HomeSlider-videoContainer {
    transform: scale(0.92);
    filter: brightness(0.6);
  }

  .HomeSlider-sliderItem:not(.Slider-activeSlide) .HomeSlider-controlsContainer {
    display: none;
  }

  .HomeSlider-videoContainer {
    transition: transform linear 200ms;
    border-radius: 1vw;
    overflow: hidden;
    position: relative;
    background: #1c1c1c;
  }

  .HomeSlider-videoContainer::before {
    content: '';
    display: block;
    padding-top: 56.25%;
  }

  .HomeSlider-videoContainer > video {
    user-select: none;
    -webkit-user-select: none;
    background: #1c1c1c;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
  }

  .HomeSlider-videoPoster {
    border-radius: 1vw;
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .HomeSlider-sliderItem.Slider-activeSlide .HomeSlider-videoPoster {
    display: none;
  }

  // .HomeSlider-sliderItem:not(:last-child) {
  //   margin-right: 1.5em;
  // }

  .HomeSlider-sliderItem:first-child {
    margin-left: calc((100% - var(--item-width))/2);
  }

  .HomeSlider-sliderItem:last-child {
    margin-right: calc((100% - var(--item-width))/2);
  }

  .HomeSlider-controlsContainer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    color: #cbcbcb;
  }

  .HomeSlider-storyLink {
    color: inherit !important;
    margin-right: 0.9em;
    border-radius: 0.5em;
    background: rgba(0, 0, 0, 0.75);
    padding: 0.2em 0.5em;
  }
  .HomeSlider-storyLink:hover {
    text-decoration: none;
  }
  .HomeSlider-muteContainer {
    display: flex;
    align-items: center;
  }

  .HomeSlider-muteIcon {
    width: 23px;
    height: 23px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.45);
    margin-top: 0.1em;
  }

  .HomeSlider-playIcon {
    width: 2.5em;
    height: 2.5em;
    padding: 1em;
    border-radius: 50%;
    color: white;
    background: rgba(0, 0, 0, 0.45);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    opacity: 1;
    transition: opacity linear 150ms;
  }

  .HomeSlider-shimmer {
    display: flex;
  }

  .HomeSlider-shimmer > * {
    background: #1c1c1c;
    // border: 1px solid white;
  }

  .HomeSlider-shimmerItem1 {
    width: 12.5%;
    transform: scale(0.92);
    transform-origin: left;
    border-top-right-radius: 1vw;
    border-bottom-right: 1vw;
  }

  .HomeSlider-shimmerItem2 {
    width: 75%;
    margin: 0 1em;
    border-radius: 1vw;
  }

  .HomeSlider-shimmerItem2::before {
    padding-top: 56.25%;
    content: '';
    display: block;
  }

  .HomeSlider-shimmerItem3 {
    width: 12.5%;
    transform: scale(0.92);
    transform-origin: right;
    border-top-left-radius: 1vw;
    border-bottom-left-radius: 1vw;
  }

  @media(max-width: 600px) {
    .HomeSlider-controlsContainer {
      font-size: 12px;
      justify-content: center;
    }
  }
`;
