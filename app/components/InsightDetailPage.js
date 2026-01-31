// app/insights/[slug]/client.js
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useParams, useSearchParams, useRouter } from 'next/navigation';
import InsightDetailPageBanner from '../components/InsightDetail/InsightDetailPageBanner';
import InsightDetailPageContent from '../components/InsightDetail/InsightDetailPageContent';
import InsightDetailPageWatchMore from '../components/InsightDetail/InsightDetailPageWatchMore';
import ErrorBoundary from '../components/ErrorBoundry';
import { useSelector, useDispatch } from 'react-redux';
import { INSIGHT_LIST, HOST } from '../constants/localString';
import { SCREEN_NAME, EVENT_TYPE } from '../constants/firebaseString';
import { getCookie } from '../utils';
import { trackScreen, customEvent } from '../firebase/firebase';
import { fetchInsightListing } from '../lib/features/blogSlice';
import Link from 'next/link';
import CardInsight from './common/CardInsight';
import ListTitle from './common/ListTitle';
import StoryDetailPageFooterNew from '../components/StoryDetail/StoryDetailPageFooterNew';
import CustomStyle from './common/CustomStyle';
import ReactHlsPlayer from './HSL/components/react-hls-player';

const InsightDetailPage = (props) => {
  const pathname = usePathname();
  const params = useParams();
  const decodedId = decodeURIComponent(params.id);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search');
  const [navType, setNavType] = useState('fixedNav');
  const [userInfo, setUserInfo] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  let storyDetail;
  let watchMoreStories = [];
  const state = useSelector((state) => state.blog);
  const router = useRouter();
  const homePageBackground = useRef();

  useEffect(() => {
    dispatch(fetchInsightListing());
  }, []);

  useEffect(() => {
    if (!state?.insightListing || !params?.id) {
      setFilteredData([]);
      return;
    }

    const filtered = state.insightListing.filter(o => {
      if (!o?.storySlug || typeof o.storySlug !== 'string') return false;
      const transformed = o.storySlug.toLowerCase().trim().replace(/ /g, '-');
      return transformed === decodedId;
    });

    setFilteredData(filtered);
  }, [state?.insightListing, params?.id]);


  if (props.initialData && props.initialData.filter((e) => e.slug === params.id).length) {
    storyDetail = props.initialData.filter((e) => e.slug === params.id)[0];
    watchMoreStories = [];
    const _watchMoreArr = props.initialData;
    const _index = _watchMoreArr.findIndex((o) => o.slug === params.id);
    if (_index > -1) {
      const count = storyDetail.category === 'stories' ? (width < 768 ? 3 : 4) : 3;
      watchMoreStories = _watchMoreArr.slice().slice(_index + 1, _index + count);
    }
    // return <InsightDetailPage storyDetail={storyDetail} watchMoreStories={watchMoreStories} />;
  }



  React.useEffect(() => {
    window.scrollTo(0, 0);
    trackScreen(SCREEN_NAME.insightDetail);
  }, []);

  const prevPath = React.useRef(pathname);
  React.useEffect(() => {
    if (prevPath.current !== pathname) {
      window.scrollTo(0, 0);
      if (!!storyDetail) {
        articleViewEvent(storyDetail);
      }
    }
    prevPath.current = pathname;
  }, [pathname, storyDetail]);

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
    // Update title
    document.title = filteredData?.length > 0 ? `${params.id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Watch Insights & Read Articles` : `${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Read and Watch Insights`;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', filteredData?.length > 0 ? `Read and watch thoughts, insights and articles on ${params.id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} to help you grow.` : `Read and watch insights on ${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())}.`);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = filteredData?.length > 0 ? `Read and watch thoughts, insights and articles on ${params.id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} to help you grow.` : `Read and watch insights on ${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())}.`;
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
    updateOrCreateMeta('og:title', filteredData?.length > 0 ? `${params.id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Watch Insights & Read Articles` : `${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Read and Watch Insights`);
    updateOrCreateMeta('og:description', filteredData?.length > 0 ? `Read and watch thoughts, insights and articles on ${params.id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} to help you grow.` : `Read and watch insights on ${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())}.`);
    updateOrCreateMeta('og:url', HOST + pathname);
    updateOrCreateMeta('og:image', INSIGHT_LIST.ogImage);
    updateOrCreateMeta('og:site_name', INSIGHT_LIST.siteName);
    // Update Twitter tags
    updateOrCreateMeta('twitter:title', filteredData?.length > 0 ? `${params.id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Watch Insights & Read Articles` : `${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} | Read and Watch Insights`);
    updateOrCreateMeta('twitter:description', filteredData?.length > 0 ? `Read and watch thoughts, insights and articles on ${params.id.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} to help you grow.` : `Read and watch insights on ${decodedId.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase())}.`);
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
  }, [pathname, filteredData]);

  const articleViewEvent = (storyDetail) => {
    customEvent(EVENT_TYPE.articleView, {
      slug: storyDetail?.slug,
      category: storyDetail?.category,
      heading: storyDetail?.storyHeading,
      type: storyDetail?.storyType,
    });
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    router.push(state.isHindi ? '/hindi/insights' : '/insights');
    // router.back()
  }

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
            <ShareStoryButton userInfo={userInfo} isHindi={state.isHindi} />
          </div>
        </nav>
        <nav
          className='d-flex d-md-none'
          style={{ ...styles.headerMobile, width: 'calc(100% - 44px)' }}
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
      <div className="container">
        {filteredData?.length > 0 ?
          <div style={{ zIndex: 7 }} className='container mt-3 mt-md-5 pt-md-5 position-relative'>
            <div className='row'>
              <div className='col-sm-12'>
                <ListTitle title={params.id === 'personalbranding' ? 'Personal Branding' : decodedId} />
                <div className='row'>
                  {filteredData?.map((insight, index) => (
                    <CardInsight screenName={SCREEN_NAME.insightList} insight={insight} key={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          :
          <>
            <ErrorBoundary>
              <InsightDetailPageBanner storyDetail={storyDetail} />
            </ErrorBoundary>
            <ErrorBoundary>
              <InsightDetailPageContent storyDetail={storyDetail} />
            </ErrorBoundary>
            {!!watchMoreStories.length && (
              <ErrorBoundary>
                <InsightDetailPageWatchMore watchMoreStories={watchMoreStories} />
              </ErrorBoundary>
            )}
          </>
        }
      </div>
      <ErrorBoundary>
        <StoryDetailPageFooterNew changeText={true} homepage={true} />
      </ErrorBoundary>
    </>
  );
};

export default InsightDetailPage;

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

const stylesCommon = `
  @media (max-width: 767px) {
    .siteHeader {
        position: sticky !important;
        position: -webkit-sticky !important;
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
