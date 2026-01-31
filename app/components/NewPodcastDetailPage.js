'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, usePathname, useRouter } from 'next/navigation';
import PodcastDetailPageBanner from '../components/PodcastDetail/PodcastDetailPageBanner';
import PodcastDetailPageContent from '../components/PodcastDetail/PodcastDetailPageContent';
import PodcastDetailPageWatchMore from '../components/PodcastDetail/PodcastDetailPageWatchMore';
import ErrorBoundary from '../components/ErrorBoundry';
import { fetchStoryDetail, setHindiView } from '../lib/features/blogSlice';
import { PHStoryLoader } from './common/PlaceHolder';
import { useDispatch, useSelector } from 'react-redux';
import { customEvent, trackScreen } from '../firebase/firebase';
import { getCookie } from '../utils';
import { SCREEN_NAME, EVENT_TYPE } from '../constants/firebaseString';
import Link from 'next/link';
import StoryDetailPageFooterNew from '../components/StoryDetail/StoryDetailPageFooterNew';
import StoriesOverlayCat from './Stories/StoriesOverlayCat';

const NewPodcastDetailPage = props => {
  const dispatch = useDispatch();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navType, setNavType] = useState('fixedNav');
  const [userInfo, setUserInfo] = useState(null);
  const searchTerm = searchParams.get('search');
  const router = useRouter();
  const [searchCategory, setSearchCategory] = useState('');
  const [overlayCat, setoverlayCat] = useState(false);
  const [openLayout, setOpenLayout] = useState(false);

  const toggleLanguage = (e) => {
    e.preventDefault();
    const newPath = !state.isHindi ? `/hindi${pathname}` : `/${pathname}`;
    window.history.replaceState(null, "", newPath);
    dispatch(setHindiView(!state.isHindi));
  };

  useEffect(() => {
    dispatch(fetchStoryDetail(params.id, 'audio-story'));
  }, []);

  const state = useSelector((state) => state.blog);
  let storyDetail = props.storyDetail;
  let watchMoreStories = [];

  useEffect(() => {
    const filteredList = state.podcastListing.filter(e => e.storySlug != params.id);
    const _index = filteredList.findIndex(o => o.slug == params.id);
    if (_index > -1) {
      const count = [storyDetail.category] == 'podcasts' ? (width < 768 ? 3 : 4) : 3;
      watchMoreStories = filteredList.slice().slice(_index + 1, _index + count);
    }
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

  React.useEffect(() => {
    trackScreen(SCREEN_NAME.podcastDetail);
  }, []);

  const prevPath = React.useRef(state.blogDetail);
  React.useEffect(() => {
    if (prevPath != location) {
      window.scrollTo(0, 0);
    }
    if (!!state.blogDetail) {
      articleViewEvent(state.blogDetail);
    }
  }, [state.blogDetail]);

  const articleViewEvent = storyDetail => {
    let searchItem = location.search.split('=')
    customEvent(EVENT_TYPE.articleView, {
      slug: storyDetail.slug,
      category: storyDetail.category,
      heading: storyDetail.storyHeading,
      type: storyDetail.storyType,
      src: location.search ? searchItem[1] : 'blog'
    });
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    router.replace(state.isHindi ? '/hindi/podcasts' : '/podcasts');
    // router.back()
  }

  const handleOverLay = () => {
    setoverlayCat(false);
    setOpenLayout(true);
  }

  return (
    <>
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
      {
        state.blogLoading ? <PHStoryLoader /> :
          <>
            <PodcastDetailPageBanner storyDetail={storyDetail} />
            <PodcastDetailPageContent storyDetail={storyDetail} />
            {!!watchMoreStories.length && (
              <div className='container'>
                <PodcastDetailPageWatchMore watchMoreStories={watchMoreStories} />
              </div>
            )}
            <ErrorBoundary>
              <StoryDetailPageFooterNew />
            </ErrorBoundary>
          </>
      }
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

export default NewPodcastDetailPage;

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