'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFetch } from '../../utils/useFetch';
import Slider from '../common/Slider';
import CustomStyle from '../common/CustomStyle';
import ReactHlsPlayer from '../HSL/components/react-hls-player';
import ListTitle from '../common/ListTitle';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import SocialShare from '../common/SocialShare';
import { COMMON_HASHTAG } from '../../constants/localString';
// import CloseBtn from '../common/CloseBtn';
import useWindowSize from '../../utils/useWindowSize';

function StoryDetailPageMoreVideos({ storyDetail }) {
  const router = useRouter();
  const pathname = usePathname();
  const { videoSlug } = useParams();
  const state = useSelector((state) => state.blog);
  const { instructor, metaDesc, storyHeading, workmobUserName } = storyDetail;
  const { width } = useWindowSize();
  const userData = useFetch(
    `https://cdn.workmob.com/stories_workmob/config/instructor/${instructor}.json`
  );

  const videoUrls =
    userData &&
    []
      .concat(
        userData.gyan || [],
        userData.hope || [],
        userData.namaste || [],
        userData.promotion || []
      )
      .filter(v => v.video_url_landscape);

  const videoSlugObj = videoUrls?.find(v => v.slug === videoSlug);
  const [isOverlayVideoPlaying, setIsOverlayVideoPlaying] = useState(true);
  const [isOverlayVideoMute, setIsOverlayVideoMute] = useState(true);
  const overlayVideoRef = useRef();
  const [currentSlide, setCurrentSlide] = useState();
  const [isMute, setIsMute] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareBtns, setShowShareBtns] = useState(false);
  const playIconRef = useRef([]);
  const [slideIndex, setSlideIndex] = useState(1);

  useEffect(() => {
    if (videoSlugObj) {
      document.querySelector('#storyVideo').pause();
      overlayVideoRef.current.play();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [videoSlugObj]);

  function togglePlay(event, i) {
    const video = event.target;
    const playIcon = playIconRef.current;

    if (!video.parentElement.className.includes('Slider-activeSlide')) {
      return;
    }

    playIcon.forEach(v => (v.style.opacity = 1));

    setTimeout(() => {
      playIcon[i].style.opacity = 0;
    }, 1000);

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }

    video.muted = isMute;

    if (window.innerWidth >= 600) {
      document.querySelector('#storyVideo').pause();
    }
  }

  function toggleMute() {
    const video = currentSlide;
    const muteChange = !video.muted;

    setIsMute(muteChange);
    video.muted = muteChange;
  }

  function handleSlideChange(slide) {
    const previousVideo = currentSlide;
    const currentVideo = slide.querySelector('video');
    const allSlides = [...document.querySelectorAll('.Slider-element')];

    if (previousVideo) {
      previousVideo.pause();
    }

    if (isPlaying) {
      currentVideo.play();
      playIconRef.current.forEach(v => (v.style.opacity = 0));
    } else {
      currentVideo.pause();
    }

    currentVideo.muted = isMute;
    setCurrentSlide(currentVideo);
    setShowShareBtns(false);
    setSlideIndex(allSlides.findIndex(slide => slide.className.includes('Slider-activeSlide')));
  }

  function closeOverlay() {
    router.push(pathname.replace(`/${videoSlug}`, ''));
    document.body.style.overflow = '';
  }

  function toggleOverlayPlay() {
    const overlayVideo = overlayVideoRef.current;

    if (overlayVideo.paused) {
      overlayVideo.play();
      setIsOverlayVideoPlaying(true);
    } else {
      overlayVideo.pause();
      setIsOverlayVideoPlaying(false);
    }
  }

  function toggleOverlayVideoMute() {
    const overlayVideo = overlayVideoRef.current;

    if (isOverlayVideoMute) {
      overlayVideo.muted = false;
      setIsOverlayVideoMute(false);
    } else {
      overlayVideo.muted = true;
      setIsOverlayVideoMute(true);
    }
  }

  function getCopyLink(slug) {
    if (!userData) return '';

    let videoType = Object.keys(userData).find(key => {
      if (!Array.isArray(userData[key])) return false;

      return userData[key].some(v => v.slug === slug);
    });

    if (videoType === 'namaste') {
      // videoType = 'greetings';
      return `https://greetings.workmob.com/${slug}`
    } else if (videoType === 'hope') {
      // videoType = 'motivation';
      return `https://motivation.workmob.com/${slug}`;
    } else if (videoType === 'promotion') {
      return `https://stories.workmob.com${pathname}/${slug}`;
    } else if (videoType === 'gyan') {
      return `https://gyan.workmob.com/${slug}`;
    }

    return `https://www.workmob.com/${videoType}/${slug}`;
  }

  return (
    videoUrls?.length > 0 && (
      <>
        <CustomStyle>{styles}</CustomStyle>
        <div className={`${width < 1200 ? width < 768 ? 'px-3' : 'px-5' : ''} mx-auto container position-relative mb-4`} style={{ zIndex: 1, maxWidth: '1266px' }}>
          <ListTitle className={`hpSimplified font-regular ${width < 768 ? 'font-3-1-vw' : 'font-2-1-vw'} height-km`} title={`More Videos by ${userData.name}`} type='small' />
        </div>
        <div className={`mx-auto container detailPageMoreVideos position-relative customData ${width < 1200 ? width < 768 ? 'px-3' : 'px-5' : ''}`} style={{ zIndex: 1, maxWidth: '1266px' }}>
          {!!userData && (
            <Slider
              speed={1.75}
              onSlideChange={handleSlideChange}
              initialSlide={0}
            >
              {videoUrls?.map((v, i) => (
                <div
                  className='detailPageMoreVideos-item'
                  key={v.video_url_landscape}
                  style={{ '--item-width': videoUrls.length === 1 ? '90%' : '', maxWidth: '1190px' }}
                >
                  <ReactHlsPlayer
                    onClick={event => togglePlay(event, i)}
                    draggable='false'
                    className={`detailPageMoreVideo-${i}`}
                    url={v.video_url_landscape}
                    poster={v.video_landscape_thumb}
                    controls={false}
                    playsInline
                    preload='none'
                    muted={false}
                    autoplay={false}
                    type="MOREVIDEOS"
                  />
                  <i
                    ref={elem => {
                      elem && (playIconRef.current[i] = elem);
                    }}
                    className={
                      'detailPageMoreVideos-playIcon icon-' + (isPlaying ? 'pause-1' : 'play')
                    }
                  ></i>
                  <div className='detailPageMoreVideos-muteContainer'>
                    <div className='d-flex align-items-center' onClick={toggleMute}>
                      <span>Tap to {isMute ? 'unmute' : 'mute'}</span>
                      <i
                        className={'detailPageMoreVideos-icon icon-' + (isMute ? 'mute' : 'unmute')}
                      ></i>
                    </div>
                    <div className="position-relative detailPageMoreVideos-icon">
                      <div
                        className="w-100 h-100"
                        onClick={() => {
                          if (currentSlide.webkitEnterFullScreen) {
                            currentSlide.webkitEnterFullScreen();
                          } else {
                            currentSlide.requestFullscreen();
                          }
                        }}
                      >
                        <svg viewBox="0 0 448 512" fill="white">
                          <path d="M144 32h-128C7.156 32 0 39.16 0 48v128C0 184.8 7.156 192 16 192S32 184.8 32 176V64h112C152.8 64 160 56.84 160 48S152.8 32 144 32zM144 448H32v-112C32 327.2 24.84 320 16 320S0 327.2 0 336v128C0 472.8 7.156 480 16 480h128C152.8 480 160 472.8 160 464S152.8 448 144 448zM432 320c-8.844 0-16 7.156-16 16V448h-112c-8.844 0-16 7.156-16 16s7.156 16 16 16h128c8.844 0 16-7.156 16-16v-128C448 327.2 440.8 320 432 320zM432 32h-128C295.2 32 288 39.16 288 48S295.2 64 304 64H416v112C416 184.8 423.2 192 432 192S448 184.8 448 176v-128C448 39.16 440.8 32 432 32z" />
                        </svg>
                      </div>
                    </div>
                    <div className='position-relative detailPageMoreVideos-icon'>
                      <div className='w-100 h-100' onClick={() => setShowShareBtns(!showShareBtns)}>
                        {showShareBtns ? (
                          // close
                          <svg viewBox='0 0 512 512' style={styles.reactionIcon}>
                            <path
                              fill='currentColor'
                              d='M331.3 180.7c-6.25-6.25-16.38-6.25-22.62 0L256 233.4L203.3 180.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62L233.4 256L180.7 308.7c-6.25 6.25-6.25 16.38 0 22.62c6.246 6.246 16.37 6.254 22.62 0L256 278.6l52.69 52.69c6.246 6.246 16.37 6.254 22.62 0c6.25-6.25 6.25-16.38 0-22.62L278.6 256l52.69-52.69C337.6 197.1 337.6 186.9 331.3 180.7zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256S512 397.4 512 256S397.4 0 256 0zM256 480c-123.5 0-224-100.5-224-224s100.5-224 224-224s224 100.5 224 224S379.5 480 256 480z'
                            />
                          </svg>
                        ) : (
                          // share
                          <svg viewBox='0 0 55.212 53.223' style={styles.reactionIcon}>
                            <path
                              d='M54.681,15.837,40.217,3.1a1.147,1.147,0,0,0-.8-.4,1.189,1.189,0,0,0-1.194,1.194h0V9.733a29.867,29.867,0,0,0-9.687,1.99S2,24.861,2,52.727a1.309,1.309,0,0,0,1.327,1.194c.663,0,1.062-.531,1.194-1.194,0-11.943,5.971-20.436,17.914-25.345A65.893,65.893,0,0,1,38.359,23.8v5.706A1.189,1.189,0,0,0,39.554,30.7h0a.946.946,0,0,0,.8-.4L54.814,17.562a1.147,1.147,0,0,0,.4-.8,2.139,2.139,0,0,0-.531-.929'
                              transform='translate(-1 -1.699)'
                              fill='none'
                              stroke='#fff'
                              strokeWidth='2'
                            />
                          </svg>
                        )}
                      </div>
                      <SocialShare
                        customClass={
                          `d-none d-md-block detailPageMoreVideos-shareBtns ` +
                          (showShareBtns
                            ? 'detailPageMoreVideos-shareBtnsVisible'
                            : 'detailPageMoreVideos-shareBtnsHidden')
                        }
                        emailText={metaDesc}
                        storyHeading={storyHeading}
                        emailSub='Watch this inspiring video'
                        fbTitle={COMMON_HASHTAG.inspiringStories}
                        twitterTitle={`${storyHeading}. Watch an inspiring story. ${COMMON_HASHTAG.common}`}
                        embedLink={getCopyLink(v.slug)}
                        copyLink={getCopyLink(v.slug)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
          <SocialShare
            customClass={
              `d-md-none detailPageMoreVideos-shareBtnsMobile ` +
              (showShareBtns
                ? 'detailPageMoreVideos-shareBtnsVisible'
                : 'detailPageMoreVideos-shareBtnsHidden')
            }
            customStyle={{ right: videoUrls.length === 1 ? '2%' : '' }}
            emailText={metaDesc}
            storyHeading={storyHeading}
            emailSub='Watch this inspiring video'
            fbTitle={COMMON_HASHTAG.inspiringStories}
            twitterTitle={`${storyHeading}. Watch an inspiring story. ${COMMON_HASHTAG.common}`}
            embedLink={!!videoUrls?.length ? getCopyLink(videoUrls[slideIndex]?.slug) : ''}
            copyLink={!!videoUrls?.length ? getCopyLink(videoUrls[slideIndex]?.slug) : ''}
          />
        </div>
        {!!videoSlugObj && (
          <>
            {/* <CloseBtn closeModalOnly={true} handleClick={closeOverlay} /> */}
            <div className='detailPageMoreVideos-videoSlugOverlay'>
              <div className='detailPageMoreVideos-videoSlugBox'>
                <div className='detailPageMoreVideos-videoSlugContainer'>
                  <ReactHlsPlayer
                    onClick={toggleOverlayPlay}
                    playerRef={overlayVideoRef}
                    draggable='false'
                    className={`detailPageMoreVideos-overlayVideo`}
                    url={videoSlugObj.video_url_landscape}
                    poster={videoSlugObj.video_landscape_thumb}
                    controls={false}
                    playsInline
                    preload='metadata'
                    muted={true}
                    autoplay={true}
                  />
                  <i
                    style={{ opacity: isOverlayVideoPlaying ? '0' : '1' }}
                    className={
                      'detailPageMoreVideos-playIcon icon-' +
                      (isOverlayVideoPlaying ? 'pause-1' : 'play')
                    }
                  ></i>
                  <div
                    className='detailPageMoreVideos-muteContainer'
                    onClick={toggleOverlayVideoMute}
                  >
                    <span>Tap to {isOverlayVideoMute ? 'unmute' : 'mute'}</span>
                    <i
                      className={
                        'detailPageMoreVideos-icon icon-' + (isOverlayVideoMute ? 'mute' : 'unmute')
                      }
                    ></i>
                  </div>
                </div>
                <p className='detailPageMoreVideos-overlayPara'>{videoSlugObj.storyHeading}</p>
              </div>
            </div>
          </>
        )}
      </>
    )
  );
}

export default StoryDetailPageMoreVideos;

const styles = `
  .detailPageMoreVideos {
    margin-bottom: 2em;
    color: #fff;
    position: relative;
  }

  .detailPageMoreVideos-item:not(:last-child) {
    margin-right: 0em;
  }

  .detailPageMoreVideos-item:not(.Slider-activeSlide) > video {
    transform: scale(0.92);
  }

  .detailPageMoreVideos-item {
    --item-width: 70%;
    --item-max-width: 1050px;
    position: relative;
    // overflow: hidden;
    border-radius: 1vw;
    flex-shrink: 0;
    width: var(--item-width);
    max-width: var(--item-max-width);
    filter: brightness(0.6);
  }

  .detailPageMoreVideos-item.Slider-activeSlide {
    filter: brightness(1);
  }

  .detailPageMoreVideos-item:first-child {
    margin-left: calc((100% - var(--item-width))/2);
  }

  .detailPageMoreVideos-item:last-child {
    margin-right: calc((100% - var(--item-width))/2);
  }

  @media(min-width: 1200px) {
    .detailPageMoreVideos-item:first-child {
      margin-left: calc((100% - var(--item-max-width))/3.2);
    }
  
    .detailPageMoreVideos-item:last-child {
      margin-right: calc((100% - var(--item-max-width))/2);
    }
  }

  .detailPageMoreVideos-item::before {
    content: '';
    padding-top: 56.25%;  
    display: block;
  }

  .detailPageMoreVideos-item > video {
    user-select: none;
    -webkit-user-select: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    border-radius: 1vw;
    background: #1c1c1c;
    transition: transform linear 200ms;
  }

 .detailPageMoreVideos-playIcon {
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
    display: none;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    opacity: 1;
    transition: opacity linear 150ms;
  }

  .detailPageMoreVideos-muteContainer {
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 1em;
    display: none;
    align-items: center;
  }

  .detailPageMoreVideos-icon {
    width: 2em;
    height: 2em;
    border-radius: 50%;
    margin-left: 0.8em;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.1em 0.45em;
  }

  .detailPageMoreVideos-item.Slider-activeSlide .detailPageMoreVideos-playIcon {
    display: flex;
  }

  .detailPageMoreVideos-item.Slider-activeSlide .detailPageMoreVideos-muteContainer {
    display: flex;
  }

  .detailPageMoreVideos-shareBtns {
    transition: opacity linear 100ms;
    position: absolute;
    bottom: 135% !important;
    right: initial;
    left: -4%;
    background: transparent;
  }

  .detailPageMoreVideos-shareBtnsMobile {
    transition: opacity linear 100ms;
    position: absolute;
    bottom: 21% !important;
    right: 12%;
    left: initial;
    background: transparent;
  }

  .detailPageMoreVideos-shareBtns ul,
  .detailPageMoreVideos-shareBtnsMobile ul {
    flex-direction: column !important;
  }

  .detailPageMoreVideos-shareBtnsVisible {
    opacity: 1;
    pointer-events: auto;
  }

  .detailPageMoreVideos-shareBtnsHidden {
    opacity: 0;
    pointer-events: none;
  }

  /* videoSlug overlay */

  .detailPageMoreVideos-videoSlugOverlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 8;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.9);
    overflow: auto;
    color: white;
  }

  .detailPageMoreVideos-videoSlugBox {
    max-width: 1050px;
    margin: 1.5em 1.5em 0;
  }

  .detailPageMoreVideos-videoSlugContainer {
    position: relative;
    margin-bottom: 0.5em;
  }

  .detailPageMoreVideos-videoSlugContainer > video {
    border-radius: 1vw;
  }

  .detailPageMoreVideos-videoSlugContainer > :nth-child(n + 2) {
    display: flex;
  }

  .detailPageMoreVideos-videoSlugContainer > [class*='muteContainer'] {
    bottom: 100%;
    margin: 0.5em;
  }

  .detailPageMoreVideos-overlayPara {
    font-size: 18px;
    text-align: center;
    margin: 0;
  }

  @media(max-width: 760px) {
    .detailPageMoreVideos-item:not(:last-child) {
      margin-right: 0em;
    }

    .detailPageMoreVideos-muteContainer {
      font-size: 11px;
      margin: 0.5em;
    }
  }
  .customData .detailPageMoreVideos-item:first-child {
      margin-left: 0;
  }
`;