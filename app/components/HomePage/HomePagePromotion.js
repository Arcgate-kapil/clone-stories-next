import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
// import { customEvent } from '../../actions/firebase';
import { WHITE } from '../../constants/colors';
// import { EVENT_TYPE } from '../../constants/firebaseString';
import ReactHlsPlayer from '../HSL/components/react-hls-player';
import CustomStyle from '../common/CustomStyle';

const HomePagePromotion = (props) => {
  // const contactUsClick = () => {
  //   customEvent(EVENT_TYPE.shareYourStory, {
  //     section: 'banner',
  //   });
  // };
 
  const [play, setPlay] = useState(true);
  const playerRefPromotion = useRef();

  const videos = [
    {
      poster: 'https://cdn.workmob.com/stories_workmob/promotional/workmob_intro_ads.jpg',
      url:
        'https://cdn.workmob.com/stories_workmob/promotional/workmob_intro_ads/workmob_intro_ads.m3u8',
    },
  ];

  useEffect(() => {
    playerRefPromotion.current.muted = true;
    playerRefPromotion.current.controls = false;
  }, []);

  useEffect(() => {
    const player = playerRefPromotion.current;

    const checkVisibility = () => {
      if (
        player.getBoundingClientRect().top < innerHeight - 30 &&
        player.getBoundingClientRect().bottom > 30
      ) {
        if (player.paused) {
          player.play();
          setPlay(true);
        }
      } else {
        player.pause();
        setPlay(false);
      }
    };

    document.addEventListener('scroll', checkVisibility);

    return () => document.removeEventListener('scroll', checkVisibility);
  }, []);

    function togglePlay(event) {
    // playBtn.current.style.opacity = 1;

    if (event.type === 'click') {
      setTimeout(() => {
        // playBtn.current.style.opacity = 0;
      }, 1000);
      setPlay(!play);
    }

    if (playerRefPromotion.current.paused) {
      playerRefPromotion.current.play();
      // playBtn.current.style.opacity = 0;
    } else {
      playerRefPromotion.current.pause();
    }
    // playStateRef.current = !play;
  }

  return (
    <div
      className={`jumbotron bg-trabsparent py-4 promotion-background position-relative promoBannerClass heightAuto`}
    >
      <CustomStyle>{styleString}</CustomStyle>
      <div style={styles.promoVideo}>
      <div style={{ paddingTop: '55.66%',borderRadius:'1.5vw' }}></div>
        <ReactHlsPlayer
          className={`promotionVideo1`}
          style={{ borderRadius: '1.5vw' }}
          url={videos[0].url}
          poster={videos[0].poster}
          controls={false}
          autoPlay={false}
          preload='none'
          playerRef={playerRefPromotion} 
          onEnded={togglePlay}
          playsInline={true}
        />
        {/* <VideoPlayer ref={playerRefPromotion} src={videos[0].url} poster={videos[0].poster} className="promotionVideo1 w-100 br-1-5" /> */}
      </div>
        <div style={styles.shareStoryBtn}>
          <Link
            style={styles.shareStoryLink}
            // onClick={contactUsClick}
            href={{
              pathname: '/merikahani',
              state: true,
            }}
            className={`btn font-weight-bold ${props.isHindi ? 'font-khand' : 'montserrat-regular'} btn-lg mx-auto px-5 brandingPageEffect`}
          >
            {props.isHindi ? 'कहानी शेयर करें' : 'Get your branding page'}
          </Link>
        </div>
    </div>
  );
};

export default HomePagePromotion;

const styleString = `
.promotionVideo1{
  // height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.brandingPageEffect{
  transition: transform 0.3s ease-in-out;
}

.brandingPageEffect:hover {
  transform: scale(1.05);
}
  .promotionVideo {
    bottom: -35px;
    right: 0;
  }

  @media(max-width: 770px) {
    .promotionVideo {
      bottom: 2.25%;
      right: 1.25%;
    }
  }
  .promoBannerClass {
    background-color: transparent;
    background-size: contain;
    background-attachment: fixed;
    margin-bottom: 0;
  }
  .heightAuto {
    height: auto;
  }
  .height100vh {
    height: 100vh;
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
    maxWidth: '1000px',
    margin: '0 auto',
    position: 'relative',
    color: '#ffffff',
    background: '#1c1c1c',
    borderRadius: '1.5vw'
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
  },
  videoControls: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
  },
  muteIconContainer: {
    marginRight: '0.3em',
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
