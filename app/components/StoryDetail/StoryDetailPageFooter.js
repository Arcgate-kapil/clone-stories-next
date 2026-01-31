import React, { useRef, useEffect, useState } from 'react';
// import ReactHlsPlayer from '../HSL/components/react-hls-player';
import CustomStyle from '../common/CustomStyle';
import { useSelector } from 'react-redux';
import Footer from '../Footer';
import { Link } from 'react-router-dom';

function StoryDetailPageFooter() {
  const isHindi = useSelector(state => state.blogs.isHindi);
  // const playerRef = useRef();
  // const [videoUrl, setVideoUrl] = useState('');
  // const video = {
  //   url: 'https://cdn.workmob.com/stories_workmob/promotional/banaoapnipehchan_ads1/banaoapnipehchan_ads1.m3u8',
  //   poster: 'https://cdn.workmob.com/stories_workmob/promotional/banaoapnipehchan_ads1.jpg'
  // }

  // function togglePlay() {
  //   const player = playerRef.current;

  //   if (player.paused) {
  //     player.play();
  //   }
    
  //   else {
  //     player.pause();
  //   }
  // }

  // useEffect(() => {
  //   const player = playerRef.current;
  //   let timeout;

  //   const checkVisibility = () => {
  //     clearTimeout(timeout);

  //     timeout = setTimeout(() => {
  //       if (player.getBoundingClientRect().top <= window.innerHeight) {
  //         setVideoUrl(video.url);
  //       }

  //       if (
  //         player.getBoundingClientRect().top >= 0 &&
  //         player.getBoundingClientRect().bottom <= window.innerHeight
  //       ) {
  //         player.play();
  //       }
        
  //       else {
  //         player.pause();
  //       }
  //     }, 100);
  //   };

  //   document.addEventListener('scroll', checkVisibility);

  //   return () => document.removeEventListener('scroll', checkVisibility);
  // }, []);

  // useEffect(() => {
  //   const player = playerRef.current;

  //   player.controls = false;
  //   player.muted = true;
  // }, []);

  return (
    <div className='detailPageFooterVideo position-relative' style={{zIndex:1}}>
      <CustomStyle>{styles}</CustomStyle>
      <div className='detailPageFooter-Container'>
        {/* <ReactHlsPlayer
          playerRef={playerRef}
          className='detailPageFooterVideo-video'
          url={videoUrl}
          poster={video.poster}
          controls={false}
          //   autoPlay={true}
          preload='metadata'
          muted={true}
          playsInline={true}
        /> */}
        <div className='detailPageFooter-content'>
          <p className='detailPageFooter-banaoApniPehchan'>
            <span style={{ color: '#F96332' }}>बनाओ </span>
            <span style={{ color: '#ffffff' }}>अपनी </span>
            <span style={{ color: '#128807' }}>पहचान</span>
          </p>
          <p className='detailPageFooter-introPara'>Introduce yourself with a unique QR code.</p>
          <p className='detailPageFooter-titleBox'>Share your personal and business branding videos in one place. Tell your story, inspire, and build your brand.</p>
        </div>
        <div className='detailPageFooterVideo-footer'>
          <div className='d-flex align-items-center justify-content-between'>
            <div className='detailPageFooterVideo-appLinksContainer'>
              <div className='detailPageFooterVideo-appLinks'>
                <a
                  href='https://play.google.com/store/apps/details?id=com.workmob'
                  target='_blank'
                  className='mr-3'
                >
                  <img
                    className='w-100'
                    width="100%"
                    height="100%"
                    src='https://cdn.workmob.com/stories_workmob/web_home/googleplaystore.png'
                    alt='play store badge'
                  />
                </a>
                <a
                  href='https://apps.apple.com/in/app/workmob-professional-network/id901802570'
                  target='_blank'
                >
                  <img
                    className='w-100'
                    width="100%"
                    height="100%"
                    src='https://cdn.workmob.com/stories_workmob/web_home/appstore.png'
                    alt='app store badge'
                  />
                </a>
              </div>
              <div className='footer-copyright text-white font-12 mr-md-3 order-1 order-md-0'>
                &copy; {new Date().getFullYear()} Workmob Pvt. Ltd. All rights reserved.
              </div>
            </div>
            <p className='detailPageFooterVideo-madeWithLove'>
              <span>Made with&nbsp;</span>
              <img
                className='mt-1'
                src='https://cdn.workmob.com/intro_workmob/images/common/heart.svg'
                // src='https://www.workmob.com/static/media/heart.33403302.svg'
                alt='heart'
                width='12'
                height='12'
              />
              <span>&nbsp;in India</span>
            </p>
            <div className='detailPageFooterVideo-socialLinksContainer'>
              <div className='footer-social text-nowrap'>
                <a
                  href='https://www.facebook.com/workmobapp/'
                  target='_blank'
                  className='btn btn-social-icon bg-transparent'
                >
                  <img
                    src='https://cdn.workmob.com/stories_workmob/images/common/facebook.svg'
                    alt='fb'
                  />
                </a>
                <a
                  href='https://www.instagram.com/workmobapp/'
                  target='_blank'
                  className='btn btn-social-icon bg-transparent'
                >
                  <img
                    src='https://cdn.workmob.com/stories_workmob/images/common/instagram.svg'
                    alt='instagram'
                  />
                </a>
                <a
                  href='https://youtube.com/channel/UCqOjwc1ZJmhy5oJJM3rhziA'
                  target='_blank'
                  className='btn btn-social-icon bg-transparent'
                >
                  <img
                    src='https://cdn.workmob.com/stories_workmob/images/common/youtube.svg'
                    alt='youtube'
                  />
                </a>
                <a
                  href='https://twitter.com/Workmob'
                  target='_blank'
                  className='btn btn-social-icon bg-transparent'
                >
                  <img
                    src='https://cdn.workmob.com/stories_workmob/images/common/twitter.svg'
                    alt='twitter'
                  />
                </a>
                <a
                  href='https://www.linkedin.com/company/workmobapp/'
                  target='_blank'
                  className='btn btn-social-icon bg-transparent pr-0'
                >
                  <img
                    width="100%"
                    height="auto"
                    src='https://cdn.workmob.com/stories_workmob/images/common/linkedin.svg'
                    alt='linkedin'
                  />
                </a>
              </div>
              <div className='mb-2 mb-md-0 detailPageFooterVideo-aboutLinks'>
                <Link to='/about' className='mr-3'>
                  {isHindi ? 'जानकारी' : 'About'}
                </Link>
                <a href='https://www.workmob.com/terms' target='_blank' className='mr-3'>
                  {isHindi ? 'टर्म्स' : 'Terms'}
                </a>
                <a className='mr-3' href='https://www.workmob.com/legal' target='_blank'>
                  {isHindi ? 'लीगल' : 'Legal'}
                </a>
                <a className='mr-3' href='https://www.workmob.com/privacy' target='_blank'>
                  {isHindi ? 'प्राइवेसी' : 'Privacy'}
                </a>
                <a href='https://www.workmob.com/brand-ambassador' target='_blank'>
                  {isHindi ? 'एम्बेसडर' : 'Ambassador'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StoryDetailPageFooter;

const styles = `
  // .detailPageFooterVideo-video {
  //   background: #1c1c1c;
  //   position: relative;
  //   color: #fff;
  // }

  // .detailPageFooterVideo-videoContainer::before {
  //   content: '';
  //   display: block;
  //   padding-top: 41.72%;
  // }

  .detailPageFooterVideo {
    display: flex;
    flex-direction: column;
    padding: 1.5em 1em 0;
    background: center/cover url('https://cdn.workmob.com/stories_workmob/images/common/path_2.png');
  }

  .detailPageFooter-Container {
    color: #fff;
  }

  .detailPageFooter-content {
    max-width: 1000px;
    margin: 0 auto 2em;
    text-align: center;
  }

  .detailPageFooter-introPara {
    font: bold 2.5em "Montserrat", sans-serif;
    color: #e7c822;
    margin-bottom: 0.1em;
  }

  .detailPageFooter-titleBox {
    font: 1.9em "Alata", sans-serif;
    padding: 0.25em;
    color: rgb(247 217 57);
    filter: drop-shadow(black 0.05em 0.1em 0.05em);
  }

  .detailPageFooter-banaoApniPehchan {
    font-size: 3.7em;
    font-weight: bold;
    margin: 0 0 0.1em;
    position: relative;
  }

  .detailPageFooter-banaoApniPehchan::after {
    content: '';
    width: 40px;
    height: 5px;
    position: absolute;
    top: 96%;
    left: 50%;
    transform: translateX(-50%);
    background: #F96332;
  }

  .detailPageFooterVideo-video {
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .detailPageFooterVideo-bottomContent {
    font: bold 1.5em "Montserrat", sans-serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    margin: 0.5em 0.65em;
  }

  .detailPageFooterVideo-madeWithLove {
    font: 100 13px/2 "Segoe UI", sans-serif;
    width: 128px;
    margin: 0 auto;
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detailPageFooterVideo-bottomPara {
    flex: 1;
    margin: 0;
  }

  .detailPageFooterVideo-footer {
    // position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 1em 0.5em;
  }

  .detailPageFooterVideo-socialLinksContainer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .detailPageFooterVideo-socialLinksContainer > :first-child {
    margin-bottom: 0.5em;
  }

  .detailPageFooterVideo-aboutLinks > a {
    font-size: 12px;
    text-decoration: none;
    color: inherit;
  }

  .detailPageFooterVideo-appLinks {
    width: 230px;
    margin: 0 auto 1em 0;
    display: flex;
  }

  @media(max-width: 575px) {
    .detailPageFooterVideo-bottomContent {
      font-size: 12px;
    }

    .detailPageFooter-introPara {
      font-size: 2.1em;
    }

    .detailPageFooter-titleBox {
      font-size: 1.65em;
    }
  }

  @media (max-width: 735px) {
    // .detailPageFooterVideo-appLinksContainer,
    // .detailPageFooterVideo-socialLinksContainer {
    //   display: none;
    // }

    .detailPageFooter-content {
      font-size: 9px;
    }

    .detailPageFooter-titleBox {
      font-size: 1.4em;
    }

    .detailPageFooter-banaoApniPehchan::after {
      width: 28px;
      height: 3px;
    }

    .detailPageFooterVideo-footer {
      display: none;
    }

    .story-detail-page footer {
      display: block !important;
    }
  }
`;
