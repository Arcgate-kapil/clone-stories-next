import React, { useState } from 'react';
import { ORANGE_1, ORANGE, GREEN, WHITE } from '../../constants/colors';
import { EVENT_TYPE } from '../../constants/firebaseString';
import { customEvent } from '../../actions/firebase';
import useWindowSize from '../../utils/useWindowSize';
import MeriKahaniUploadBox from './MeriKahaniUploadBox';
import { useSelector } from 'react-redux';
// import ReactPageScroller from 'react-page-scroller';
import whatsapp_icon from '../../assets/images/whatsapp_icon.png';

const MeriKhaniPromotion = ({ showButton = true }) => {
  const { width } = useWindowSize();
  const [showVideoModal, toggleVideoModal] = React.useState(false);
  const [currentPage, togglePage] = React.useState(0);
  const isHindi = useSelector(state => state.blogs.isHindi);

  const contactUsClick = () => {
    customEvent(EVENT_TYPE.shareYourStory, {
      section: 'banner',
    });
    toggleVideoModal(true);
    const vidElem = document.getElementById('storyVideo');
    if (!!vidElem) {
      vidElem.muted = true;
      vidElem.pause();
    }
  };

  const closeVideo = () => {
    toggleVideoModal(false);
    const vidElem = document.getElementById('storyVideo');
    if (!!vidElem) {
      vidElem.muted = false;
      vidElem.play();
    }
  };

  const handlePageChange = number => {
    togglePage(number);
    const vidElem = document.getElementById('storyVideo');
    if (!!vidElem) {
      if (number == 0) {
        vidElem.play();
      } else {
        vidElem.pause();
      }
    }
  };

  if (width == 0) {
    return null;
  }

  if (width > 767) {
    return (
      <>
        {/* <div
          style={{ ...styles.promoBanner, marginTop: '2em' }}
          className={`section videoSection px-3 `}
        >
          <MeriKahaniUploadBox />
        </div> */}
        <div style={styles.logo_container}>
          <img
            // className='w-100'
            // style={{ width: '210px' }}
            width="210px"
            height="auto"
            src='https://cdn.workmob.com/stories_workmob/images/common/logo.png'
            alt='logo'
          />
        </div>
        <div style={styles.middleContent} className={`p-3`}>
          {/* <p style={styles.HomePageFooterMeriKahani}>
            <span style={{ color: '#FF9933' }}>#</span>
            <span style={{ color: '#ffffff' }}>{isHindi ? 'Meri' : 'Meri'}</span>
            <span style={{ color: '#128807' }}>{isHindi ? 'Kahani' : 'Kahani'}</span> */}
          {/* <span style={styles.bottomBorder}></span> */}
          {/* </p> */}
          {/* <p style={styles.tell}>Tell your story,inspire,and build your brand.</p> */}
          <div style={{ position: "relative" }}>
            <img
              // className='w-100'
              style={{ width: '400px' }}
              src='https://cdn.workmob.com/stories_workmob/web_home/hastagmerikahani.png'
              alt='logo'
            />
            <span style={styles.bottomBorder}></span>
          </div>
          <p style={styles.build}>Tell your story, inspire, and build your brand.</p>
          <p className='HomepageFooterTitleBox' style={styles.HomePageFooterTitleBox}>
            Get your own single branding page and QR code to help showcase your brand with the power of video. Help people get to know your life experiences, career journey, and the real story behind your products and services.
          </p>
          <p style={styles.build}>Build trust and love for your brand.</p>
          <p style={styles.join}>Join India's own professional community.</p>
          <div style={styles.shareStoryBtn}>
            <a
              style={styles.shareStoryLink}
              target='_blank'
              href={
                `https://wa.me/919001985566?text=` + 'I want to join your movement.'
              }
              className='btn font-weight-bold btn-lg mx-auto brandingPageEffect'
            >
              <div style={styles.contactContainer}>
                <img height={22} src={whatsapp_icon} />
                <h3 style={styles.contactUs}>Contact Us</h3>
              </div>
            </a>
          </div>
        </div>
        <div className='meriKahani_Footer commonFooter' style={styles.footerContainer} >
          <h3 className='mb-0 hpSimplified' style={styles.bottomPara}>
            Aapki Digital Pehchan
          </h3>
          {/* <p className='mb-0' style={styles.banaoApniPehchan}>
            <span>MADE WITH&nbsp;</span>
            <img
              src='https://cdn.workmob.com/intro_workmob/images/common/heart.svg'
              alt='heart'
              width='12'
              height='12'
            />
            <span>&nbsp;IN भारत</span>
          </p> */}
          <img
            src="https://cdn.workmob.com/stories_workmob/web_home/made-with-love-in-bharat-new.png"
            alt='Made with love in bharat'
            width={width < 821 && width > 767 ? '154' : '200'}
            height={width < 821 && width > 767 ? '25' : '36'}
            className={width < 768 ? 'mb-1 mx-auto' : 'mb-1'}
          />
          <h3 className='mb-0 hpSimplified' style={styles.bottomPara}>
            We can. Bharat can.
          </h3>
        </div>
      </>
    );
  } else {
    return (
      <>
        {/* <div
          style={Object.assign({}, styles.promoBanner)}
          className={`d-flex pb-4 flex-column justify-content-center align-items-md-center align-items-start pt-md-0 pt-3 section videoSection px-3 `}
        >
          <div style={{ zIndex: 2 }} className={`position-relative aboutPageContainers `}>
            <MeriKahaniUploadBox />
          </div>
        </div> */}
        <div style={styles.logo_container}>
          <img
            width={160}
            src='https://cdn.workmob.com/stories_workmob/images/common/logo.png'
            alt='logo'
          />
        </div>
        <div style={styles.middleContentMobile} className={`p-3`}>
          {/* <p style={styles.HomePageFooterMeriKahani}>
            <span style={{ color: '#FF9933' }}>#</span>
            <span style={{ color: '#ffffff' }}>{isHindi ? 'Meri' : 'Meri'}</span>
            <span style={{ color: '#128807' }}>{isHindi ? 'Kahani' : 'Kahani'}</span> */}
          {/* <span style={styles.bottomBorder}></span> */}
          {/* </p> */}
          {/* <p style={styles.tellMobile}>Tell your story,inspire,and build your brand.</p> */}
          <div style={{ position: "relative" }}>
            <img
              width={240}
              src='https://cdn.workmob.com/stories_workmob/web_home/hastagmerikahani.png'
              alt='logo'
            />
            <span style={styles.bottomBorderMobile}></span>
          </div>
          <p style={styles.buildMobile}>Tell your story, inspire, and build your brand.</p>
          <p style={styles.HomePageFooterTitleBoxMobile}>
            {isHindi
              ? ' Get your own single branding page and QR code to help showcase your brand with the power of video. Help people  get to know your life experiences, career journey, and the real story behind your products and services.'
              : ' Get your own single branding page and QR code to help showcase your brand with the power of video. Help people  get to know your life experiences, career journey, and the real story behind your products and services.'}
          </p>
          <p style={styles.buildMobile}>Build trust and love for your brand.</p>
          <p style={styles.joinMobile}>Join India's own professional community.</p>
          <div style={styles.shareStoryBtn}>
            <a
              style={styles.shareStoryLink}
              target='_blank'
              href={
                `https://wa.me/919001985566?text=` + 'I want to join your movement.'
              }
              className='btn font-weight-bold btn-lg mx-auto px-3 brandingPageEffect'
            >
              <div style={styles.contactContainer}>
                <img height={18} src={whatsapp_icon} />
                <h3 style={styles.contactUsMobile}>Contact Us</h3>
              </div>
            </a>
          </div>
        </div>
        <div className='commonFooter' style={styles.footerContainerMobile} >
          <h3 className='hpSimplified' style={styles.bottomParaMobile}>
            Aapki Digital Pehchan
          </h3>
          <img
            src="https://cdn.workmob.com/stories_workmob/web_home/made-with-love-in-bharat-new.png"
            alt='Made with love in bharat'
            width={width < 821 && width > 767 ? '154' : '135'}
            height={width < 821 && width > 767 ? '25' : '19'}
            className={width < 768 ? 'mb-0' : 'mb-0'}
          />
          {/* <p style={styles.banaoApniPehchanMobile}>
            <span>MADE WITH&nbsp;</span>
            <img
              src='https://cdn.workmob.com/intro_workmob/images/common/heart.svg'
              alt='heart'
              width='12'
              height='12'
            />
            <span>&nbsp;IN भारत</span>
          </p> */}
          <h3 className='hpSimplified' style={styles.bottomParaMobile}>
            We can. Bharat can.
          </h3>
        </div>
      </>
    );
  }
};

export default MeriKhaniPromotion;

const styles = {
  join: {
    color: 'white',
    fontSize: '2.6em',
    fontWeight: '400',
    margin: '0px auto 10px',
    fontFamily: 'Alata',
  },
  joinMobile: {
    color: 'white',
    fontSize: '1.3em',
    fontWeight: '400',
    margin: '0px auto 10px',
    lineHeight: 'normal',
    fontFamily: 'Alata',
  },
  tell: {
    color: '#FDCB5C',
    fontSize: '2.8em',
    fontWeight: 'bold',
    margin: '20px auto 15px',
    fontFamily: 'Montserrat, sans-serif',
  },
  tellMobile: {
    color: '#FDCB5C',
    fontSize: '1.6em',
    fontWeight: 'bold',
    margin: '20px auto 15px',
    fontFamily: 'Montserrat, sans-serif',
    lineHeight: 'normal',
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
    padding: '14px 28px'
  },
  contactContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  contactUs: {
    marginBottom: '0',
    fontSize: '20px',
    fontWeight: '600',
    fontFamily: 'Montserrat, sans-serif',
  },
  contactUsMobile: {
    marginBottom: '0',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: 'Montserrat, sans-serif',
  },
  build: {
    color: '#FDCB5C',
    fontSize: '2.8em',
    fontWeight: 'bold',
    margin: '18px auto 0px 0px',
    fontFamily: 'Montserrat, sans-serif',
    lineHeight: 'auto',
  },
  buildMobile: {
    color: '#FDCB5C',
    fontSize: '1.4em',
    fontWeight: 'bold',
    margin: '8px auto 0px',
    fontFamily: 'Montserrat, sans-serif',
    lineHeight: 'auto',
    lineHeight: 'normal',
  },
  middleContent: {
    textAlign: 'center',
    maxWidth: '1280px',
    margin: '52px auto',
    padding: '0 1em',
  },
  middleContentMobile: {
    textAlign: 'center',
    maxWidth: '1280px',
    margin: '36px auto',
    padding: '0 1em',
  },
  HomePageFooterTitleBox: {
    fontSize: '2.2em',
    fontWeight: '400',
    border: '5px solid #b6b3b4',
    padding: '0.7em 1em',
    color: 'white',
    filter: 'drop-shadow(black 0.05em 0.1em 0.05em)',
    backgroundColor: 'black',
    marginTop: '1.5rem',
    fontFamily: 'Alata',
  },
  HomePageFooterTitleBoxMobile: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    border: '5px solid #b6b3b4',
    padding: '0.5em',
    color: 'white',
    filter: 'drop-shadow(black 0.05em 0.1em 0.05em)',
    backgroundColor: 'black',
    lineHeight: 'normal',
    marginTop: '0.5rem',
    fontFamily: 'Alata',
  },
  bottomBorder: {
    width: '6%',
    maxWidth: '50px',
    height: 'max-content',
    borderBottom: '4px solid rgb(253, 203, 92)',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '2px',
    left: '0',
    margin: 'auto auto 0',
  },
  bottomBorderMobile: {
    width: '12%',
    maxWidth: '50px',
    height: 'max-content',
    borderBottom: '4px solid rgb(253, 203, 92)',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '2px',
    left: '0',
    margin: 'auto auto 0',
  },
  footerContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Montserrat, sans-serif',
    position: 'absolute',
    bottom: '-51px',
    padding: '0 2em'
  },
  footerContainerMobile: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: 'Montserrat, sans-serif',
    position: 'absolute',
    bottom: '0'
  },
  banaoApniPehchan: {
    fontSize: '13px',
    fontWeight: 600,
    margin: '0 0 0.2em',
    color: 'rgba(254, 187, 4, 1)',
    fontFamily: 'Montserrat',
    textTransform: 'uppercase',
  },
  banaoApniPehchanMobile: {
    fontSize: '11px',
    fontWeight: 600,
    margin: '0 0 0.2em',
    color: 'rgba(254, 187, 4, 1)',
    fontFamily: 'Montserrat',
    textTransform: 'uppercase',
  },
  bottomPara: {
    color: 'white',
    fontWeight: '400',
    fontSize: '26px',
  },
  bottomParaMobile: {
    color: 'white',
    fontWeight: '400',
    fontSize: '20px'
  },
  HomePageFooterMeriKahani: {
    font: '3.5em Alata, sans-serif',
    position: 'relative',
    marginBottom: '0',
  },

  HomePageFooterMeriKahaniHindi: {
    font: 'bold 3.5em Montserrat, sans-serif',
    position: 'relative',
  },
  promoBanner: {
    // minHeight: '100vh',
    backgroundSize: 'contain',
    backgroundRepeat: 'repeat',
    backgroundAttachment: 'scroll',
  },
  btn: {
    color: WHITE,
    backgroundColor: ORANGE,
    borderRadius: '50%',
    width: 24,
    height: 24,
    margin: '0 auto',
  },
  overlay: {
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  text1: {
    fontSize: '3.8vw',
    color: ORANGE_1,
    fontFamily: 'Alata',
  },
  text2: {
    fontSize: '3.8vw',
    color: WHITE,
    fontFamily: 'Alata',
  },
  text3: {
    fontSize: '3.8vw',
    color: GREEN,
    fontFamily: 'Alata',
  },
  info: {
    color: WHITE,
    lineHeight: '1.4em',
    fontFamily: 'Alata',
    fontSize: '1.6vw',
    marginBottom: 0,
  },
  info4: {
    color: '#CECECE',
    lineHeight: '1.4em',
    fontFamily: 'Alata',
    fontSize: '1.6vw',
    marginBottom: 0,
  },
  info2: {
    color: '#CECECE',
    lineHeight: '1.4em',
    fontFamily: 'Alata',
    fontSize: '1.4vw',
    marginBottom: 8,
  },
  info3: {
    color: '#CECECE',
    lineHeight: '1.3em',
    fontFamily: 'Alata',
    fontSize: '1vw',
    flex: 1,
  },
  logo_container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px',
  }
};

const DesktopContent = ({ contactUsClick, showButton }) => (
  <div
    style={Object.assign({}, styles.promoBanner, { height: showButton ? 'auto' : '100vh' })}
    className='jumbotron bg-trabsparent m-0 py-0 px-2 promotion-background position-relative'
  >
    <div style={styles.overlay} className='position-absolute h-100 w-100'></div>
    <div className='w-100 d-flex align-items-md-center align-items-start d-none d-md-block'>
      <div className='container-fluid px-0 py-3'>
        <div className='row'>
          <div className='col-md-4 col-lg-3 col-xl-3 col-12'>&nbsp;</div>
          <div className='col-md-8 col-lg-9 col-xl-8 col-sm-12 text-center specialcolumn'>
            <div className='d-flex justify-content-between flex-row w-100 align-items-center'>
              <div
                className='d-flex  align-items-center ml-md-4 trophyImg'
                style={{ width: '15%' }}
              >
                <img
                  width='100%'
                  className='animate__animated animate__fadeInLeft'
                  src='https://cdn.workmob.com/stories_workmob/images/common/trophy.png'
                  alt='trouphy'
                />
              </div>
              <p className='m-0 meri-khani desktop mb-4 w-100'>
                <PromoTitle />
              </p>
              <div
                style={{ width: '20%' }}
                className='d-flex flex-column align-items-center powerImg'
              >
                <img
                  width='100%'
                  className='animate__animated animate__fadeInRight'
                  src='https://cdn.workmob.com/stories_workmob/images/common/PoweredbyImg.png'
                  alt='arcgate'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          {/* <div className="col-md-4 col-lg-3 col-xl-3 col-12">
              <MeriKahaniUploadBox />
            </div> */}
          <div className='col-md-8 col-lg-9 col-xl-8 col-sm-12 text-center specialcolumn'>
            <div className='d-flex justify-content-center flex-column mt-3'>
              <div className='title-box w-100 mt-0'>
                <p className='montserrat-regular font-40 font-weight-bold m-0'>
                  An initiative to empower <span>professionals</span>, small business owners,
                  entrepreneurs and social workers to share their inspiring stories. Your story has
                  the potential to give <span>hope</span>, to inspire and to help{' '}
                  <span>change lives</span>.
                </p>
              </div>

              <PromoSubTitle />

              <div
                className={`my-3 mt-4 d-flex justify-content-between flex-column align-items-start  flex-md-row w-100`}
              >
                <div style={{ flex: 1 }} className='pt-2'>
                  <ListOptionFirst />
                </div>

                <div style={{ flex: 1 }} className='pt-2'>
                  <ListOptionSecond />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PromoTitle = () => (
  <>
    <span style={styles.text1}>#</span>
    <span style={styles.text2}>Meri</span>
    <span style={styles.text3}>Kahani</span>
    <span className='inspire-title text-center position-relative pt-md-3 pt-4 d-block'>
      <span className='white montserrat-regular d-block mt-md-3  mt-1'>Lets Inspire Together</span>
      <span className='orange montserrat-regular'>We can. India can.</span>
    </span>
  </>
);

const PromoSubTitle = () => (
  <>
    <p className='px-1 f16 mb-3 px-0 mx-0' style={styles.info2}>
      Panel of jury members will pick 50 winners.
    </p>
  </>
);

const ListOptionFirst = () => (
  <>
    <p className='d-flex px-1 px-sm-4 f16 text-left' style={styles.info2}>
      {' '}
      <span className='pr-2'>•</span> Grand award ceremony on December 25, 2021. Event will be
      streamed live on social media and on Workmob.
    </p>
    <p className='d-flex px-1 px-sm-4 f16 text-left' style={styles.info2}>
      {' '}
      <span className='pr-2'>•</span> Winners will receive the award trophy.{' '}
    </p>
    <p className='d-flex px-1 px-sm-4 f16 text-left' style={styles.info2}>
      {' '}
      <span className='pr-2'>•</span> Winners will receive a &#8377; 25,000 sponsorship award
      towards any product that would help with professional growth.{' '}
    </p>
  </>
);
const ListOptionSecond = () => (
  <>
    <p className='d-flex px-1 px-sm-4 f16 text-left' style={styles.info2}>
      {' '}
      <span className='pr-2'>•</span> Winners will be interviewed on radio.{' '}
    </p>
    <p className='d-flex px-1 px-sm-4 f16 text-left' style={styles.info2}>
      {' '}
      <span className='pr-2'>•</span> All participants will receive an appreciation plaque.{' '}
    </p>
    <p className='d-flex px-1 px-sm-4 f16 text-left' style={styles.info2}>
      {' '}
      <span className='pr-2'>•</span> Event will be covered in local Hindi newspaper.{' '}
    </p>
    <p className='d-flex px-1 px-sm-4 f16 text-left' style={styles.info2}>
      {' '}
      <span className='pr-2'>•</span> Last submission date December 15, 2021{' '}
    </p>
  </>
);
