import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import CustomStyle from '../components/common/CustomStyle';
import ReactHlsPlayer from '../components/HSL';
import Slider from 'react-slick';
import AboutHeader from '../components/common/AboutHeader';
import useWindowSize from '../utils/useWindowSize';
import { Helmet } from 'react-helmet';
import { ABOUT_PAGE, HOST } from '../constants/localString';
import { useLocation } from 'react-router-dom';
const AboutStories = () => {
  const [currentTarget, setCurrentTarget] = useState(null);
  const [aboutvideo, setAboutVideo] = useState(null);
  const [headingimg, setHeadingImage] = useState('');
  const location = useLocation();
  const { width } = useWindowSize();
  useEffect(() => {
    fetch('https://cdn.workmob.com/stories_workmob/config/stories_about_video_list.json')
      .then(res => res.json())
      .then(data => setAboutVideo(data));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const playerRef = useRef();
  const sliderSettings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 300,
    infinite: false,
    arrows: false,
    centerMode: true,
    slidesToShow: 3,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleClick = e => {
    const { id } = e.currentTarget;
    setCurrentTarget(id);
    document.querySelectorAll('video').forEach(vid => vid.pause());
    if (currentTarget !== id) {
      document.getElementById(id.replace('-div', '')).play();
    } else {
      setCurrentTarget(null);
    }
  };

  useEffect(() => {
    const player = playerRef.current;

    player.controls = false;
    player.muted = true;
    player.play();
  }, []);

  function togglePlay() {
    playStateRef.current = !play;
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      localStorage.removeItem('searchValue');
    };
  
    // Add the event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth > 767) {
      setHeadingImage(
        'https://cdn.workmob.com/stories_workmob/promotional/Bharat-ke-apne-karmyogiyon.png'
      );
    } else {
      setHeadingImage(
        'https://cdn.workmob.com/stories_workmob/promotional/karmyogiyo-ka-utsav_two_line.png'
      );
    }
  }, []);

  const metaData = () => {
    return (
      <Helmet key={Math.random()}>
        <title>{ABOUT_PAGE.title}</title>
        <meta name='description' itemprop='description' content={ABOUT_PAGE.description}></meta>
        {/* OG:  Open Graph / Facebook Tags Start Here */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={HOST + location.pathname} />
        <meta property='og:title' content={ABOUT_PAGE.title} />
        <meta property='og:description' content={ABOUT_PAGE.description} />
        <meta property='og:image' content={ABOUT_PAGE.ogImage} />
        <meta property='og:site_name' content={ABOUT_PAGE.siteName} />
        {/* OG:  Open Graph / Facebook Tags End Here */}

        {/* Twitter start here */}
        <meta property='twitter:card' content='summary' />
        <meta property='twitter:url' content={HOST + location.pathname} />
        <meta property='twitter:title' content={ABOUT_PAGE.title} />
        <meta property='twitter:description' content={ABOUT_PAGE.description} />
        <meta property='twitter:image' content={ABOUT_PAGE.ogImage} />
        {/* Twitter ends here */}
        <meta name='robots' content='index, follow' />
        <link rel='canonical' href={HOST + location.pathname} />
      </Helmet>
    );
  };

  return (
    <div className='aboutpage'>
      {metaData()}
      <CustomStyle>{styles}</CustomStyle>

      {/* For background video play */}
      <ReactHlsPlayer
        playerRef={playerRef}
        className={`aboutbackgroundPage`}
        url='https://cdn.workmob.com/stories_workmob/promotional/merikahani_about_bg_video/merikahani_about_bg_video/merikahani_about_bg_video.m3u8'
        controls={false}
        autoPlay={true}
        preload='auto'
        muted={true}
        playsInline={true}
        onEnded={togglePlay}
        loop={true}
      />
      <AboutHeader />

      <div className='aboutmaindiv'>
        <div className='aboutcontent'>
          <p className='aboutdesc'>
            <span style={{ color: '#e34b28', opacity: '100%' }}>#</span>
            <span style={{ color: '#ffffff' }}>मेरी</span>
            <span style={{ color: '#128807' }}>कहानी</span>
          </p>

          <div className='AboutPage_tagOne'>
            <div style={{ minHeight: '90px' }}>
              {headingimg && (
                <div className='aboutimgdiv'>
                  <img style={{ width: '75%' }} id='' src={headingimg} alt='karmayogion ki aawaz' />
                  <span className='line' />
                </div>
              )}
            </div>

            <p className='abouttitle'>सुनाओ अपनी कहानी, बनाओ अपनी पहचान</p>
          </div>
          <p className='titleBox'>
            एक मुहिम, जिसमें प्रोफेशनल्स, क्रिएटर्स, व्यापारी, उद्योगपति और सामाजिक कार्यकर्ता अपनी
            प्रेरक कहानियों के माध्यम से भारतवर्ष में अनुभवों से सीखने की परम्परा को आगे बढ़ा रहे है।
            आप भी जुड़िए इस मुहिम से और अपनी कहानी से लोगों को प्रेरित करें, आशा दें और उन्हें नई राह
            दिखाएं।
          </p>
        </div>
        <div className='slidermain'>
          {aboutvideo && aboutvideo?.length > 0 ? (
            <div className='fContent'>
              <div className='videoListing'>
                <Slider {...sliderSettings}>
                  {aboutvideo?.map(item => (
                    <div
                      tabIndex='0'
                      role='button'
                      key={item.uId}
                      onClick={handleClick}
                      onKeyDown={handleClick}
                      id={item.id}
                      className={'vidoeContainerItem'}
                    >
                      <video muted={false} poster={item.poster} id={item.videoId} preload='auto'>
                        <track hidden kind='captions' />
                        <source src={item.video} />
                      </video>
                      {currentTarget !== item.id && (
                        <div className={`playButtonOuter`}>
                          <div className={'playButton'} />
                        </div>
                      )}
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          ) : (
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
          )}
        </div>

        <div className='aboutFlagTwoContainer'>
          <div id='aboutFlagTwo'>
            <p className='m-0'>Lets Inspire Together</p>
          </div>
          <p id='aboutFlagThree'>We can. India can.</p>
        </div>
      </div>
      <div className='footerContainer'>
        <div className='footer'>
          <div className='dialogueContainer'>
            <p className='dialogue'>अपनी कहानी का वीडियो रिकॉर्ड करने के </p>
            <p className='dialogue'>लिए हमें +91 9001 98 55 66 पर WhatsApp करें |</p>
            <p className='copyRight orange'>100% free to use and download</p>
          </div>

          <div className='dflex'>
            <div className='dflexLinks'>
              <a
                target='_blank'
                href='https://play.google.com/store/apps/details?id=com.workmob'
                rel='noreferrer'
              >
                <img
                  src='https://cdn.workmob.com/stories_workmob/web_home/googleplaystore.png'
                  alt='playstore'
                />
              </a>
              <a
                target='_blank'
                href='https://apps.apple.com/in/app/workmob-professional-network/id901802570'
                rel='noreferrer'
              >
                <img
                  width="100%"
                  height="100%"
                  src='https://cdn.workmob.com/stories_workmob/web_home/appstore.png'
                  alt='appstore'
                />
              </a>
            </div>
            {/* <p className='copyRight customCopy'>
              <span>MADE WITH&nbsp; </span>
              <img
                width='12'
                src='https://cdn.workmob.com/intro_workmob/images/common/heart.svg'
                // src='https://www.workmob.com/static/media/heart.33403302.svg'
                alt='heart'
              /><span> &nbsp;IN भारत</span>
            </p> */}
            <img
            src="https://cdn.workmob.com/stories_workmob/web_home/made-with-love-in-bharat.png"
            alt='Made with love in bharat'
            width='180'
            height='30'
          />
            <div className='footer-social text-nowrap copyRightText'>
              <a
                href='https://www.facebook.com/workmobapp/'
                target='_blank'
                className='btn btn-social-icon bg-transparent'
              >
                <img
                  width="100%"
                  height="auto"
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
                  width="100%"
                  height="auto"
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
                  width="100%"
                  height="auto"
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
                  width="100%"
                  height="auto"
                  src='https://cdn.workmob.com/stories_workmob/images/common/twitter.svg'
                  alt='twitter'
                />
              </a>
              <a
                href='https://www.linkedin.com/company/workmobapp/'
                target='_blank'
                className='btn btn-social-icon bg-transparent'
              >
                <img
                  width="100%"
                  height="auto"
                  src='https://cdn.workmob.com/stories_workmob/images/common/linkedin.svg'
                  alt='linkedin'
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    blogs: state.blogs,
    isHindi: state.blogs.isHindi,
    insightListing: state.blogs.insightListing,
  };
};

const mapDispatchToProps = null;

export default {
  component: connect(mapStateToProps, mapDispatchToProps)(AboutStories),
};

const styles = `

.slidermain{
  min-height: 100px;
  position: relative;
  margin: 0 2rem;
  
}
.aboutbackgroundPage{
  position: fixed;
    min-height: 100%;
    min-width: 100%;
    object-fit: cover;
}
.aboutmaindiv{
  display: block; 
  padding: 3rem 0 1rem;
  width: 100%;
}
.aboutcontent{
  max-width: 1000px;
  margin: 0 auto 2em;
  text-align: center;
}
.aboutdesc{
  font-size: 4rem;
  font-weight: 600; 
  font-family: "khand", sans-serif; 
  position: relative;
  z-index: 1;
  margin: 0;
}
.aboutimgdiv{
  position: relative;
}

.line{ 
  position: absolute;
  right: 0;
  left: 50%;
  bottom: 5px;
  background: #dea527;
  width: 50px;
  height: 4px;
  transform: translateX(-50%);
}
.abouttitle{
  color: #F9D338;
  font-size: 35px;
  font-weight: 500;
  margin: 0rem auto 1.5rem; 
  position:relative;
  z-index:1;
  font-family: "khand", sans-serif; 
  font-style: normal;
}

.logo-link{
  display: block;
  margin-bottom: auto;
}
.titleBox{
  font-size: 2em;
  line-height: 35px;
  margin-top: 1rem; 
  border: 5px solid #b6b3b4;
  background: #000;
  padding: 0.5em 0.9em;
  color: #F9D338;
  filter: drop-shadow(black 0.05em 0.1em 0.05em);
  font-family: "Khand", sans-serif;
  font-weight: 600;
  font-style: normal; 
  margin: auto;
}
.headingOne {
  font-size: 24px;
  margin: 10px 0 0 0;
}
.videoListing .vidoeContainerItem {
  width: calc(33% - 10px);
  /* margin: 0 5px; */
  border-radius: 15px;
  position: relative;
  transition: all 0.2s ease-in;
}

.videoListing .vidoeContainerItem:hover {
  cursor: pointer;
  transform: scale(1.03);
}

.videoListing .vidoeContainerItem video {
  width: 95%;
  border-radius: inherit;
  /* box-shadow: 5px 5px 14px rgb(0 0 0 / 70%); */
  /* background-color: rgba(0, 0, 0, 0.5); */
}

.fContent {
  margin-bottom: 0.9em;
}

.fContent p {
  color: #fff;
  font-size: 30px;
  font-family: "Alata", sans-serif;
  margin: 15px 0;
  position: relative;
}

.fContent .dBlock {
  display: block;
  margin-bottom: 5px;
  font-size: 22px;
}
.aboutFlagTwoContainer {
  margin: 0 80px;
  display: flex;
  justify-content: space-between;
  position:relative
}

#aboutFlagTwo {
  font-weight: bold;
  font-size: 24px;
  margin: 0;
  font-family: "Montserrat", sans-serif;
  color: #fff;
}
#aboutFlagThree {
  font-weight: bold;
  font-size: 24px;
  font-family: "Montserrat", sans-serif;
  color: #fff;
  margin: 0 20px 0 0;
}
.socialLogos {
  display: flex;
  justify-content: center;
  width: 100%;
}
.copyRightText {
  color: white;
  font-size: 2.2vw;
  display: flex;
  justify-content: flex-end; 
  width: 100%;
  color: #e34b28;
    opacity: 100%;
}
.socialLogos a {
  margin: 0;
}

.socialLogos img {
  width: 20px;
  padding: 0.375rem 0.75rem;
  aspect-ratio: 2 / 2;
}
.dialogueContainer {
  margin-top: 10px;
  
}

.footer .dialogue {
  font-size: 2.8vw;
  font-weight: 500;
}
.tagOne p {
  color: #dea527;
  font-size: 32px;
  font-weight: bold;
  margin: auto;
}
.playButtonOuter {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
}
.copyRight.orange {
  text-align: center;
  color: #e34b28;
  opacity: 100%;
  font-size: 2vw;
  margin-bottom: 18px;
  margin-top: 1rem; 
  font-family: "Montserrat", sans-serif;
}
.playButton {
  margin: 0 auto;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  position: relative;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0.6em 0 0.6em 1em;
  border-color: transparent transparent transparent #fff;
  opacity: 1;
}

.playButtonOuter:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.playButtonOuter:hover .playButton {
  opacity: 1;
}

.footerContainer {
  position: relative;
  z-index: 999;
  padding: 0 10px;
  text-align: center;
  margin-top: 0;
  margin-bottom: 5px;
}

.footer,
.dflex {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 0 10px;
}
.dflex {
  align-items: center;
  flex-direction: row;
  padding: 0;
  width: 100%;
}
.footer ul li a,
.footer p {
  color: #fff;
  font-size: 14px;
  margin: 0;
  text-decoration: none;
  line-height: 1.3;
  width: 100%;
}
.dflexLinks a {
  margin: 0 10px;
}

.dflexLinks {
  display: flex;
  width: 100%;
  justify-content: flex-start;
}

.dflexLinks img {
  width: 90px;
}

.workmob{
  width: 50%;
}
.workmob-link{
  padding: .375rem 0rem;
}
.dialogue{
  font-family: "Khand", sans-serif;
  font-weight: 700;
  font-style: normal;
}
.copyRight span{
  font: 100 13px/2 "Montserrat", sans-serif;
}
  @media (max-width: 767px) {
    .slick-slide > div {
      margin: 0 10px;
    }
    .slick-list {
      margin: 0 -10px;
    }
    .slidermain{
      padding: 0;
      margin:0
    }
    .aboutmaindiv{
      padding: 1.5rem 0 0;
    }
    .aboutdesc{
      font-size: 3rem;
      margin: 0;
    }
    .aboutimgdiv{
      padding: 0 0 0.8rem 0;
    }
   .aboutcontent{
    font-size: 9px;
    padding: 0 1rem;
   }
   .abouttitle{
    font-size: 22px;
    margin: 0rem auto 0.5rem;
   }
   .titleBox{
    font-size: 1.5em;
    line-height: 20px;
    padding: 0.5em 0.5em;
    max-width: 1000px;
   }
   .line{
    width: 38px;
    height: 3px;
   }
   
  .videoListing {
    flex-direction: column;
    margin-bottom: 0;
  }

  .videoListing .vidoeContainerItem {
    width: 100%;
    /* margin-bottom: 15px; */
  }
  // .fContent{
  //   margin: 0;
  // }
  .fContent p {
    font-size: 15px;
    margin: 15px 0;
  }
  .aboutParaTwo p.flag span {
    font-size: 24px;
  }
  .dialogueContainer{
    margin: 0;
  }
  #aboutFlagTwo,
  #aboutFlagThree {
    font-size: 16px;
    margin-bottom: 16px;
    display: none;
  }

  .tagOne p {
    font-size: 16px;
  }

  #firstEdition {
    width: 120px;
  }

  #kahaniyoKaUtsav {
    width: 70%;
  }

  #aboutFlagTwo::after {
    width: 30px;
    height: 3px;
    left: 75px;
  }

  .footerContainer {
    margin-top: 0;
  }

  .footer.dflex {
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
  }

  .dflex {
    flex-direction: column;
  }

  .footer .dialogue {
    font-size: 4.8vw;
    font-weight: bold;
    line-height: 1.3;
    width: 100%;
   
  }

  .copyRight.orange {
    font-size: 4vw;
  }

  .copyRight {
    margin-bottom: 10px;
  }

  .copyRightText {
    justify-content: center;
    margin-bottom: 0.5em;
  }

  .dflexLinks {
    width: 100%;
    justify-content: center;
    margin: 1rem auto;
    order: -1;
  }

  .socialLogos {
    width: auto;
  }

  .footer ul li a,
  .footer p {
    line-height: 1;
    margin-bottom: 5px;
  }
  .videoListing .vidoeContainerItem video{
    width: 100%;
    object-fit: cover;
    height: 100%;
    display: block
  }
  } 
  .customCopy {
    color: rgba(254, 187, 4, 1) !important;
    font-weight: 600;
    font-size: 13px;
  }
  .customCopy span {
    font-weight: 600;
  }
`;
