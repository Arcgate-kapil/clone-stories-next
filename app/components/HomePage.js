'use client';

import React, { useEffect, useRef, useState } from 'react';
import HomePagePromotion from '../components/HomePage/HomePagePromotion';
import HomePageInspiringNew from '../components/HomePage/HomePageInspiringNew';
import { fetchBlogs, setHindiView, fetchInsightListing } from '../lib/features/blogSlice';
import StoryDetailPageFooterNew from '../components/StoryDetail/StoryDetailPageFooterNew';
import { connect } from 'react-redux';
import { HOST, HOME_PAGE } from '../constants/localString';
import { SCREEN_NAME } from '../constants/firebaseString';
import Link from 'next/link';
// import { trackScreen } from '../actions/firebase';
import ErrorBoundary from '../components/ErrorBoundry';
import CustomStyle from '../components/common/CustomStyle';
import ReactHlsPlayer from '../components/HSL/components/react-hls-player';
import VideoPlayer from './VideoPlayer';
import HomePageBannerNew from '../components/HomePage/HomePageBannerNew';
import useIntersection from '../components/common/UseIntersection';
// import { setLayoverPlayButton } from '../actions/blog';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { getCookie } from '../utils';
import StoriesOverlayCat from './Stories/StoriesOverlayCat';
import { Helmet } from 'react-helmet';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const HomePage = props => {
  const homePageBackground = useRef();
  const [navType, setNavType] = useState('fixedNav');
  const [userInfo, setUserInfo] = useState(null);
  const backgroundVideo = 'https://cdn.workmob.com/stories_workmob/web_home/earth_bg/earth_bg.m3u8';
  const dispatch = useDispatch();
  const state = useSelector((state) => state.blog);
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search');
  const [searchCategory, setSearchCategory] = useState('');
  const [overlayCat, setoverlayCat] = useState(false);
  const [openLayout, setOpenLayout] = useState(false);

  const toggleLanguage = (e) => {
    e.preventDefault();
    const newPath = !state.isHindi ? "/hindi" : "/";
    window.history.replaceState(null, "", newPath);
    dispatch(setHindiView(!state.isHindi));
  };

  useEffect(() => {
    const storedScrollY = sessionStorage.getItem('homepageScrollY');
    if (storedScrollY) {
      window.scrollTo(0, parseInt(storedScrollY, 10));
      sessionStorage.removeItem('homepageScrollY');
    }
  }, []);

  useEffect(() => {
    if (pathname.startsWith('/hindi')) {
      dispatch(setHindiView(true));
    } else {
      dispatch(setHindiView(false));
    }
  }, [pathname]);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": HOST + pathname },
    ]
  };

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchInsightListing());
  }, []);

  const { elementRef: promotionRef, isVisible: isPromotionVisible } = useIntersection();
  // if (!props?.blogs?.blogLoading) {
  //   window.location.reload(); 
  //   }

  // useEffect(() => {
  //   props.setLayoverPlayButton(false);
  // },[]);

  useEffect(() => {
    // if ('scrollRestoration' in history) {
    //   history.scrollRestoration = 'manual';
    // }
    sessionStorage.removeItem('cacheData');
    // trackScreen(SCREEN_NAME.homePage);
    document.body.classList.add('home');

    return () => {
      document.body.classList.remove('home');
    };
  }, []);

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
    let _userInfo = null;

    if (!!getCookie('userInfo')) {
      _userInfo = JSON.parse(getCookie('userInfo'));
    }

    setUserInfo(_userInfo);

    if (searchTerm == '?hideBanner=yes') {
      sessionStorage.setItem('hideHeader', true);
    }

    window.addEventListener('scroll', listenScrollEvent);

    return () => {
      window.removeEventListener('scroll', listenScrollEvent);
      localStorage.removeItem('hideHeader');
    };
  }, []);

  const listenScrollEvent = e => {
    const _elem3 = document.getElementById('promoCard');

    if (window.scrollY > 100) {
      setNavType('scrollNav');

      if (!!_elem3) {
        _elem3.classList.add('fixedToBottom');

        setTimeout(() => {
          if (!!_elem3) {
            _elem3.classList.remove('fixedToBottom');
            _elem3.removeAttribute('id');
          }
        }, 5000);
      }
    } else {
      setNavType('fixedNav');
      if (!!_elem3) {
        _elem3.classList.remove('fixedToBottom');
      }
    }
  };

  const langBtnElem = (
    <>
      <div
        onClick={(e) => toggleLanguage(e)}
        className='rounded-circle ml-2 hindi-button languageEffect'
        style={styles.langButton}
        role='button'
      >
        {state.isHindi ? 'Eng' : 'हिंदी'}
      </div>
    </>
  );

  const headerIconsElem = (
    <>
      <div
        className='d-none d-md-flex categoryEffect'
        style={styles.headerIcon}
        onClick={() => setoverlayCat(true)}
      >
        <img src="https://cdn.workmob.com/stories_workmob/web_home/horizontal-lines.svg" style={{ width: '100%', height: '100%' }} />
      </div>
      <Link
        className='not-underline'
        href={state.isHindi ? '/hindi/voices' : '/voices'}
      // onClick={handleIconClick}
      >
        <i
          className='icon-icon-search-new searchEffect'
          style={styles.headerIcon}
        ></i>
      </Link>

      {langBtnElem}

    </>
  );

  const ShareStoryButton = ({ classes, shareYourStoryClick, isHindi }) => {
    return (
      <Link
        onClick={shareYourStoryClick}
        href={{
          pathname: isHindi ? '/hindi/merikahani' : '/merikahani',
          state: true,
        }}
        style={styles.btn}
        className={`btn font-weight-bold ${isHindi ? 'font-khand' : 'montserrat-regular'} headerShareButton ${classes}`}
      >
        {isHindi ? 'कहानी शेयर करें' : 'Share your story'}
      </Link>
    );
  };

  useEffect(() => {
    // Update title
    document.title = state.isHindi ? HOME_PAGE.title_hi : HOME_PAGE.title;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', state.isHindi ? HOME_PAGE.description_hi : HOME_PAGE.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = state.isHindi ? HOME_PAGE.description_hi : HOME_PAGE.description;
      document.head.appendChild(metaDesc);
    }
    // Update Open Graph tags
    const updateOrCreateMeta = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };
    updateOrCreateMeta('og:title', state.isHindi ? HOME_PAGE.title_hi : HOME_PAGE.title);
    updateOrCreateMeta('og:description', state.isHindi ? HOME_PAGE.description_hi : HOME_PAGE.description);
    updateOrCreateMeta('og:url', HOST + pathname);
    updateOrCreateMeta('og:image', HOME_PAGE.ogImage);
    updateOrCreateMeta('og:site_name', HOME_PAGE.siteName);
    // Update Twitter tags
    updateOrCreateMeta('twitter:title', state.isHindi ? HOME_PAGE.title_hi : HOME_PAGE.title);
    updateOrCreateMeta('twitter:description', state.isHindi ? HOME_PAGE.description_hi : HOME_PAGE.description);
    updateOrCreateMeta('twitter:image', HOME_PAGE.ogImage);
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', HOST + pathname);
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = HOST + pathname;
      document.head.appendChild(canonical);
    }
    // Optional: Update robots meta if needed
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      robots.content = 'index, follow';
      document.head.appendChild(robots);
    }
  }, [state.isHindi, pathname]);

  const handleOverLay = () => {
    setoverlayCat(false);
    setOpenLayout(true);
    setTimeout(() => setOpenLayout(false), 1000);
  }

  useEffect(() => {

  },[openLayout]);

  return (
    <>
      <CustomStyle>{stylesCss}</CustomStyle>
      <div>
        <div
          className='siteHeader'
          style={{ ...styles.headerContainer, ...styles[navType] }}
        >
          <nav
            className='d-none d-md-flex'
            style={styles.headerDesktop}
          >
            <div className='headerNavButtons'
              style={styles.navButtons}
            >
              {headerIconsElem}
            </div>
            <div className='justify-content-end headerNavButtons'
              style={styles.navButtons}
            >
              <ShareStoryButton userInfo={userInfo} isHindi={state.isHindi} />
            </div>
          </nav>
          <nav
            className='d-flex d-md-none'
            style={state?.isFlagBtn ? { ...styles.headerMobileNew, width: '100%' } : { ...styles.headerMobile, width: '100%' }}
          >
            <div className='headerNavButtons mr-3' style={styles.navButtons}>
              <ShareStoryButton userInfo={userInfo} isHindi={state.isHindi} />
              <div
                className='categoryEffect'
                style={styles.headerIcon}
                onClick={() => setoverlayCat(true)}
              >
                <img src="https://cdn.workmob.com/stories_workmob/web_home/horizontal-lines.svg" style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
            <div className='justify-content-end headerNavButtons ml-3' style={styles.navButtons}>
              {headerIconsElem}
            </div>
          </nav>
        </div>
        {/* <VideoPlayer ref={homePageBackground} src={backgroundVideo} className="homePageMainBackground" onPlay={() => {
        const image = document.getElementsByClassName('homePageMainBackgroundImage')[0];
        image.classList.add('d-none');
      }} /> */}
        <ReactHlsPlayer
          playerRef={homePageBackground}
          className={`homePageMainBackground`}
          url={backgroundVideo}
          controls={false}
          autoPlay={true}
          preload='auto'
          muted={true}
          playsInline={true}
          loop={true}
          id='homePageMainBackground'
          onPlay={() => {
            const image = document.getElementsByClassName('homePageMainBackgroundImage')[0];
            image.classList.add('d-none');
          }}
        />
        <img
          className='homePageMainBackgroundImage'
          src='https://cdn.workmob.com/stories_workmob/web_home/earth_bg.webp'
          loading="lazy"
          alt="Earth Background"
        />
        <div className='homePageMainDiv'>
          <ErrorBoundary>
            <HomePageBannerNew {...state} />
          </ErrorBoundary>
          <ErrorBoundary>
            <HomePageInspiringNew {...state} />
          </ErrorBoundary>
          <div ref={promotionRef}>
            <ErrorBoundary>
              {isPromotionVisible && <HomePagePromotion {...state} />}
            </ErrorBoundary>
          </div>
          <ErrorBoundary>
            <StoryDetailPageFooterNew changeText={true} homepage={true} />
          </ErrorBoundary>
        </div>
        {overlayCat && <StoriesOverlayCat
          searchString={searchCategory}
          updateSearchString={event => setSearchCategory(event.target.value)}
          categoryList={state.categories.slice(1)}
          // closeOverlay={() => setoverlayCat(false)}
          closeOverlay={handleOverLay}
          {...state}
        />}
        {openLayout &&
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 1920 2711"
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <defs>
              <filter id="a" x="1592" y="28" width="64" height="64" filterUnits="userSpaceOnUse">
                <feOffset dy="3" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="3" result="b" />
                <feFlood floodOpacity="0.161" />
                <feComposite operator="in" in2="b" />
                <feComposite in="SourceGraphic" />
              </filter>
              <filter id="c" x="723.398" y="876" width="473" height="677" filterUnits="userSpaceOnUse">
                <feOffset dy="6" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="6" result="d" />
                <feFlood floodOpacity="0.161" />
                <feComposite operator="in" in2="d" />
                <feComposite in="SourceGraphic" />
              </filter>
              <filter id="e" x="220.398" y="1707" width="473" height="677" filterUnits="userSpaceOnUse">
                <feOffset dy="6" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="6" result="f" />
                <feFlood floodOpacity="0.161" />
                <feComposite operator="in" in2="f" />
                <feComposite in="SourceGraphic" />
              </filter>
              <filter id="g" x="1226.398" y="876" width="473" height="677" filterUnits="userSpaceOnUse">
                <feOffset dy="6" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="6" result="h" />
                <feFlood floodOpacity="0.161" />
                <feComposite operator="in" in2="h" />
                <feComposite in="SourceGraphic" />
              </filter>
              <filter id="i" x="220.398" y="876" width="473" height="677" filterUnits="userSpaceOnUse">
                <feOffset dy="6" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="6" result="j" />
                <feFlood floodOpacity="0.161" />
                <feComposite operator="in" in2="j" />
                <feComposite in="SourceGraphic" />
              </filter>
              <clipPath id="l">
                <rect width="1920" height="2711" />
              </clipPath>
            </defs>
            <g id="k" clipPath="url(#l)">
              <rect width="1920" height="2711" />
              <path d="M0,0H1922V860H0Z" transform="translate(-1)" fill="#191919" />
              <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#a)">
                <circle cx="23" cy="23" r="23" transform="translate(1601 34)" fill="#242526" />
              </g>
              <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#c)">
                <rect width="437" height="641" rx="15" transform="translate(741.4 888)" fill="#242526" />
              </g>
              <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#e)">
                <rect width="437" height="641" rx="15" transform="translate(238.4 1719)" fill="#242526" />
              </g>
              <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#g)">
                <rect width="437" height="641" rx="15" transform="translate(1244.4 888)" fill="#242526" />
              </g>
              <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#i)">
                <rect width="437" height="641" rx="15" transform="translate(238.4 888)" fill="#242526" />
              </g>
              <rect width="963" height="47" rx="23.5" transform="translate(425 309)" fill="#242526">
                <animate
                  attributeName="fill"
                  begin="0s"
                  dur="2s"
                  values="#191919;#242526;#191919;"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </rect>
              <rect width="161" height="23" rx="11.5" transform="translate(280 46)" fill="#242526">
                <animate
                  attributeName="width"
                  begin="0.1s"
                  dur="1s"
                  values="161;130;161;"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </rect>
              <rect width="901" height="23" rx="11.5" transform="translate(456 485)" fill="#242526">
                <animate
                  attributeName="fill"
                  begin="0.1s"
                  dur="2s"
                  values="#191919;#242526;#191919;"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </rect>
            </g>
          </svg>
        }
      </div>
    </>
  );
};

export default HomePage;

const stylesCss = `
.homePageMainBackgroundImage{
  position: fixed;
  min-height: 100%;
  min-width: 100%;
  z-index:1;
  top: 0;
  width: 200px;
  object-fit: cover;
}
.not-underline {
  text-decoration: none !important;
}

.homePageMainDiv{ 
  margin-top:4rem;
  position:relative;
  z-index:1
}
.homePageMainBackground{
  position: fixed;
    min-height: 100%;
    min-width: 100%;
    object-fit: cover;
    z-index:1;
    top: 0;
}

@media screen and (max-width: 767px) {
  .homePageMainDiv{ 
    margin-top:0rem;
  }
}
.languageEffect{
  margin-left:0.7rem
}

.locationEffect, .categoryEffect, .searchEffect, .languageEffect, .headerShareButton,.searchEffect{
  transition: transform 0.3s ease-in-out;
}

.locationEffect:hover, .categoryEffect:hover, .searchEffect:hover, .languageEffect:hover,.searchEffect:hover{
  transform: scale(1.2);
}
.headerShareButton:hover {
  transform: scale(1.1);
}

.home-logo{
  width: 80%
}
.logo-link{
  display: block;
  margin-bottom: auto;
  text-align:center
}
  @media (max-width: 767px) {
    .categoryEffect{
      padding:0.4em 0.4em 0.4em 0.3em !important
    }
    .siteHeader {
      position: sticky !important;
      position: -webkit-sticky !important;
      // background: black !important;
    }
    .detailsiteHeader{
      position: sticky !important;
      position: -webkit-sticky !important;
    }
    .headerShareButton {
      font-size: 10px;
      padding: 4px 7px !important;
    }

    .hindi-button {
      font-size: 9px;
      width: 27px !important;
      height: 27px !important;
    }

    .hindi-buttonNew{
      font-size: 12px;
      width: 35px !important;
      height: 35px !important;
    }

    .headerNavButtons {
      font-size: 15.5px;
    }
  }
  @media (min-width: 2000px) {
.home-logo{ 
   width: 100%
}
  }
  .not-underline {
    text-decoration: none !important;
  }
  .custom-px {
    padding: 3px 113px 4px 42px;
  }
  @media (min-width: 500px) and (max-width: 767px) {
    .custom-px { 
      padding: 3px 48px 4px 14px;
    }
  }

  @media (max-width: 500px) {
    .custom-px img { 
      width: 145px;
    }
    .custom-px  { 
      padding: 3px 50px 4px 13px;
    }
  }
  .new-hindi-button {
    width: 34px;
    height: 34px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background-color: rgba(0, 0, 0, 0.4);
    color: #fff;
    font-size: 12px;
    outline: none !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ffffff4d;
    transition: transform .3s ease-in-out;
  }
  .three-btn-dot {
    width: 38px;
    height: 38px;
    color: #fff;
    font-size: 12px;
    outline: none !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    transition: transform .3s ease-in-out;
    background-color: rgba(0, 0, 0, 0.5);
  }
.hindi-button {
   width: 38px;
    height: 38px;
    color: #fff;
    font-size: 12px;
    outline: none !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    transition: transform .3s ease-in-out;
    background-color: rgba(0, 0, 0, 0.5);
    background-image: unset;
}
 
  .three-btn-dot::after {
    display: none;
  }
  .dropdown-menu {
    position: absolute;
    willChange: transform;
    top: 7px;
    left: 0px;
    transform: translate3d(0px, 37px, 0px);
    box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.5);
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    padding-left: 9px;
    padding-right: 9px;
    padding: .1rem 9px !important;
  }
  .dropdown-menu .dropdown-item {
    color: rgba(196, 80, 54, 1);
    padding-left: 5px;
    padding-right: 5px;
    font-weight: 500;
    font-family: 'Alata';
  }
  .dropdown-menu .dropdown-item:nth-child(2) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.5) !important;
  }
  .dropdown-menu .dropdown-item:hover {
    background-color: unset;
    color: rgba(196, 80, 54, 1);
  }
  .dropdown-menu .dropdown-item:focus {
    background-color: unset;
    color: rgba(196, 80, 54, 1);
  }
  .dropdown-menu .arrow-box {
    position: relative;
  }
  .dropdown-menu .arrow-box::before {
    content: ""; 
    position: absolute;
    top: -21px; 
    left: 9%; 
    transform: translateX(-35%); 
    border-width: 10px; 
    border-style: solid;
    border-color: transparent transparent rgba(0, 0, 0, 0.4) transparent; 
    z-index: 1001;
}
@media screen and (max-width: 766px) {
  .three-btn-dot {
    width: 35px !important;
    height: 35px !important;
  }
  .dropdown-menu {
    top: 7px !important;
  }
}
`;

const styles = {
  headerContainer: {
    fontSize: '20px',
    padding: '0.375em',
    position: 'fixed',
    zIndex: '8',
    top: '0',
    left: '0',
    right: '0',
  },
  headerDesktop: {
    width: '72%',
    margin: '0 auto',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerDesktopNew: {
    width: '83%',
    margin: '0 auto',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerDesktopNewNew: {
    width: '83%',
    margin: '0 auto',
    // justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerMobile: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerMobileNew: {
    // justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  navButtons: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
  },
  headerIcon: {
    cursor: 'pointer',
    fill: '#d1d1d1',
    color: '#d1d1d1',
    width: '1.6em',
    height: '1.6em',
    padding: '0.4em',
    borderRadius: '50%',
    marginLeft: '0.5em',
    backgroundImage:
      ' url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    backgroundSize: '99% 100%',
    // backgroundColor: '#00000073',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: '1.15em',
    color: '#d1d1d1',
    width: '1.4em',
    height: '1.4em',
    borderRadius: '50%',
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    backgroundSize: '99% 100%',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  langButton: {
    border: 'none',
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    backgroundSize: '99% 100%',
    backgroundColor: '#00000073',
  },
  langButtonNew: {
    // border: '1px solid #ffffff4d',
  },
  logoLinkMobile: {
    minWidth: '77px',
    maxWidth: '125px',
    marginTop: '-0.15em',
    alignSelf: 'center',
  },
  btn: {
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    // backgroundColor: '#00000073',
    backgroundSize: '110%',
    backgroundPosition: 'center',
    color: '#fff',
    borderRadius: '30px',
    boxShadow: '0px 3px 6px #00000029',
    whiteSpace: 'nowrap',
  },
  dropDownList: {
    width: 380,
    maxWidth: '100%',
  },
  fixedNav: {
    zIndex: 8,
    transition: 'all 0.3s ease-in-out',
    backgroundColor: 'transparent',
  },
  scrollNav: {
    zIndex: 8,
    backgroundColor: '#000',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0px 3px 6px rgba(255,255,255,0.2)',
  },
  showMenu: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: ' 100%',
    left: 0,
    top: 0,
    paddingTop: 0,
    height: '100vh',
  },
};