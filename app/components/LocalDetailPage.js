'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, usePathname, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import StoriesPageBanner from '../components/Stories/StoriesPageBanner';
import { getCookie } from '../utils';
import CardInspiring from '../components/common/CardInspiring';
import ErrorBoundary from '../components/ErrorBoundry';
import { SCREEN_NAME } from '../constants/firebaseString';
import { STORY_LIST, HOST } from '../constants/localString';
import { trackScreen } from '../firebase/firebase';
import { PHCardLoader } from '../components/common/PlaceHolder';
import { fetchCity, fetchCategories, fetchStoryListingByLocation, fetchAllListingByLocation, setIframeView, filterStoryListing, filterAllStoryListing, setLayoverPlayBtn, fetchMasterListing, setHindiView } from '../lib/features/blogSlice';
import ReactHlsPlayer from '../components/HSL';
import { useSelector, useDispatch } from 'react-redux';
import useWindowSize from '../utils/useWindowSize';
import StoryDetailPageFooterNew from '../components/StoryDetail/StoryDetailPageFooterNew';
import CustomStyle from '../components/common/CustomStyle';

const LocalDetailPage = (props) => {
  const state = useSelector((state) => state.blog);
  let dispatch = useDispatch();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search');
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
  const [navType, setNavType] = useState('fixedNav');
  const [userInfo, setUserInfo] = useState(null);

  const capitalizeEachWord = (str) => {
    return str.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  useEffect(() => {
    dispatch(setLayoverPlayBtn(false));
  }, []);

  useEffect(() => {
    if (pathname.startsWith('/hindi')) {
      dispatch(setHindiView(true));
    } else {
      dispatch(setHindiView(false));
    }
  }, [pathname]);

  if (pathname.startsWith('/local') && id) {
    storyListTitle = `${id
      .replace(/-/g, ' ')
      .replace(/^(.)|\s+(.)/g, c =>
        c.toUpperCase()
      )} local professionals, business owners, startups, and more.`;
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
        number = parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'local' && parts[3] != '' || parts[0] == '' && parts[1] == 'local' && parts[2] != '' || parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'voices' && parts[3] != '' || parts[0] == '' && parts[1] == 'voices' && parts[2] != '' ? 8 : 60;

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
    dispatch(fetchStoryListingByLocation(category));
    dispatch(fetchAllListingByLocation(category));

    dispatch(setIframeView(search == '?hideBanner=yes' || state.isiFrameView ? true : false));

    dispatch(fetchCity());
    dispatch(fetchCategories());
  }, []);

  const prevPath = useRef(pathname);
  // useEffect(() => {
  //   if (prevPath.current != pathname && !!id) {
  //     window.scrollTo(0, 0);
  //   }
  // }, [pathname]);

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

  const toggleLanguage = (e) => {
    e.preventDefault();
    const newPath = !state.isHindi ? `/hindi/${parts[1]}/${parts[2]}` : `/${parts[2]}/${parts[3]}`;
    window.history.replaceState(null, "", newPath);
    dispatch(setHindiView(!state.isHindi));
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    // router.push(state.isHindi ? '/hindi/local' : '/local');
    const getcacheDataFromSession = sessionStorage.getItem('cacheData');
    if (getcacheDataFromSession == null) {
      state.isHindi ? router.replace('/hindi/local') : router.replace('/local');
    } else {
      state.isHindi ? (getcacheDataFromSession.startsWith('/hindi') ? router.replace(getcacheDataFromSession) : router.replace(`/hindi${getcacheDataFromSession}`)) : (getcacheDataFromSession.startsWith('/hindi') ? router.replace(getcacheDataFromSession?.slice(6)) : router.replace(getcacheDataFromSession));
    }
  }

  useEffect(() => {
    // Update title
    document.title = state.isHindi ? `${props?.cityDetail?.location_hindi} लोकल प्रोफेशनल्स (स्थानीय पेशेवरों), बिज़नेस ओनर्स, स्टार्टअप्स। खोजें व कनेक्ट करें।` : `${props?.cityDetail?.location.charAt(0).toUpperCase() + props?.cityDetail?.location.slice(1)} Local Professionals, Business Owners, Startups | Find & Connect`;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', state.isHindi ? `स्थानीय प्रोफेशनल्स, स्टार्टअप्स एवं बिज़नेस ओनर्स को सर्च करें और उनसे कनेक्ट करें।` : `Discover, connect and meet with local ${props?.cityDetail?.location.charAt(0).toUpperCase() + props?.cityDetail?.location.slice(1)} professionals, business owners, startups, social workers and more.`);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = state.isHindi ? `स्थानीय प्रोफेशनल्स, स्टार्टअप्स एवं बिज़नेस ओनर्स को सर्च करें और उनसे कनेक्ट करें।` : `Discover, connect and meet with local ${props?.cityDetail?.location.charAt(0).toUpperCase() + props?.cityDetail?.location.slice(1)} professionals, business owners, startups, social workers and more.`;
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
    updateOrCreateMeta('og:title', state.isHindi ? `${props?.cityDetail?.location_hindi} लोकल प्रोफेशनल्स (स्थानीय पेशेवरों), बिज़नेस ओनर्स, स्टार्टअप्स। खोजें व कनेक्ट करें।` : `${props?.cityDetail?.location.charAt(0).toUpperCase() + props?.cityDetail?.location.slice(1)} Local Professionals, Business Owners, Startups | Find & Connect`);
    updateOrCreateMeta('og:description', state.isHindi ? `स्थानीय प्रोफेशनल्स, स्टार्टअप्स एवं बिज़नेस ओनर्स को सर्च करें और उनसे कनेक्ट करें।` : `Discover, connect and meet with local ${props?.cityDetail?.location.charAt(0).toUpperCase() + props?.cityDetail?.location.slice(1)} professionals, business owners, startups, social workers and more.`);
    updateOrCreateMeta('og:url', HOST + pathname);
    updateOrCreateMeta('og:image', STORY_LIST.ogImage);
    updateOrCreateMeta('og:site_name', STORY_LIST.siteName);
    // Update Twitter tags
    updateOrCreateMeta('twitter:title', state.isHindi ? `${props?.cityDetail?.location_hindi} लोकल प्रोफेशनल्स (स्थानीय पेशेवरों), बिज़नेस ओनर्स, स्टार्टअप्स। खोजें व कनेक्ट करें।` : `${props?.cityDetail?.location.charAt(0).toUpperCase() + props?.cityDetail?.location.slice(1)} Local Professionals, Business Owners, Startups | Find & Connect`);
    updateOrCreateMeta('twitter:description', state.isHindi ? `स्थानीय प्रोफेशनल्स, स्टार्टअप्स एवं बिज़नेस ओनर्स को सर्च करें और उनसे कनेक्ट करें।` : `Discover, connect and meet with local ${props?.cityDetail?.location.charAt(0).toUpperCase() + props?.cityDetail?.location.slice(1)} professionals, business owners, startups, social workers and more.`);
    updateOrCreateMeta('twitter:image', STORY_LIST.ogImage);
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
      <div className="waveBtn animate__animated animate__jello" style={{ pointerEvents: 'none' }}>
        <i
          style={{ pointerEvents: 'auto' }}
          onClick={handleBackClick}
          className={`btnClose icon icon-cancel d-flex align-items-center justify-content-center rounded-circle font-weight-bold`}
        />
        <div
          onClick={handleBackClick}
          className="closeBtnWave d-flex align-items-center justify-content-center"
          style={{ backgroundColor: '#DF625C', cursor: 'pointer', pointerEvents: 'auto' }}
        >
          &nbsp;
        </div>
      </div>
      <CustomStyle>{styleString}</CustomStyle>
      <div
        className='siteHeader'
        style={{ ...styles.headerContainer, ...styles[navType] }}
      >
        <nav className='d-flex justify-content-between custom-px'>
          <div>
            <img src='https://cdn.workmob.com/stories_workmob/images/common/logo.png' />
          </div>
          <div
            onClick={(e) => toggleLanguage(e)}
            className='rounded-circle ml-2 new-hindi-button'
            style={styles.langButtonNew}
            role='button'
          >
            {state.isHindi ? 'Eng' : 'हिंदी'}
          </div>
        </nav>
      </div>
      <ReactHlsPlayer
        playerRef={localPageRef}
        className={`detailPageMainBackground`}
        url={urlExists ? `https://cdn.workmob.com/stories_workmob/location_videos/${id + '/' + id}.m3u8` : 'https://cdn.workmob.com/stories_workmob/web_home/blank-bg-video/blank-bg-video.m3u8'}
        poster='https://cdn.workmob.com/stories_workmob/web_home/blank-bg-video.jpg'
        controls={false}
        autoPlay={true}
        preload='auto'
        muted={true}
        playsInline={true}
        loop={true}
        id='detailPageMainBackground'
        onPlay={() => {
          const image = document.getElementsByClassName('detailPageBackgroundImage')[0];
          image.classList.add('d-none');
        }}
      />
      <img
        className='detailPageBackgroundImage'
        src='https://cdn.workmob.com/stories_workmob/web_home/blank-bg-video.jpg'
      />

      <div className='container'>
        <div className='row justify-content-center pt-5'>
          <div className='col-xl-11 col-lg-12 col-md-12 col-sm-12 col-12 mb-3'>
            <div className='topHeading text-center mt-3'>
              <h1 className='firstTitle'>Are you <span>{capitalizeEachWord(id.replace(/-/g, ' '))}'s</span> local professional, business owner or startup?</h1>
              <h1 className='secondTitle'>Get your single branding page and unique QR code to showcase your work with the power of video.</h1>
            </div>
          </div>
          <div className='col-lg-9 col-md-10 col-sm-12 col-11'>
            <div className='position-relative mb-0'>
              <div style={styles.paddingAll}></div>
              <div className='topVideoLocal'>
                <img
                  src="https://cdn.workmob.com/intro_workmob/story-questions/frame.png"
                  className='img-fluid topLocalVideoFrame'
                  alt="frame"
                />
                <div className={`customLocalVideoContainer`}>
                  <ReactHlsPlayer
                    className='videoPlayerClassLocalVideo'
                    url='https://cdn.workmob.com/stories_workmob/web_home/scan-qr-code-video/scan-qr-code-video.m3u8'
                    playsInline={true}
                    controls={false}
                    autoPlay
                    preload='auto'
                    muted={true}
                    id={'orgnanizationVideo'}
                    loop={true}
                    width='100%'
                    height='100%'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
        style={{ width: '95%', maxWidth: '100%', marginBottom: 'unset' }}
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
        <div className='row justify-content-center'>
          <div className='col-lg-8 col-md-12 col-sm-12 col-12'>
            <div className='bottomHeading text-center'>
              <h1 className='firstTitle'>Join <span>20k+ people</span> using Workmob to build their brand using the power of video introductions</h1>
            </div>
          </div>
          <div className='col-lg-8 col-md-12 col-sm-12 col-12'>
            <div className='d-flex bottomBranding'>
              <Link
                href={{
                  pathname: '/merikahani',
                  state: true,
                }}
                className={`btn font-weight-bold ${state.isHindi ? 'font-khand' : ''} btn-lg mx-auto px-5 brandingPageEffect`}
              >
                {state.isHindi ? 'कहानी शेयर करें' : 'Get your branding page'}
              </Link>
            </div>
          </div>
        </div>
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
    top: 0;
    width: 200px;
    object-fit: cover;
  }
  .detailPageMainBackground{
    position: fixed;
    min-height: 100%;
    min-width: 100%;
    object-fit: cover;
    top: 0;
  }
   .custom-px {
    padding: 3px 113px 4px 42px;
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
@media (max-width: 776px) {
    .custom-px {
        padding: 3px 48px 4px 14px;
    }
    .siteHeader {
        position: sticky !important;
        position: -webkit-sticky !important;
    }
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
    width: '100%',
    backgroundColor: '#242526',
    borderRadius: '10px',
  },
  paddingAll: {
    paddingTop: '55%',
    borderRadius: '39px',
    background: '#000'
  },
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

export default LocalDetailPage;