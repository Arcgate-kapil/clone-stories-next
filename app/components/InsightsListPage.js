'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, usePathname, useSearchParams, useRouter } from 'next/navigation';
import CardInsight from '../components/common/CardInsight';
import ListTitle from '../components/common/ListTitle';
// import InsightDetailPage from './InsightDetailPage';
import { INSIGHT_LIST, HOST } from '../constants/localString';
import { SCREEN_NAME } from '../constants/firebaseString';
import { trackScreen } from '../firebase/firebase';
import { fetchInsightListing, setHindiView } from '../lib/features/blogSlice';
import ErrorBoundary from '../components/ErrorBoundry';
import CustomStyle from '../components/common/CustomStyle';
import StoryDetailPageFooterNew from '../components/StoryDetail/StoryDetailPageFooterNew';
import Link from 'next/link';
import { getCookie } from '../utils';
import ReactHlsPlayer from './HSL/components/react-hls-player';
import StoriesOverlayCat from './Stories/StoriesOverlayCat';

const InsightsListPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const id = params?.id;
  const insightListing = useSelector((state) => state.blog.insightListing);
  const state = useSelector((state) => state.blog);
  const pathname = usePathname();
  const [navType, setNavType] = useState('fixedNav');
  const [userInfo, setUserInfo] = useState(null);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search');
  const router = useRouter();
  const [searchCategory, setSearchCategory] = useState('');
  const [overlayCat, setoverlayCat] = useState(false);
  const [openLayout, setOpenLayout] = useState(false);
  const homePageBackground = useRef();

  React.useEffect(() => {
    trackScreen(SCREEN_NAME.insightList);
    dispatch(fetchInsightListing());
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(setHindiView(false));
  }, [pathname]);

  React.useEffect(() => {
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

  React.useEffect(() => {
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

  useEffect(() => {
    // Update title
    document.title = INSIGHT_LIST.title;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', INSIGHT_LIST.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = INSIGHT_LIST.description;
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
    updateOrCreateMeta('og:title', INSIGHT_LIST.title);
    updateOrCreateMeta('og:description', INSIGHT_LIST.description);
    updateOrCreateMeta('og:url', HOST + pathname);
    updateOrCreateMeta('og:image', INSIGHT_LIST.ogImage);
    updateOrCreateMeta('og:site_name', INSIGHT_LIST.siteName);
    // Update Twitter tags
    updateOrCreateMeta('twitter:title', INSIGHT_LIST.title);
    updateOrCreateMeta('twitter:description', INSIGHT_LIST.description);
    updateOrCreateMeta('twitter:image', INSIGHT_LIST.ogImage);
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

  const handleBackClick = (e) => {
    e.preventDefault();
    router.push(state.isHindi ? '/hindi' : '/');
    // router.back()
  }

  const handleOverLay = () => {
    setoverlayCat(false);
    setOpenLayout(true);
  }

  const handleStoreSession = () => {
    sessionStorage.setItem('cacheData', pathname);
  };

  // Note: 'width' is not defined in the original code; assuming it's window.innerWidth
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;

  // if (insightListing && insightListing.filter((e) => e.slug === id).length) {
  //   const storyDetail = insightListing.filter((e) => e.slug === id)[0];
  //   let watchMoreStories = [];
  //   const _watchMoreArr = insightListing;
  //   const _index = _watchMoreArr.findIndex((o) => o.slug === id);
  //   if (_index > -1) {
  //     const count = storyDetail.category === 'stories' ? (width < 768 ? 3 : 4) : 3;
  //     watchMoreStories = _watchMoreArr.slice().slice(_index + 1, _index + count);
  //   }
  //   return <InsightDetailPage storyDetail={storyDetail} watchMoreStories={watchMoreStories} />;
  // }

  if (!insightListing || !insightListing.length) {
    return null;
  }

  const groupByinsightSlug = (type = 'storySlug') => {
    const result = insightListing.reduce(function (r, a) {
      r[a[type]] = r[a[type]] || [];
      r[a[type]].push(a);
      return r;
    }, Object.create(null));
    return result;
  };

  const renderInsightList = () => {
    const insightArr = id
      ? insightListing.filter((o) => o.storySlug.toLowerCase().replace(/ /g, '-') === id)
      : groupByinsightSlug();

    if (id) {
      return (
        <div className='col-sm-12'>
          <ListTitle title={id === 'personalbranding' ? 'Personal Branding' : id} />
          <div className='row'>
            {insightArr.map((insight, index) => (
              <CardInsight screenName={SCREEN_NAME.insightList} insight={insight} key={index} />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className='col-sm-12'>
          <h1 className='InsightsListPage-headingContainer'>
            <span className='InsightsListPage-heading'>
              Insights & articles on personal, professional and business digital branding
            </span>
          </h1>
          {Object.keys(insightArr).map(function (key, index) {
            return (
              <div key={index}>
                <ListTitle
                  title={key === 'personalbranding' ? 'Personal Branding' : key}
                  link={`insights/${key.toLowerCase().replace(/ /g, '-')}`}
                />
                <div className='row'>
                  {insightArr[key]
                    .slice()
                    .splice(0, 2)
                    .map((insight, index) => (
                      <CardInsight
                        screenName={SCREEN_NAME.insightList}
                        insight={insight}
                        key={index}
                      />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

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
        href={'/voices'}
        onClick={handleStoreSession}
      >
        <i
          className='icon-icon-search-new searchEffect'
          style={styles.headerIcon}
        ></i>
      </Link>
    </>
  );

  const ShareStoryButton = ({ classes, shareYourStoryClick }) => {
    return (
      <Link
        onClick={shareYourStoryClick}
        href={{
          pathname: '/merikahani',
          state: true,
        }}
        style={styles.btn}
        className={`btn font-weight-bold montserrat-regular eaderShareButton ${classes}`}
      >
        Share your story
      </Link>
    );
  };

  return (
    <>
      <CustomStyle>{stylesCommon}</CustomStyle>
      <div className="waveBtn animate__animated animate__jello" style={{ pointerEvents: 'none' }}>
        <i
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => handleBackClick(e)}
          className={`btnClose icon icon-cancel d-flex align-items-center justify-content-center rounded-circle font-weight-bold`}
        />
        <div
          onClick={(e) => handleBackClick(e)}
          className="closeBtnWave d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgb(223, 98, 92)', cursor: 'pointer', pointerEvents: 'auto' }}
        >
          &nbsp;
        </div>
      </div>
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
            <ShareStoryButton userInfo={userInfo} />
          </div>
        </nav>
        <nav
          className='d-flex d-md-none'
          style={state?.isFlagBtn ? { ...styles.headerMobileNew, width: '100%' } : { ...styles.headerMobile, width: '100%' }}
        >
          <div className='headerNavButtons mr-3' style={styles.navButtons}>
            <ShareStoryButton userInfo={userInfo} />
            <div
              className='categoryEffect'
              style={styles.headerIcon}
            // onClick={() => setoverlayCat(true)}
            >
              <img src="https://cdn.workmob.com/stories_workmob/web_home/horizontal-lines.svg" style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
          <div className='justify-content-end headerNavButtons ml-3' style={styles.navButtons}>
            {headerIconsElem}
          </div>
        </nav>
      </div>
      <ReactHlsPlayer
        playerRef={homePageBackground}
        className={`homePageMainBackground`}
        url='https://cdn.workmob.com/stories_workmob/web_home/earth_bg/earth_bg.m3u8'
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
      <div style={{ zIndex: 7 }} className='container mt-3 mt-md-5 pt-md-5 position-relative'>
        <div className='row'>{renderInsightList()}</div>
      </div>
      <ErrorBoundary>
        <StoryDetailPageFooterNew changeText={true} homepage={true} />
      </ErrorBoundary>
      <div style={{ width: 0, height: 0, fontSize: 0, opacity: 0, pointerEvents: 'none' }}>
        <h1 style={{ width: 0, height: 0, fontSize: 0 }}>{INSIGHT_LIST.title}</h1>
        <h2 style={{ width: 0, height: 0, fontSize: 0 }}>{INSIGHT_LIST.description}</h2>
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
    </>
  );
};

export default InsightsListPage;

const stylesCommon = `
  .InsightsListPage-headingContainer {
    font: 3.5em "Montserrat", sans-serif;
    margin-bottom: 1em;
    text-align: center;
    position: relative;
    padding-bottom: 0.35em;
  }

  .InsightsListPage-headingContainer::after {
    content: '';
    width: 50px;
    height: 6px;
    background: #f96332;
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    margin: 0 auto;
  }
  
  .InsightsListPage-heading {
    color: #e7c822;
  }

  @media(max-width: 500px) {
    .InsightsListPage-headingContainer {
      font-size: 1.5em;
    }

    .InsightsListPage-headingContainer::after {
      width: 30px;
      height: 3px;
    }
  }
  @media (max-width: 767px) {
    .siteHeader {
        position: sticky !important;
        position: -webkit-sticky !important;
    }
        .headerNavButtons {
        font-size: 15.5px;
    }
    .headerShareButton {
        font-size: 10px;
        padding: 4px 7px !important;
    }
    .categoryEffect {
        padding: 0.4em 0.4em 0.4em 0.3em !important;
    }
    .headerNavButtons {
        font-size: 15.5px;
        margin-right: 36px;
    }
    .hindi-button {
        width: 27px !important;
        height: 27px !important;
    }
}
.homePageMainBackgroundImage{
  position: fixed;
  min-height: 100%;
  min-width: 100%;
  z-index:1;
  top: 0;
  width: 200px;
  object-fit: cover;
}
.homePageMainBackground{
  position: fixed;
  min-height: 100%;
  min-width: 100%;
  object-fit: cover;
  z-index:1;
  top: 0;
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
