'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, usePathname, useSearchParams, useRouter } from 'next/navigation';
import StoriesPageBanner from './Stories/StoriesPageBanner';
import ReactHlsPlayer from './HSL/components/react-hls-player';
import StoriesPageCategories from './Stories/StoriesPageCategories';
import CardInspiring from './common/CardInspiring';
import ErrorBoundary from './ErrorBoundry';
import { HOST, VOICE_LIST_PAGE } from '../constants/localString';
import { SCREEN_NAME } from '../constants/firebaseString';
import { trackScreen } from '../firebase/firebase';
// import NotFoundPage from './NotFoundPage';
import { PHCardLoader } from './common/PlaceHolder';
import { fetchCity, fetchCategories, fetchStoriesListing, fetchStoryListing, fetchStoryListingByLocation, fetchAllListingByLocation, setIframeView, filterStoryListing, filterAllStoryListing, setLayoverPlayBtn, fetchMasterListing, setHindiView } from '../lib/features/blogSlice';
import { useSelector, useDispatch } from 'react-redux';
import useWindowSize from '../utils/useWindowSize';
import StoryDetailPageFooterNew from './StoryDetail/StoryDetailPageFooterNew';
import CustomStyle from './common/CustomStyle';

const VoicesListPage = (props) => {
  const state = useSelector((state) => state.blog);
  let dispatch = useDispatch();
  const homePageBackground = useRef();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const id = params.id; // Assuming the route is [id].js or similar
  const search = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const { width } = useWindowSize();
  const containerFluid = useRef();
  const shimmerMobileRef = useRef();
  const [storyArr, setStoryArr] = useState([]);
  const sessionStorageRef = useRef(true);
  const uniqueData = useRef(null);
  const [customSearchValue, setCustomSearchValue] = useState('');
  let storyListTitle = '';
  let homePara = '';
  const parts = pathname.split('/');
  const localPageRef = useRef();
  const [urlExists, setUrlExists] = useState(null);
  const [voicesUrlExists, setVoicesUrlExists] = useState(null);

  const capitalizeEachWord = (str) => {
    return str.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  useEffect(() => {
    if (pathname.startsWith('/hindi')) {
      dispatch(setHindiView(true));
    } else {
      dispatch(setHindiView(false));
    }
  }, [pathname]);

  useEffect(() => {
    dispatch(setLayoverPlayBtn(false));
  }, []);

  if (pathname === '/voices' || pathname === '/hindi/voices') {
    storyListTitle = 'Inspiring Personal & Brand Stories';
    homePara = (
      <div className='StoriesListPage-bannerPara'>
        <p>Watch latest video stories of Indian</p>
        <p>professionals, business owners, creators, startups and more.</p>
      </div>
    );
  }

  useEffect(() => {
    if (state.storyListing.length || state.storyListing.length == 0) {
      const getDataFromSession = sessionStorage.getItem(pathname);
      const cacheDataSession = sessionStorage.getItem('cacheData');
      if (pathname !== cacheDataSession) {
        sessionStorage.removeItem(cacheDataSession);
      }
      if (getDataFromSession && pathname === cacheDataSession) {
        const newStoryListing = JSON.parse(getDataFromSession);
        const slicedData = newStoryListing.slice(0, 60);
        setStoryArr(slicedData);
        sessionStorage.removeItem(pathname);
        sessionStorageRef.current = false;

        const allData = [...slicedData, ...state.storyListing];
        let jsonObject = allData.map(JSON.stringify);
        let uniqueSet = new Set(jsonObject);
        let uniqueArrayData = Array.from(uniqueSet).map(JSON.parse);

        uniqueData.current = uniqueArrayData;
      } else if (sessionStorageRef.current) {
        const shuffle = function (o) {
          for (
            var j, x, i = o.length;
            i;
            j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
          );
          return o;
        };
        let newStoryListing = shuffle([...state.storyListing]);
        let number;
        if (pathname == '/voices' || pathname == '/hindi/voices') {
          number = 60;
        } else {
          number = parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'local' && parts[3] != '' || parts[0] == '' && parts[1] == 'local' && parts[2] != '' || parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'voices' && parts[3] != '' || parts[0] == '' && parts[1] == 'voices' && parts[2] != '' ? 8 : 60;
        }

        setStoryArr(newStoryListing.slice(0, number));
        sessionStorage.removeItem(pathname);
      }
    }
  }, [state.storyListing]);

  useEffect(() => {
    const shimmerMobile = shimmerMobileRef.current;

    if (state.storyListLoading && width < 760) {
      shimmerMobile.querySelectorAll('.shimmerBoxMobile').forEach(el => {
        el.style.height = `${(el.getBoundingClientRect().width / 100) * 178}px`;
      });
    }
  }, [width]);

  useEffect(() => {
    window.scroll(0, 0);

    // restoring scroll position.
    const observer = new MutationObserver((mutations, observer) => {
      const blogPath = sessionStorage.getItem('blogPath');
      const lastScroll = sessionStorage.getItem('lastScroll');
      if (blogPath && lastScroll) {
        window.scroll(0, lastScroll);
      }

      setTimeout(() => {
        sessionStorage.removeItem('blogPath');
      }, 2000);
    });

    observer.observe(containerFluid.current, { subtree: true, childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // saving scroll position on unmount
    return () => {
      sessionStorage.setItem('lastScroll', window.scrollY);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchMasterListing());
  }, []);

  useEffect(() => {
    trackScreen(SCREEN_NAME.storyList);
    const category = id || 'top';
    if (pathname.includes('/local/')) {
      dispatch(fetchStoryListingByLocation(category));
      dispatch(fetchAllListingByLocation(category));
    } else {
      dispatch(fetchStoryListing(category));
      dispatch(fetchStoriesListing(category));
    }

    dispatch(setIframeView(search == '?hideBanner=yes' || state.isiFrameView ? true : false));

    dispatch(fetchCity());
    dispatch(fetchCategories());
  }, [pathname]);

  const prevPath = useRef(pathname);
  useEffect(() => {
    if (prevPath.current != pathname && !!id) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  if (!!state.categories && !!state.categories.length && !pathname.includes('/local/')) {
    const isCategoryAvailable = state.categories.filter(o => o.category == id);

    // if (!isCategoryAvailable.length && !!id) {
    //   return <NotFoundPage />;
    // }
  }

  let storySlug = id;

  if (!!state.storyListing && !!state.storyListing.length && !!id && !state.storyListLoading) {
    const storySlugArr = state.storyListing.filter(o => o.storySlug == id);
    if (!!storySlugArr && !!storySlugArr.length) {
      storySlug = storySlugArr[0].storyType;
    } else {
      if (id == 'in-memory') {
        storySlug = 'In Memory';
      } else {
        storySlug = '';
      }
    }
  }

  const goBack = () => {
    router.back();
  };

  const handleStoreSession = () => {
    sessionStorage.setItem(pathname, JSON.stringify(storyArr));
    sessionStorage.setItem('cacheData', pathname);
  };

  const checkUrlExists = async (url) => {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      console.error('Error fetching the URL:', error);
      return false;
    }
  };

  const url = `https://cdn.workmob.com/stories_workmob/location_videos/${id + '/' + id}.m3u8`;

  useEffect(() => {
    const checkUrl = async () => {
      const exists = await checkUrlExists(url);
      setUrlExists(exists);
    };

    checkUrl();
  }, [url]);

  const checkVoicesUrlExists = async (url) => {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      console.error('Error fetching the URL:', error);
      return false;
    }
  };

  const voicesUrl = `https://cdn.workmob.com/stories_workmob/category_videos/${id + '/' + id}.m3u8`;

  useEffect(() => {
    const checkUrl = async () => {
      const exists = await checkVoicesUrlExists(voicesUrl);
      setVoicesUrlExists(exists);
    };

    checkUrl();
  }, [voicesUrl]);

  const handleBackClick = (e) => {
    e.preventDefault();
    router.push(state.isHindi ? '/hindi' : '/');
    // router.back();
  }

  useEffect(() => {
    // Update title
    document.title = state.isHindi ? VOICE_LIST_PAGE.title_hi : VOICE_LIST_PAGE.title;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', state.isHindi ? VOICE_LIST_PAGE.description_hi : VOICE_LIST_PAGE.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = state.isHindi ? VOICE_LIST_PAGE.description_hi : VOICE_LIST_PAGE.description;
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
    updateOrCreateMeta('og:title', state.isHindi ? VOICE_LIST_PAGE.title_hi : VOICE_LIST_PAGE.title);
    updateOrCreateMeta('og:description', state.isHindi ? VOICE_LIST_PAGE.description_hi : VOICE_LIST_PAGE.description);
    updateOrCreateMeta('og:url', HOST + pathname);
    updateOrCreateMeta('og:image', VOICE_LIST_PAGE.ogImage);
    updateOrCreateMeta('og:site_name', VOICE_LIST_PAGE.siteName);
    // Update Twitter tags
    updateOrCreateMeta('twitter:title', state.isHindi ? VOICE_LIST_PAGE.title_hi : VOICE_LIST_PAGE.title);
    updateOrCreateMeta('twitter:description', state.isHindi ? VOICE_LIST_PAGE.description_hi : VOICE_LIST_PAGE.description);
    updateOrCreateMeta('twitter:image', VOICE_LIST_PAGE.ogImage);
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

  return (
    <>
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
      {!state.isiFrameView &&
        search != '?hideBanner=yes' &&
        !state.storyListLoading &&
        <div className="waveBtn animate__animated animate__jello" style={{ pointerEvents: 'none' }}>
          <i
            style={{ pointerEvents: 'auto' }}
            onClick={(e) => handleBackClick(e)}
            className={`btnClose icon icon-cancel d-flex align-items-center justify-content-center rounded-circle font-weight-bold`}
          />
          <div
            onClick={(e) => handleBackClick(e)}
            className="closeBtnWave d-flex align-items-center justify-content-center"
            style={{ backgroundColor: '#DF625C', cursor: 'pointer', pointerEvents: 'auto' }}
          >
            &nbsp;
          </div>
        </div>}
      <CustomStyle>{styleString}</CustomStyle>
      <ErrorBoundary>
        <StoriesPageBanner
          isiFrameView={state.isiFrameView}
          storySlug={storySlug}
          filterStoryListing={filterStoryListing}
          filterAllStoryListing={filterAllStoryListing}
          storyListTitle={storyListTitle}
          homePara={homePara}
          storyArr={storyArr}
          setStoryArr={setStoryArr}
          setCustomSearchValue={setCustomSearchValue}
          {...state}
        />
      </ErrorBoundary>
      <div
        style={{ width: '95%', maxWidth: '100%', marginBottom: '94px', zIndex: 1, position: 'relative' }}
        className='container-fluid'
        ref={containerFluid}
      >
        {state.storyListLoading ? (
          width < 760 ? (
            <div className='shimmerMobile' ref={shimmerMobileRef}>
              <div style={styles.shimmerBar}></div>
              <div style={styles.shimmerGrid}>
                <div className='shimmerBoxMobile' style={styles.shimmerBox}></div>
                <div className='shimmerBoxMobile' style={styles.shimmerBox}></div>
                <div className='shimmerBoxMobile' style={styles.shimmerBox}></div>
                <div className='shimmerBoxMobile' style={styles.shimmerBox}></div>
              </div>
            </div>
          ) : (
            <PHCardLoader />
          )
        ) : (
          <>
            <div className='row inspring-thumbs'>
              {storyArr.length > 0 ?
                storyArr.map((story, index) => (
                  <CardInspiring
                    key={index}
                    isHindi={state.isHindi}
                    colSize={3}
                    pageId={id}
                    screenName={SCREEN_NAME.storyList}
                    story={story}
                    onStoreSession={handleStoreSession}
                  />
                ))
                :
                customSearchValue.length > 0 && storyArr.length === 0 && (
                  <p className='notFoundMessageCustom'>No stories found with "{customSearchValue}"</p>
                )}
            </div>
          </>)}
      </div>
      <StoryDetailPageFooterNew changeText={true} homepage={true} />
    </>
  );
};

const styleString = `
  .StoriesListPage-bannerPara {
    margin-bottom: 1em;
  }

  .StoriesListPage-bannerPara > p {
    margin: 0;
  }
  .notFoundMessageCustom {
    color: #dfdfdf;
    font-size: 20px;
    margin: 0 auto;
    z-index: 1;
  }
  .topVideoLocal {
    width: 100%;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
  }
  .topLocalVideoFrame {
    z-index: 1;
    pointer-events: none;
    inset: 0;
    transform: scale(1.03);
    height: 100% !important;
    width: 100%;
    position: absolute;
  }
  .customLocalVideoContainer {
    width: 100%;
    height: 100%;
    border-radius: 42px;
    overflow: hidden;
  }
  @media (min-width: 425px) and (max-width: 567px) {
    .customLocalVideoContainer {
      border-radius: 30px;
    }
  }
  @media (max-width: 425px) {
    .customLocalVideoContainer {
      border-radius: 24px;
    }
  }
  .videoPlayerClassLocalVideo {
    outline: 0;
    background: #000;
    object-fit: cover !important;
    width: 100%;
    height: 100%;
    border-radius: 1px;
  }
  .topHeading {
    color: #fff;
  }
  .bottomHeading {
    color: #fff;
  }
  .topHeading .firstTitle {
    font-family: Montserrat, sans-serif;
    font-weight: bold;
    font-size: 29px;
    margin-bottom: 0;
    line-height: 1.4;
  }
  .topHeading .secondTitle {
    font-family: Montserrat, sans-serif;
    font-weight: bold;
    padding-left: 20px;
    padding-right: 20px;
    line-height: 1.4;
    font-size: 28px;
  }
  @media (min-width: 475px) and (max-width: 576px) {
    .topHeading .firstTitle {
      font-size: 17px;
    }

    .topHeading .secondTitle {
      font-size: 17px;
    }

    .bottomHeading .firstTitle {
      font-size: 17px !important;
      margin-top: 30px !important;
    }
  }
  @media (max-width: 475px) {
    .topHeading .firstTitle {
      font-size: 16px;
    }

    .topHeading .secondTitle {
      font-size: 16px;
    }

    .bottomHeading .firstTitle {
      font-size: 16px !important;
      margin-top: 30px !important;
    }

    .detailFooter-madeWithLove {
      font-size: 11px !important;
  }
  }
  @media (min-width: 576px) and (max-width: 767px) {
    .topHeading {
      margin-top: 0px !important;
    }
  }
  @media (max-width: 576px) {
    .topHeading {
      margin-top: 0px !important;
    }
  }
  @media (min-width: 576px) and (max-width: 768px) {
    .topHeading .firstTitle {
      font-size: 19px;
    }

    .topHeading .secondTitle {
      font-size: 19px;
    }

    .bottomHeading .firstTitle {
      font-size: 19px !important;
      margin-top: 72px !important;
    }
  }
  .bottomHeading .firstTitle {
    font-family: Montserrat, sans-serif;
    font-weight: bold;
    line-height: 1.4;
    font-size: 34px;
    margin-top: 90px;
  }
  // .topOverlay {
  //   position: absolute;
  //   width: 100%;
  //   height: 100%;
  //   background-color: rgba(0, 0, 0, 0.6);
  //   border-radius: 41px;
  // }
  .topHeading .firstTitle span {
    color: #e7c822;
  }
  .bottomHeading .firstTitle span {
    color: #e7c822;
  }
  .bottomBranding a {
    color: rgb(255, 255, 255);
    background-image: url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png);
    background-position: center center;
    background-size: 105%;
    border-radius: 100px;
    margin-top: 12px;
    font-family: "Alata", sans-serif;
  }
  .bottomBranding a:hover {
    color: rgb(255, 255, 255);
  }
  .detailPageBackgroundImage{
    position: fixed;
    min-height: 100%;
    min-width: 100%;
    // z-index:1;
    top: 0;
    width: 200px;
    object-fit: cover;
  }
  .detailPageMainBackground{
    position: fixed;
      min-height: 100%;
      min-width: 100%;
      object-fit: cover;
      // z-index:1;
      top: 0;
  }
  .voicesPageBackgroundImage {
    position: fixed;
    min-height: 100%;
    min-width: 100%;
    top: 0;
    width: 200px;
    object-fit: cover;
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
  shimmerBar: {
    height: '3rem',
    backgroundColor: '#242526',
    borderRadius: '30px',
    margin: '10rem 0 2rem',
  },

  shimmerGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    rowGap: '1rem',
    columnGap: '0.5rem',
  },

  shimmerBox: {
    // aspectRatio: '50 / 89',
    width: '100%',
    backgroundColor: '#242526',
    borderRadius: '10px',
  },
  paddingAll: {
    paddingTop: '55%',
    borderRadius: '39px',
    background: '#000'
  }
};

export default VoicesListPage;