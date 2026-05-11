'use client';

import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useSearchParams } from 'next/navigation';
import { fetchBlogs, setHindiView, fetchInsightListing } from '../lib/features/blogSlice';
import { HOST, HOME_PAGE } from '../constants/localString';
import { getCookie } from '../utils';
import ErrorBoundary from '../components/ErrorBoundry';
import CustomStyle from '../components/common/CustomStyle';
import useIntersection from '../components/common/UseIntersection';

const runWhenIdle = (callback) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout: 2000 });
  }

  return window.setTimeout(callback, 1);
};

const cancelIdleTask = (taskId) => {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(taskId);
    return;
  }

  window.clearTimeout(taskId);
};

// ============================================================
// ✅ DYNAMIC IMPORTS — Heavy components lazy load honge
// ============================================================

// HLS Player — sabse bada culprit, async load
const ReactHlsPlayer = dynamic(
  () => import('./HSL/components/react-hls-player'),
  {
    ssr: false,
    loading: () => (
      <img
        className="homePageMainBackground"
        src="https://cdn.workmob.com/stories_workmob/web_home/earth_bg.webp"
        alt="Earth Background"
        style={{
          position: 'fixed',
          minHeight: '100%',
          minWidth: '100%',
          objectFit: 'cover',
          zIndex: 1,
          top: 0,
        }}
      />
    ),
  }
);

// HomePagePromotion — scroll pe load hoga (2MB HLS segments bachenge)
const HomePagePromotion = dynamic(
  () => import('../components/HomePage/HomePagePromotion'),
  { ssr: false }
);

// StoriesOverlayCat — sirf jab open ho tab load hoga
const StoriesOverlayCat = dynamic(
  () => import('./Stories/StoriesOverlayCat'),
  { ssr: false }
);

// HomePageBannerNew — SSR safe hai
import HomePageBannerNew from '../components/HomePage/HomePageBannerNew';
import Image from 'next/image';

// HomePageInspiringNew — dynamic import
const HomePageInspiringNew = dynamic(
  () => import('../components/HomePage/HomePageInspiringNew'),
  { ssr: false }
);

// StoryDetailPageFooterNew — dynamic import
const StoryDetailPageFooterNew = dynamic(
  () => import('../components/StoryDetail/StoryDetailPageFooterNew'),
  { ssr: false }
);

// ============================================================
// ✅ SUB-COMPONENTS — Component ke bahar define karo
//    memo() — sirf props change hone pe re-render
// ============================================================

const ShareStoryButton = memo(({ isHindi, className }) => {
  return (
    <Link
      href={isHindi ? '/hindi/merikahani' : '/merikahani'}
      style={styles.btn}
      className={`btn font-weight-bold ${isHindi ? 'font-khand' : 'montserrat-regular'
        } headerShareButton ${className || ''}`}
    >
      {isHindi ? 'कहानी शेयर करें' : 'Share your story'}
    </Link>
  );
});
ShareStoryButton.displayName = 'ShareStoryButton';

const LangButton = memo(({ isHindi, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className="rounded-circle ml-2 hindi-button languageEffect"
      style={styles.langButton}
      role="button"
      aria-label={isHindi ? 'Switch to English' : 'हिंदी में देखें'}
    >
      {isHindi ? 'Eng' : 'हिंदी'}
    </div>
  );
});
LangButton.displayName = 'LangButton';

const HeaderIcons = memo(({ isHindi, onCategoryClick, onToggleLanguage }) => {
  return (
    <>
      <div
        className="d-none d-md-flex categoryEffect"
        style={styles.headerIcon}
        onClick={onCategoryClick}
        role="button"
        aria-label="Open categories"
      >
        <img
          src="https://cdn.workmob.com/stories_workmob/web_home/horizontal-lines.svg"
          style={{ width: '100%', height: '100%' }}
          alt="categories"
        />
      </div>
      <Link
        className="not-underline"
        href={isHindi ? '/hindi/voices' : '/voices'}
      >
        <i
          className="icon-icon-search-new searchEffect"
          style={styles.headerIcon}
          aria-label="Search"
        ></i>
      </Link>
      <LangButton isHindi={isHindi} onToggle={onToggleLanguage} />
    </>
  );
});
HeaderIcons.displayName = 'HeaderIcons';

// ============================================================
// ✅ MAIN COMPONENT
// ============================================================

const HomePage = ({ initialBlogs = [], initialInsights = [] }) => {
  const homePageBackground = useRef();
  const [navType, setNavType] = useState('fixedNav');
  const [userInfo, setUserInfo] = useState(null);
  const [loadBgVideo, setLoadBgVideo] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');
  const [overlayCat, setOverlayCat] = useState(false);
  const [openLayout, setOpenLayout] = useState(false);

  const backgroundVideo =
    'https://cdn.workmob.com/stories_workmob/web_home/earth_bg/earth_bg.m3u8';

  const dispatch = useDispatch();
  const state = useSelector((state) => state.blog);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { elementRef: promotionRef, isVisible: isPromotionVisible } = useIntersection();

  // ============================================================
  // ✅ REDUX HYDRATE — Server se aaya data Redux mein dalo
  // ============================================================
  useEffect(() => {
    let idleTaskId;

    if (initialBlogs.length > 0) {
      idleTaskId = runWhenIdle(() => {
        dispatch({ type: 'blog/fetchBlogs/fulfilled', payload: initialBlogs });
      });
    } else {
      dispatch(fetchBlogs());
    }

    return () => {
      if (idleTaskId) {
        cancelIdleTask(idleTaskId);
      }
    };
  }, [dispatch, initialBlogs]);

  useEffect(() => {
    let idleTaskId;

    if (initialInsights.length > 0) {
      idleTaskId = runWhenIdle(() => {
        dispatch({ type: 'blog/fetchInsightListing/fulfilled', payload: initialInsights });
      });
    } else {
      dispatch(fetchInsightListing());
    }

    return () => {
      if (idleTaskId) {
        cancelIdleTask(idleTaskId);
      }
    };
  }, [dispatch, initialInsights]);

  // ============================================================
  // ✅ HINDI PATH SYNC
  // ============================================================
  useEffect(() => {
    dispatch(setHindiView(pathname.startsWith('/hindi')));
  }, [pathname]);
  // useEffect(() => {
  //   if (pathname.startsWith('/hindi')) {
  //     dispatch(setHindiView(true));
  //   } else {
  //     dispatch(setHindiView(false));
  //   }
  // }, [pathname]);

  // ============================================================
  // ✅ TITLE UPDATE — Sirf title, meta tags page.js mein hain
  // ============================================================
  useEffect(() => {
    document.title = state.isHindi ? HOME_PAGE.title_hi : HOME_PAGE.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        state.isHindi
          ? HOME_PAGE.description_hi
          : HOME_PAGE.description
      );
    }
  }, [state.isHindi]);

  // ============================================================
  // ✅ BACKGROUND VIDEO — 3 second delay se load karo
  //    Pehle image dikhegi, phir video replace karegi
  // ============================================================
  // useEffect(() => {
  //   const loadVideo = () => {
  //     requestIdleCallback(() => setLoadBgVideo(true));
  //   };

  //   window.addEventListener('scroll', loadVideo, { once: true });
  //   window.addEventListener('click', loadVideo, { once: true });

  //   return () => {
  //     window.removeEventListener('scroll', loadVideo);
  //     window.removeEventListener('click', loadVideo);
  //   };
  // }, []);
  useEffect(() => {
    const timer = setTimeout(() => setLoadBgVideo(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // ============================================================
  // ✅ SINGLE useEffect — Sab mount setup + cleanup ek saath
  // ============================================================
  useEffect(() => {
    // 1. Session cleanup
    sessionStorage.removeItem('cacheData');
    document.body.classList.add('home');

    // 2. Scroll restore
    const storedScrollY = sessionStorage.getItem('homepageScrollY');
    if (storedScrollY) {
      window.scrollTo(0, parseInt(storedScrollY, 10));
      sessionStorage.removeItem('homepageScrollY');
    }

    // 3. User info
    if (getCookie('userInfo')) {
      try {
        setUserInfo(JSON.parse(getCookie('userInfo')));
      } catch (e) {
        console.error('userInfo parse error', e);
      }
    }

    // 4. Search param check
    const searchTerm = searchParams?.get('search');
    if (searchTerm === '?hideBanner=yes') {
      sessionStorage.setItem('hideHeader', true);
    }
    // if (searchTerm === '?hideBanner=yes') {
    //   sessionStorage.setItem('hideHeader', true);
    // }
    // 5. beforeunload handler
    const handleBeforeUnload = () => {
      localStorage.removeItem('searchValue');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 6. Scroll listener — throttled with rAF + passive
    let ticking = false;
    const listenScrollEvent = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const _elem3 = document.getElementById('promoCard');

          if (window.scrollY > 100) {
            setNavType('scrollNav');
            if (_elem3) {
              _elem3.classList.add('fixedToBottom');
              setTimeout(() => {
                _elem3?.classList.remove('fixedToBottom');
                _elem3?.removeAttribute('id');
              }, 5000);
            }
          } else {
            setNavType('fixedNav');
            _elem3?.classList.remove('fixedToBottom');
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', listenScrollEvent, { passive: true });

    // ✅ SINGLE RETURN — sab cleanup ek saath
    return () => {
      document.body.classList.remove('home');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', listenScrollEvent);
      localStorage.removeItem('hideHeader');
    };
  }, []); // Sirf mount/unmount

  // ============================================================
  // ✅ CALLBACKS — useCallback se wrap, re-render pe naya function nahi
  // ============================================================
  const toggleLanguage = useCallback(() => {
    const newPath = !state.isHindi ? '/hindi' : '/';
    window.history.replaceState(null, '', newPath);
    dispatch(setHindiView(!state.isHindi));
  }, [state.isHindi]);
  // const toggleLanguage = useCallback(
  //   (e) => {
  //     e?.preventDefault();
  //     const newPath = !state.isHindi ? '/hindi' : '/';
  //     window.history.replaceState(null, '', newPath);
  //     dispatch(setHindiView(!state.isHindi));
  //   }, [state.isHindi, dispatch]);

  const handleOverLay = useCallback(() => {
    setOverlayCat(false);
    setOpenLayout(true);
    setTimeout(() => setOpenLayout(false), 1000);
  }, []);

  const handleCategoryOpen = useCallback(() => {
    setOverlayCat(true);
  }, []);

  // ============================================================
  // ✅ BREADCRUMB JSON-LD
  // ============================================================
  // const breadcrumbJsonLd = {
  //   '@context': 'https://schema.org',
  //   '@type': 'BreadcrumbList',
  //   itemListElement: [
  //     {
  //       '@type': 'ListItem',
  //       position: 1,
  //       name: 'Home',
  //       item: HOST + pathname,
  //     },
  //   ],
  // };

  // ============================================================
  // ✅ RENDER
  // ============================================================
  return (
    <>
      <CustomStyle>{stylesCss}</CustomStyle>

      {/* JSON-LD SEO */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      /> */}

      <div>
        {/* ==================== HEADER ==================== */}
        <div
          className="siteHeader abarRoLatestSection"
          style={{ ...styles.headerContainer, ...styles[navType] }}
        >
          {/* Desktop Nav */}
          <nav className="d-none d-md-flex" style={styles.headerDesktop}>
            <div className="headerNavButtons" style={styles.navButtons}>
              <HeaderIcons
                isHindi={state.isHindi}
                onCategoryClick={handleCategoryOpen}
                onToggleLanguage={toggleLanguage}
              />
            </div>
            <div
              className="justify-content-end headerNavButtons"
              style={styles.navButtons}
            >
              <ShareStoryButton isHindi={state.isHindi} />
            </div>
          </nav>

          {/* Mobile Nav */}
          <nav
            className="d-flex d-md-none"
            style={
              state?.isFlagBtn
                ? { ...styles.headerMobileNew, width: '100%' }
                : { ...styles.headerMobile, width: '100%' }
            }
          >
            <div className="headerNavButtons mr-3" style={styles.navButtons}>
              <ShareStoryButton isHindi={state.isHindi} />
              <div
                className="categoryEffect"
                style={styles.headerIcon}
                onClick={handleCategoryOpen}
                role="button"
                aria-label="Open categories"
              >
                <img
                  src="https://cdn.workmob.com/stories_workmob/web_home/horizontal-lines.svg"
                  style={{ width: '100%', height: '100%' }}
                  alt="categories"
                />
              </div>
            </div>
            <div
              className="justify-content-end headerNavButtons ml-3"
              style={styles.navButtons}
            >
              <HeaderIcons
                isHindi={state.isHindi}
                onCategoryClick={handleCategoryOpen}
                onToggleLanguage={toggleLanguage}
              />
            </div>
          </nav>
        </div>

        {/* ==================== BACKGROUND VIDEO ==================== */}
        {/* ✅ 3 second baad load hoga — earth_bg1.ts immediately nahi jayega */}
        {loadBgVideo && (
          <ReactHlsPlayer
            playerRef={homePageBackground}
            className="homePageMainBackground"
            url={backgroundVideo}
            controls={false}
            autoPlay={true}
            preload="none"
            muted={true}
            playsInline={true}
            loop={true}
            id="homePageMainBackground"
            onPlay={() => {
              const image = document.getElementsByClassName(
                'homePageMainBackgroundImage'
              )[0];
              if (image) image.classList.add('d-none');
            }}
          />
        )}

        {/* ✅ Image hamesha dikhegi jab tak video load na ho — LCP improve */}
        <img
          className="homePageMainBackgroundImage"
          src="https://cdn.workmob.com/stories_workmob/web_home/earth_bg.webp"
          fetchPriority="high"
          alt="Earth Background"
        />

        {/* ==================== MAIN CONTENT ==================== */}
        <div className="homePageMainDiv">
          <ErrorBoundary>
            <HomePageBannerNew isHindi={state?.isHindi} />
          </ErrorBoundary>

          <ErrorBoundary>
            <HomePageInspiringNew isHindi={state?.isHindi} blogs={state?.blogs} />
          </ErrorBoundary>

          {/* ✅ Promotion sirf visible hone pe load hoga */}
          <div ref={promotionRef}>
            <ErrorBoundary>
              {isPromotionVisible && <HomePagePromotion isHindi={state?.isHindi} />}
            </ErrorBoundary>
          </div>

          <ErrorBoundary>
            <StoryDetailPageFooterNew changeText={true} homepage={true} />
          </ErrorBoundary>
        </div>

        {/* ==================== OVERLAY ==================== */}
        {/* ✅ Dynamic import — sirf jab open ho tab load hoga */}
        {overlayCat && (
          <StoriesOverlayCat
            searchString={searchCategory}
            updateSearchString={(event) =>
              setSearchCategory(event.target.value)
            }
            categoryList={state.categories.slice(1)}
            closeOverlay={handleOverLay}
            {...state}
          />
        )}

        {/* ==================== SKELETON LAYOUT ==================== */}
        {openLayout && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 1920 2711"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 10,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <defs>
              <filter
                id="a"
                x="1592"
                y="28"
                width="64"
                height="64"
                filterUnits="userSpaceOnUse"
              >
                <feOffset dy="3" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="3" result="b" />
                <feFlood floodOpacity="0.161" />
                <feComposite operator="in" in2="b" />
                <feComposite in="SourceGraphic" />
              </filter>
              <filter
                id="c"
                x="723.398"
                y="876"
                width="473"
                height="677"
                filterUnits="userSpaceOnUse"
              >
                <feOffset dy="6" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="6" result="d" />
                <feFlood floodOpacity="0.161" />
                <feComposite operator="in" in2="d" />
                <feComposite in="SourceGraphic" />
              </filter>
              <filter
                id="e"
                x="220.398"
                y="1707"
                width="473"
                height="677"
                filterUnits="userSpaceOnUse"
              >
                <feOffset dy="6" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="6" result="f" />
                <feFlood floodOpacity="0.161" />
                <feComposite operator="in" in2="f" />
                <feComposite in="SourceGraphic" />
              </filter>
              <filter
                id="g"
                x="1226.398"
                y="876"
                width="473"
                height="677"
                filterUnits="userSpaceOnUse"
              >
                <feOffset dy="6" input="SourceAlpha" />
                <feGaussianBlur stdDeviation="6" result="h" />
                <feFlood floodOpacity="0.161" />
                <feComposite operator="in" in2="h" />
                <feComposite in="SourceGraphic" />
              </filter>
              <filter
                id="i"
                x="220.398"
                y="876"
                width="473"
                height="677"
                filterUnits="userSpaceOnUse"
              >
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
              <path
                d="M0,0H1922V860H0Z"
                transform="translate(-1)"
                fill="#191919"
              />
              <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#a)">
                <circle
                  cx="23"
                  cy="23"
                  r="23"
                  transform="translate(1601 34)"
                  fill="#242526"
                />
              </g>
              <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#c)">
                <rect
                  width="437"
                  height="641"
                  rx="15"
                  transform="translate(741.4 888)"
                  fill="#242526"
                />
              </g>
              <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#e)">
                <rect
                  width="437"
                  height="641"
                  rx="15"
                  transform="translate(238.4 1719)"
                  fill="#242526"
                />
              </g>
              <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#g)">
                <rect
                  width="437"
                  height="641"
                  rx="15"
                  transform="translate(1244.4 888)"
                  fill="#242526"
                />
              </g>
              <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#i)">
                <rect
                  width="437"
                  height="641"
                  rx="15"
                  transform="translate(238.4 888)"
                  fill="#242526"
                />
              </g>
              <rect
                width="963"
                height="47"
                rx="23.5"
                transform="translate(425 309)"
                fill="#242526"
              >
                <animate
                  attributeName="fill"
                  begin="0s"
                  dur="2s"
                  values="#191919;#242526;#191919;"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </rect>
              <rect
                width="161"
                height="23"
                rx="11.5"
                transform="translate(280 46)"
                fill="#242526"
              >
                <animate
                  attributeName="width"
                  begin="0.1s"
                  dur="1s"
                  values="161;130;161;"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </rect>
              <rect
                width="901"
                height="23"
                rx="11.5"
                transform="translate(456 485)"
                fill="#242526"
              >
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
        )}
      </div>
    </>
  );
};

export default HomePage;

// ============================================================
// STYLES
// ============================================================

const stylesCss = `
.homePageMainBackgroundImage {
  position: fixed;
  min-height: 100%;
  min-width: 100%;
  z-index: 1;
  top: 0;
  width: 200px;
  object-fit: cover;
  transition: opacity 0.6s ease;
}

.not-underline {
  text-decoration: none !important;
}

.homePageMainDiv {
  margin-top: 4rem;
  position: relative;
  z-index: 1;
}

.homePageMainBackground {
  position: fixed;
  min-height: 100%;
  min-width: 100%;
  object-fit: cover;
  z-index: 1;
  top: 0;
}

@media screen and (max-width: 767px) {
  .homePageMainDiv {
    margin-top: 0rem;
  }
}

.languageEffect {
  margin-left: 0.7rem;
}

.locationEffect,
.categoryEffect,
.searchEffect,
.languageEffect,
.headerShareButton,
.searchEffect {
  transition: transform 0.3s ease-in-out;
}

.locationEffect:hover,
.categoryEffect:hover,
.searchEffect:hover,
.languageEffect:hover,
.searchEffect:hover {
  transform: scale(1.2);
}

.headerShareButton:hover {
  transform: scale(1.1);
}

@media (max-width: 767px) {
  .categoryEffect {
    padding: 0.4em 0.4em 0.4em 0.3em !important;
  }
  .siteHeader {
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
  .headerNavButtons {
    font-size: 15.5px;
  }
}

.not-underline {
  text-decoration: none !important;
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
  transition: transform 0.3s ease-in-out;
  background-color: rgba(0, 0, 0, 0.5);
  background-image: unset;
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
  headerMobile: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerMobileNew: {
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
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.webp)',
    backgroundSize: '99% 100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  langButton: {
    border: 'none',
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.webp)',
    backgroundSize: '99% 100%',
    backgroundColor: '#00000073',
  },
  btn: {
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.webp)',
    backgroundSize: '110%',
    backgroundPosition: 'center',
    color: '#fff',
    borderRadius: '30px',
    boxShadow: '0px 3px 6px #00000029',
    whiteSpace: 'nowrap',
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
};