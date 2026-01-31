import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import useWindowSize from '../../utils/useWindowSize';
import { useSelector } from 'react-redux';
// import ReactHlsPlayer from '../HSL/components/react-hls-player';
import CustomStyle from '../common/CustomStyle';

const HomePageFooter = () => {
  const categoryList = [
    'PROFESSIONALS',
    'CREATORS',
    'BUSINESS OWNERS',
    'SHOPKEEPERS',
    'SOCIAL WORKERS',
    'YOU',
  ];
  const [category, setCategory] = useState(categoryList[0]);
  const categoryElemRef = useRef();
  const celebratingElemRef = useRef();
  const animationDone = useRef(false);
  const { width } = useWindowSize();
  const isHindi = useSelector(state => state.blogs.isHindi);
  const footerRef = useRef();
  // const [currentVideo, setCurrentVideo] = useState('');
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  // const [videoUrls, setVideoUrls] = useState([]);
  // const playerRef = useRef();

  // function changeVideo() {
  //   const nextVideo = videoUrls[videoUrls.indexOf(currentVideo) + 1];

  //   if (nextVideo && nextVideo.endsWith('m3u8')) {
  //     setCurrentVideo(nextVideo);
  //   }
  // }

  useEffect(() => {
    if (!isFooterVisible || animationDone.current) return;

    const celebratingElem = celebratingElemRef.current;
    const categoryElem = categoryElemRef.current;
    let i = 1;

    celebratingElem.classList.remove('HomePageFooter-animateCelebrating');
    categoryElem.classList.remove('HomePageFooter-animateCategory');
    
    setTimeout(() => {
      celebratingElem.classList.add('HomePageFooter-animateCelebrating');
      categoryElem.classList.add('HomePageFooter-animateCategory');
    }, 1);

    const categoryInterval = setInterval(() => {
      setCategory(categoryList[i]);
      i += 1;

      if (i === categoryList.length) {
        clearInterval(categoryInterval);
        animationDone.current = true;
      }
    }, 2500);

    return () => clearInterval(categoryInterval);
  }, [isFooterVisible]);

  useEffect(() => {
    const footerStyle = footerRef.current.style;

    if (window.innerWidth < 500) {
      footerStyle.fontSize = '7.5px';
    } else if (window.innerWidth < 900) {
      footerStyle.fontSize = '10px';
    } else {
      footerStyle.fontSize = '1rem';
    }
  }, [width]);

  // useEffect(() => {
  //   if (isFooterVisible && !currentVideo) {
  //     fetch('https://cdn.workmob.com/stories_workmob/story-questions/story-type.json')
  //       .then(res => res.json())
  //       .then(data => fetch(data[Math.floor(Math.random() * data.length)].questions_url))
  //       .then(res => res.json())
  //       .then(processData);

  //     function processData(data) {
  //       setCurrentVideo(data[0].video_url_hindi);
  //       // setVideoUrls(data.map(v => v.video_url_hindi));
  //     }
  //   }

  //   if (playerRef.current) {
  //     if (isFooterVisible) {
  //       playerRef.current.play();
  //     }

  //     else {
  //       playerRef.current.pause();
  //     }
  //   }
  // }, [isFooterVisible]);

  useEffect(() => {
    let timeout;

    function listener() {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        if (footerVisible()) {
          setIsFooterVisible(true);
        } else {
          setIsFooterVisible(false);
        }
      }, 500);
    }

    listener();
    document.addEventListener('scroll', listener);

    return () => document.removeEventListener('scroll', listener);
  }, []);

  function footerVisible() {
    if (footerRef.current.getBoundingClientRect().top <= window.innerHeight) {
      return true;
    }

    return false;
  }

  return (
    <>
      <CustomStyle>{styleString}</CustomStyle>
      <div className='HomePageFooter' ref={footerRef}>
        <div style={styles.container}>
          {/* <div className='d-none d-md-flex' style={styles.sideContent}>
          <div style={styles.videoContainer}>
            <div style={{ paddingTop: '195%' }}></div>
            <img
              style={styles.videoFrame}
              src='https://cdn.workmob.com/stories_workmob/images/common/phone-frame.png'
              alt='mobile frame'
            />
            <ReactHlsPlayer
              playerRef={playerRef}
              style={styles.video}
              id='footerVid'
              className='footerVid'
              url={currentVideo}
              autoPlay={true}
              preload='auto'
              controls={false}
              onEnded={changeVideo}
              muted={true}
              playsInline={true}
            />
          </div>
        </div> */}
          <div style={styles.middleContent}>
            <p className={'HomePageFooter-meriKahani' + (isHindi ? 'Hindi' : '')}>
              <span style={{ color: '#FF9933' }}>#</span>
              <span style={{ color: '#ffffff' }}>{isHindi ? 'मेरी' : 'Meri'}</span>
              <span style={{ color: '#128807' }}>{isHindi ? 'कहानी' : 'Kahani'}</span>
              <span style={styles.bottomBorder}></span>
            </p>
            <img
              className='HomePageFooter-karmayogiFestival'
              src='https://cdn.workmob.com/stories_workmob/promotional/karmyogiyo-ka-utsav.png'
              alt='karmayogion ka utsav image'
            />
            <p className='HomePageFooter-celebrating' ref={celebratingElemRef}>
              CELEBRATING{' '}
              <span className='HomePageFooter-category' ref={categoryElemRef}>
                {category}
              </span>
            </p>
            <p className='HomePageFooter-titleBox'>
              {isHindi
                ? 'एक मुहिम, जिसमें प्रोफेशनल्स, क्रिएटर्स, व्यापारी, उद्योगपति और सामाजिक कार्यकर्ता अपनी प्रेरक कहानियों के माध्यम से भारतवर्ष में अनुभवों से सीखने की परम्परा को आगे बढ़ा रहे है। आप भी जुड़िए इस मुहिम से और अपनी कहानी से लोगों को प्रेरित करें, आशा दें और उन्हें नई राह दिखाएं'
                : 'An initiative to empower professionals, creators, small business owners, entrepreneurs and social workers to share their life experiences and career journey. Join this campaign to give hope, to inspire and to help change lives.'}
            </p>
            <p className='HomePageFooter-banaoApniPehchan'>
              <span style={{ color: '#F96332' }}>बनाओ </span>
              <span style={{ color: '#ffffff' }}>अपनी </span>
              <span style={{ color: '#128807' }}>पहचान</span>
            </p>
          </div>
          {/* <div className='d-none d-md-flex' style={styles.sideContent}>
          <img
            style={styles.manWoman}
            src='https://cdn.workmob.com/stories_workmob/images/common/man.png'
            alt='man'
          />
          <img
            style={styles.manWoman}
            src='https://cdn.workmob.com/stories_workmob/images/common/woman.png'
            alt='woman'
          />
        </div> */}
        </div>
        <div style={styles.bottomContent}>
          <a
            href='https://play.google.com/store/apps/details?id=com.workmob'
            target='_blank'
            className='d-block d-md-none'
            style={styles.appLink}
          >
            <img
              className='w-100'
              width="100%"
              height="100%"
              src='https://cdn.workmob.com/stories_workmob/web_home/googleplaystore.png'
              alt='play store badge'
            />
          </a>
          <p className='d-none d-md-block text-left' style={styles.bottomPara}>
            Lets Inspire Together
          </p>
          <p className='HomePageFooter-madeWithLove'>
            <span>MADE WITH&nbsp;</span>
            <img
              src='https://cdn.workmob.com/intro_workmob/images/common/heart.svg'
              // src='https://www.workmob.com/static/media/heart.33403302.svg'
              alt='heart'
              width='12'
              height='12'
            />
            <span>&nbsp;IN भारत</span>
          </p>
          <a
            href='https://apps.apple.com/in/app/workmob-professional-network/id901802570'
            target='_blank'
            className='d-block d-md-none'
            style={styles.appLink}
          >
            <img
              className='w-100'
              width="100%"
              height="100%"
              src='https://cdn.workmob.com/stories_workmob/web_home/appstore.png'
              alt='app store badge'
            />
          </a>
          <p className='d-none d-md-block text-right' style={styles.bottomPara}>
            WE CAN. BHARAT CAN.
          </p>
        </div>
      </div>
    </>
  );
};

export default withRouter(HomePageFooter);

const styleString = `
  .HomePageFooter {
    background-image: url(https://cdn.workmob.com/stories_workmob/images/common/path_2.png);
    background-size: cover;
    background-position: center;
    color: white;
    font: 1rem Montserrat, sans-serif;
    padding: 1.5em 1em 0;
  }

  .HomePageFooter-meriKahani {
    font: 5em Alata, sans-serif;
    position: relative;
    margin-bottom: 0;
  }

  .HomePageFooter-meriKahaniHindi {
    font: bold 5em Montserrat, sans-serif;
    position: relative;
  }

  .HomePageFooter-karmayogiFestival {
    width: 36em;
    margin-bottom: 0.5em;
  }

  .HomePageFooter-titleBox {
    font-size: 1.4em;
    font-weight: bold;
    border: 5px solid #b6b3b4;
    padding: 0.5em;
    color: rgb(247 217 57);
    filter: drop-shadow(black 0.05em 0.1em 0.05em);
  }

  .HomePageFooter-banaoApniPehchan {
    font-size: 2.4em;
    font-weight: bold;
    margin: 0 0 0.5em;
  }

  .HomePageFooter-celebrating {
    font-size: 2em;
    font-weight: bold;
    display: flex;
    width: 300px;
    margin: 0 auto 0.35em;
  }

  .HomePageFooter-category {
    margin-left: 0.3em;
    transform: translateY(80%);
    opacity: 0;
    white-space: nowrap;
  }

  .HomePageFooter-animateCategory {
    animation: moveIn linear 2.5s 4.5 forwards;
  }

  .HomePageFooter-animateCelebrating {
    animation: fadeOutFadeIn linear 2.5s 11.25s forwards;
  }

  .HomePageFooter-madeWithLove {
    font: 100 13px/2 "Montserrat", sans-serif;
    width: 128px;
    margin: 0 auto 0.5em;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  @keyframes moveIn {
    0% {
      transform: translateY(80%) ;
      opacity: 0;
    }
  
    10%,
    90% {
      transform: translateY(0) ;
      opacity: 1;
    }
  
    100% {
      transform: translateY(-80%);
      opacity: 0;
    }
  }

  @keyframes fadeOutFadeIn {
    0% {
      opacity: 1;
    }
  
    50% {
      opacity: 0;
    }
  
    100% {
      opacity: 1;
      width: max-content
    }
  }

  @media(max-width: 900px) {
    .HomePageFooter-celebrating {
      width: 185px;
    }
  }
`;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  sideContent: {
    width: '200px',
    minWidth: '170px',
    display: 'flex',
    alignItems: 'center',
  },
  manWoman: {
    width: '50%',
  },
  // videoContainer: {
  //   position: 'relative',
  //   width: '100%',
  //   borderRadius: '30px',
  //   overflow: 'hidden',
  // },
  // video: {
  //   transform: 'scale(0.97)',
  //   position: 'absolute',
  //   width: '100%',
  //   height: '100%',
  //   top: '0',
  //   right: '0',
  //   bottom: '0',
  //   left: '0',
  // },
  // videoFrame: {
  //   position: 'absolute',
  //   width: '100%',
  //   height: '100%',
  //   zIndex: '1',
  //   pointerEvents: 'none',
  //   top: '0',
  //   right: '0',
  //   bottom: '0',
  //   left: '0',
  // },
  middleContent: {
    textAlign: 'center',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 1em',
  },
  bottomBorder: {
    width: '6%',
    maxWidth: '50px',
    height: 'max-content',
    borderBottom: '4px solid #F96332',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    margin: 'auto auto 0',
  },
  bottomContent: {
    fontSize: '1.6em',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
  },
  bottomPara: {
    flex: '1',
  },
  appLink: {
    width: '100px',
    marginBottom: '1em',
  },
};
