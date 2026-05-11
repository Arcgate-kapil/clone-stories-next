import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { WHITE } from '../../constants/colors';
// import ReactHlsPlayer from '../HSL/components/react-hls-player';
import CustomStyle from '../common/CustomStyle';
import Image from 'next/image';

const ReactHlsPlayer = dynamic(
  () => import('../HSL/components/react-hls-player'),
  { ssr: false }
);

const videos = [
  {
    poster: 'https://cdn.workmob.com/stories_workmob/promotional/workmob_intro_ads.webp',
    url:
      'https://cdn.workmob.com/stories_workmob/promotional/workmob_intro_ads/workmob_intro_ads.m3u8',
  },
];

const HomePagePromotion = (props) => {

  const [play, setPlay] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);
  const playerRefPromotion = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px', // 200px pehle se load shuru karo
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad || !playerRefPromotion.current) return;
    const player = playerRefPromotion.current;
    player.muted = true;
    player.controls = false;

    const timer = setTimeout(() => {
      const rect = player.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight - 30 && rect.bottom > 30;

      if (isInView) {
        player.play()
          .then(() => setPlay(true))
          .catch(() => {
            // Agar block hua to muted confirm karke retry
            player.muted = true;
            player.play()
              .then(() => setPlay(true))
              .catch(console.error);
          });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [shouldLoad]);


  useEffect(() => {
    if (!shouldLoad) return;

    const checkVisibility = () => {
      const player = playerRefPromotion.current;
      if (!player) return;
      const rect = player.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight - 30 && rect.bottom > 30;
      if (isInView) {
        if (player.paused) {
          player.play()
            .then(() => setPlay(true))
            .catch(console.error);
        }
      } else {
        player.pause();
        setPlay(false);
      }
    };

    document.addEventListener('scroll', checkVisibility, { passive: true });

    checkVisibility();

    return () => document.removeEventListener('scroll', checkVisibility);
  }, [shouldLoad]);

  const togglePlay = useCallback((event) => {
    const player = playerRefPromotion.current;
    if (!player) return;

    if (player.paused) {
      player.play()
        .then(() => setPlay(true))
        .catch(console.error);
    } else {
      player.pause();
      setPlay(false);
    }
  }, []);

  const handleVideoClick = useCallback((event) => {
    if (event.type === 'click') {
      togglePlay();
    }
  }, [togglePlay]);

  return (
    <div
      className={`jumbotron bg-trabsparent py-4 promotion-background position-relative promoBannerClass heightAuto`}
    >
      <CustomStyle>{styleString}</CustomStyle>
      <div ref={containerRef} style={styles.promoVideo}>
        <div style={{ paddingTop: '55.66%', borderRadius: '1.5vw' }}></div>
        {shouldLoad ? (
          <ReactHlsPlayer
            className={`promotionVideo1`}
            style={{ borderRadius: '1.5vw' }}
            url={videos[0].url}
            poster={videos[0].poster}
            controls={false}
            autoPlay={true}
            loop={true}
            preload='none'
            playerRef={playerRefPromotion}
            onEnded={togglePlay}
            onClick={handleVideoClick}
            playsInline={true}
            muted={true}
          />
        ) : (
          <Image
            src={videos[0].poster}
            alt="Workmob intro video"
            fill   // responsive
            quality={60}
            style={{ objectFit: 'cover', borderRadius: '1.5vw' }}
            sizes="(max-width: 768px) 100vw, 1000px"
          />
          //  <img
          //     src={videos[0].poster}
          //     alt="Workmob intro video"
          //     style={{
          //       position: 'absolute',
          //       top: 0,
          //       right: 0,
          //       bottom: 0,
          //       left: 0,
          //       width: '100%',
          //       height: '100%',
          //       objectFit: 'cover',
          //       borderRadius: '1.5vw',
          //     }}
          //   />
        )}
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
    backgroundImage: 'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.webp)',
    backgroundPosition: 'center',
    backgroundSize: '105%',
    borderRadius: 100,
  },
};