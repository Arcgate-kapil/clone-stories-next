'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, usePathname, useRouter } from 'next/navigation';
import StoriesPageBanner from '../components/Stories/StoriesPageBanner';
import StoriesPageCategories from '../components/Stories/StoriesPageCategories';
import CardAudio from '../components/common/CardAudio';
import ErrorBoundary from '../components/ErrorBoundry';
import { STORY_LIST, HOST } from '../constants/localString';
import { SCREEN_NAME } from '../constants/firebaseString';
import { trackScreen } from '../firebase/firebase';
// import NotFoundPage from './NotFoundPage';
import { PHCardLoader } from '../components/common/PlaceHolder';
import { fetchAudioCategories, setIframeView, fetchPodcastListing, fetchStoryDetail, setHindiView } from '../lib/features/blogSlice';
import { PHStoryLoader } from '../components/common/PlaceHolder';
import useWindowSize from '../utils/useWindowSize';
import StoryDetailPageFooterNew from '../components/StoryDetail/StoryDetailPageFooterNew';
import { useSelector, useDispatch } from 'react-redux';
import { getCookie } from '../utils';
import Link from 'next/link';
import NewPodcastDetailPage from './NewPodcastDetailPage';
import StoriesOverlayCat from './Stories/StoriesOverlayCat';

const PodcastDetailPage = (props) => {
  const { width } = useWindowSize();
  const params = useParams();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search');
  const pathname = usePathname();
  const [navType, setNavType] = useState('fixedNav');
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchCategory, setSearchCategory] = useState('');
  const [overlayCat, setoverlayCat] = useState(false);
  const [openLayout, setOpenLayout] = useState(false);

  useEffect(() => {
    dispatch(fetchStoryDetail(params.id, 'audio-story'));
  }, []);

  useEffect(() => {
    if (pathname.startsWith('/hindi')) {
      dispatch(setHindiView(true));
    } else {
      dispatch(setHindiView(false));
    }
  }, [pathname]);

  const state = useSelector((state) => state.blog);
  const id = params.id || null;

  const [play, setPlay] = useState(null);
  const [searchString, setSearchString] = useState('');

  const clickBtn = (e, cardId, type) => {
    e.preventDefault();
    const elemAudio = document.getElementsByTagName('audio')[0];
    const elem = document.querySelector('.categoryContainer');
    if (type == 'active' && cardId == play && !!elemAudio && !!elemAudio.paused) {
      document.getElementsByTagName('audio')[0].play();
    } else {
      if (cardId == play) {
        setPlay(null);
        if (!!elem) {
          elem.classList.remove('moveUp');
        }
      } else {
        setPlay(cardId);
        if (!!elem) {
          elem.classList.add('moveUp');
        }
      }
    }
  };

  useEffect(() => {
    trackScreen(SCREEN_NAME.podcastList);
    const category = id || 'top';
    dispatch(fetchPodcastListing(category));
    const hideBanner = searchParams.get('hideBanner') === 'yes';
    dispatch(setIframeView(hideBanner || state.isiFrameView));
    dispatch(fetchAudioCategories());
  }, [id, dispatch, searchParams, state.isiFrameView]);

  const prevPath = useRef(pathname);
  useEffect(() => {
    if (prevPath.current !== pathname) {
      window.scrollTo(0, 0);
      if (
        !!state.audioCategories &&
        state.audioCategories.filter(e => e.category != id).length == state.audioCategories.length &&
        !!id
      ) {
        // Handle if needed
      }
    }
    prevPath.current = pathname;
  }, [pathname, state.audioCategories, id]);

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

  const handleOverLay = () => {
    setoverlayCat(false);
    setOpenLayout(true);
  }

  const toggleLanguage = (e) => {
    e.preventDefault();
    const newPath = pathname.startsWith('/hindi') ? pathname.replace('/hindi', '') : '/hindi' + pathname;
    window.history.replaceState(null, "", newPath);
    dispatch(setHindiView(!state.isHindi));
  };

  useEffect(() => {
    if (props?.initialData?.data == null) {
      // Update title
      document.title = state.isHindi ? `${props?.category?.industry_hindi} प्रोफेशनल्स , स्टार्टअप और बिज़नेस पॉडकास्ट | ऑडियो स्टोरीज़` : `${props?.category?.industry} Professionals, Startups & Businesses Podcast | Audio Stories`;
      // Update or create meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', state.isHindi ? `वर्कमोब पॉडकास्ट पर कैटेगरी ${props?.category?.industry_hindi} के अनुसार भारत के प्रोफेशनल्स, बिज़नेस ओनर्स, स्टार्टअप्स और सोशल वर्कर्स की प्रेरक व्यक्तिगत कहानियां सुनें।` : `Hear inspiring personal, career journey and business brand stories of ${props?.category?.industry} professionals, startups & business owners from India.`);
      } else {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        metaDesc.content = state.isHindi ? `वर्कमोब पॉडकास्ट पर कैटेगरी ${props?.category?.industry_hindi} के अनुसार भारत के प्रोफेशनल्स, बिज़नेस ओनर्स, स्टार्टअप्स और सोशल वर्कर्स की प्रेरक व्यक्तिगत कहानियां सुनें।` : `Hear inspiring personal, career journey and business brand stories of ${props?.category?.industry} professionals, startups & business owners from India.`;
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
      updateOrCreateMeta('og:title', state.isHindi ? `${props?.category?.industry_hindi} प्रोफेशनल्स , स्टार्टअप और बिज़नेस पॉडकास्ट | ऑडियो स्टोरीज़` : `${props?.category?.industry} Professionals, Startups & Businesses Podcast | Audio Stories`);
      updateOrCreateMeta('og:description', state.isHindi ? `वर्कमोब पॉडकास्ट पर कैटेगरी ${props?.category?.industry_hindi} के अनुसार भारत के प्रोफेशनल्स, बिज़नेस ओनर्स, स्टार्टअप्स और सोशल वर्कर्स की प्रेरक व्यक्तिगत कहानियां सुनें।` : `Hear inspiring personal, career journey and business brand stories of ${props?.category?.industry} professionals, startups & business owners from India.`);
      updateOrCreateMeta('og:url', HOST + pathname);
      updateOrCreateMeta('og:image', STORY_LIST.ogImage);
      updateOrCreateMeta('og:site_name', STORY_LIST.siteName);
      // Update Twitter tags
      updateOrCreateMeta('twitter:title', state.isHindi ? `${props?.category?.industry_hindi} प्रोफेशनल्स , स्टार्टअप और बिज़नेस पॉडकास्ट | ऑडियो स्टोरीज़` : `${props?.category?.industry} Professionals, Startups & Businesses Podcast | Audio Stories`);
      updateOrCreateMeta('twitter:description', state.isHindi ? `वर्कमोब पॉडकास्ट पर कैटेगरी ${props?.category?.industry_hindi} के अनुसार भारत के प्रोफेशनल्स, बिज़नेस ओनर्स, स्टार्टअप्स और सोशल वर्कर्स की प्रेरक व्यक्तिगत कहानियां सुनें।` : `Hear inspiring personal, career journey and business brand stories of ${props?.category?.industry} professionals, startups & business owners from India.`);
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
    } else {
      // Update title
      document.title = state.isHindi ? `${props.initialData?.data?.name_hindi}, ${props.initialData?.data?.job_title_hindi}, ${props.initialData?.data?.company_name_hindi}, ${props.initialData?.data?.location_hindi} पॉडकास्ट एपिसोड` : `${props.initialData?.data?.name}, ${props.initialData?.data?.job_title}, ${props.initialData?.data?.company_name}, ${props.initialData?.data?.location[0].toUpperCase() + props.initialData?.data?.location.slice(1)} Podcast Episode`;
      // Update or create meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', state.isHindi ? `वर्कमोब पॉडकास्ट पर ${props.initialData?.data?.name_hindi}, ${props.initialData?.data?.company_name_hindi}, ${props.initialData?.data?.location_hindi} में ${props.initialData?.data?.job_title_hindi} की मोटिवेशनल ऑडियो स्टोरी सुनें।` : `Listen to the motivational audio story of ${props.initialData?.data?.name}, ${props.initialData?.data?.job_title} at ${props.initialData?.data?.company_name} in ${props.initialData?.data?.location[0].toUpperCase() + props.initialData?.data?.location.slice(1)} on Workmob Podcast.`);
      } else {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        metaDesc.content = state.isHindi ? `वर्कमोब पॉडकास्ट पर ${props.initialData?.data?.name_hindi}, ${props.initialData?.data?.company_name_hindi}, ${props.initialData?.data?.location_hindi} में ${props.initialData?.data?.job_title_hindi} की मोटिवेशनल ऑडियो स्टोरी सुनें।` : `Listen to the motivational audio story of ${props.initialData?.data?.name}, ${props.initialData?.data?.job_title} at ${props.initialData?.data?.company_name} in ${props.initialData?.data?.location[0].toUpperCase() + props.initialData?.data?.location.slice(1)} on Workmob Podcast.`;
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
      updateOrCreateMeta('og:title', state.isHindi ? `${props.initialData?.data?.name_hindi}, ${props.initialData?.data?.job_title_hindi}, ${props.initialData?.data?.company_name_hindi}, ${props.initialData?.data?.location_hindi} पॉडकास्ट एपिसोड` : `${props.initialData?.data?.name}, ${props.initialData?.data?.job_title}, ${props.initialData?.data?.company_name}, ${props.initialData?.data?.location[0].toUpperCase() + props.initialData?.data?.location.slice(1)} Podcast Episode`);
      updateOrCreateMeta('og:description', state.isHindi ? `वर्कमोब पॉडकास्ट पर ${props.initialData?.data?.name_hindi}, ${props.initialData?.data?.company_name_hindi}, ${props.initialData?.data?.location_hindi} में ${props.initialData?.data?.job_title_hindi} की मोटिवेशनल ऑडियो स्टोरी सुनें।` : `Listen to the motivational audio story of ${props.initialData?.data?.name}, ${props.initialData?.data?.job_title} at ${props.initialData?.data?.company_name} in ${props.initialData?.data?.location[0].toUpperCase() + props.initialData?.data?.location.slice(1)} on Workmob Podcast.`);
      updateOrCreateMeta('og:url', HOST + pathname);
      updateOrCreateMeta('og:image', STORY_LIST.ogImage);
      updateOrCreateMeta('og:site_name', STORY_LIST.siteName);
      // Update Twitter tags
      updateOrCreateMeta('twitter:title', state.isHindi ? `${props.initialData?.data?.name_hindi}, ${props.initialData?.data?.job_title_hindi}, ${props.initialData?.data?.company_name_hindi}, ${props.initialData?.data?.location_hindi} पॉडकास्ट एपिसोड` : `${props.initialData?.data?.name}, ${props.initialData?.data?.job_title}, ${props.initialData?.data?.company_name}, ${props.initialData?.data?.location[0].toUpperCase() + props.initialData?.data?.location.slice(1)} Podcast Episode`);
      updateOrCreateMeta('twitter:description', state.isHindi ? `वर्कमोब पॉडकास्ट पर ${props.initialData?.data?.name_hindi}, ${props.initialData?.data?.company_name_hindi}, ${props.initialData?.data?.location_hindi} में ${props.initialData?.data?.job_title_hindi} की मोटिवेशनल ऑडियो स्टोरी सुनें।` : `Listen to the motivational audio story of ${props.initialData?.data?.name}, ${props.initialData?.data?.job_title} at ${props.initialData?.data?.company_name} in ${props.initialData?.data?.location[0].toUpperCase() + props.initialData?.data?.location.slice(1)} on Workmob Podcast.`);
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
    }
  }, [state.isHindi, pathname, props?.initialData]);

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

  if (!state.audioCategories.length) {
    return null;
  }

  if (
    !!state.audioCategories.length &&
    !!state.audioCategories &&
    state.audioCategories.filter(e => e.category != id).length == state.audioCategories.length &&
    !!id
  ) {


    // let storyDetail = props?.initialData?.data;

    if (!props?.initialData?.data) {
      return null;
    }

    if (props?.initialData?.loading) {
      return <PHStoryLoader />;
    }
    let watchMoreStories = [];
    const filteredList = state.podcastListing.filter(e => e.storySlug != id);
    const _index = filteredList.findIndex(o => o.slug == id);
    if (_index > -1) {
      const count = [props?.initialData?.data?.category] == 'podcasts' ? (width < 768 ? 3 : 4) : 3;
      watchMoreStories = filteredList.slice().slice(_index + 1, _index + count);
    }
    return <NewPodcastDetailPage storyDetail={props?.initialData?.data} watchMoreStories={watchMoreStories} />;
  }

  if (!!state.audioCategories && !!state.audioCategories.length) {
    const isCategoryAvailable = state.audioCategories.filter(o => o.category == id);

    if (!isCategoryAvailable.length && !!id) {
      return <NotFoundPage />;
    }
  }

  const renderPodcastList = () => {
    const storyArr = state.podcastListing;
    if (!!storyArr && !!storyArr.length) {
      return storyArr
        .filter(v => v.storyHeading.toLowerCase().includes(searchString.toLowerCase()))
        .map((audioStory, index) => (
          <CardAudio
            colSize={storyArr.length > 3 ? 3 : 4}
            clickBtn={clickBtn}
            play={play}
            cardId={audioStory.slug}
            screenName={SCREEN_NAME.homePage}
            audioStory={audioStory}
            key={index}
          />
        ));
    }
  };

  let storySlug = id;

  if (!!state.podcastListing && !!state.podcastListing.length && !!id && !state.storyListLoading) {
    const storySlugArr = state.podcastListing.filter(o => o.storySlug == id);
    if (!!storySlugArr && !!storySlugArr.length) {
      storySlug = storySlugArr[0].storyType;
    } else {
      storySlug = '';
    }
  }

  const hideBanner = searchParams.get('hideBanner') === 'yes';

  const handleBackClick = (e) => {
    e.preventDefault();
    router.replace(state.isHindi ? '/hindi/podcasts' : '/podcasts');
    // router.back()
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
      {!state.isiFrameView && !hideBanner && (
        <ErrorBoundary>
          <StoriesPageBanner
            filterStoryListing={event => setSearchString(event.target.value)}
            storyListTitle='Podcast'
            homePara={`Listen to Audio Stories of Indian ${id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())}  Professionals, Startups & Businesses`}
            isiFrameView={state.isiFrameView}
            storySlug={storySlug}
          // Pass other props if needed
          />
        </ErrorBoundary>
      )}

      <div className='container-fluid podcastlist-container'>
        {state.storyListLoading ? <PHCardLoader /> : <div className='row'>{renderPodcastList()}</div>}
      </div>
      {!!state.audioCategories && !!state.audioCategories.length && (
        <ErrorBoundary>
          <StoriesPageCategories
            categoryType='podcasts'
            fetchStoryListing={(category) => dispatch(fetchPodcastListing(category))}
            categoryId={id}
            categories={state.audioCategories}
            blogs={state}
          />
        </ErrorBoundary>
      )}
      <ErrorBoundary>
        <StoryDetailPageFooterNew />
      </ErrorBoundary>
      <div style={{ width: 0, height: 0, fontSize: 0, opacity: 0, pointerEvents: 'none' }}>
        <h1 style={{ width: 0, height: 0, fontSize: 0 }}>{state.isHindi ? `पॉडकास्ट कैटेगरीज़: भारतीय प्रोफेशनल्स की प्रेरक कहानियाँ ब्राउज़ करें और सुनें। ` : `Listen to Audio Stories of ${id
          .replace(/-/g, ' ')
          .replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} Professionals, Startups & Businesses`}</h1>
        <h2 style={{ width: 0, height: 0, fontSize: 0 }}>{state.isHindi ? `वर्कमोब पॉडकास्ट को कैटेगरी (श्रेणी) के अनुसार ब्राउज़ करें और भारत के प्रोफेशनल्स, बिज़नेस ओनर्स, स्टार्टअप्स और सोशल वर्कर्स की प्रेरक व्यक्तिगत कहानियां सुनें।` : `Hear inspiring personal, career journey and business brand stories of ${id
          .replace(/-/g, ' ')
          .replace(/^(.)|\s+(.)/g, c =>
            c.toUpperCase()
          )} professionals, startups & business owners from India.`}</h2>
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

export default PodcastDetailPage;

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