'use client';
import React, { useEffect, useState, useRef } from 'react';
import TagListBanner from './TagList/TagListBanner';
import CardInspiring from './common/CardInspiring';
import ErrorBoundary from './ErrorBoundry';
import { TAG_LIST, HOST } from '../constants/localString';
import { EVENT_TYPE, SCREEN_NAME } from '../constants/firebaseString';
import { customEvent, trackScreen } from '../firebase/firebase';
import { PHCardLoader } from './common/PlaceHolder';
import { fetchStoryTags, setIframeView, setHindiView } from '../lib/features/blogSlice';
import CloseBtn from './common/CloseBtn';
import { getCookie } from '../utils';
import Link from 'next/link';
import ReactHlsPlayer from './HSL';
import { useSelector, useDispatch } from 'react-redux';
import CustomStyle from './common/CustomStyle';
import StoryDetailPageFooterNew from './StoryDetail/StoryDetailPageFooterNew';
import TagListStoryVideo from './TagList/TagListStoryVideo';
import { useParams, usePathname, useSearchParams, useRouter } from 'next/navigation';

const TagDetailPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const singleCardRef = useRef();
  const state = useSelector(state => state.blog);
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search');
  const id = params.id; // Assuming the dynamic route is [id]
  const search = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const isTagsHome = /^(\/hindi)?\/tags\/?$/.test(pathname);
  const [trendingTags, setTrendingTags] = useState([]);
  const [tagSearch, setTagSearch] = useState('');
  const [storySearch, setStorySearch] = useState('');
  const [singleCardData, setSingleCardData] = useState({});
  const [newStoryArr, setNewStoryArr] = useState([]);
  const [navType, setNavType] = useState('fixedNav');
  const [userInfo, setUserInfo] = useState(null);
  const parts = pathname.split('/');
  const tagPageRef = useRef();

  const mountedRef = useRef(true);
  let storyListTitle = '';

  const toggleLanguage = (e) => {
    e.preventDefault();
    const newPath = !state.isHindi ? `/hindi/${parts[1]}/${parts[2]}` : `/${parts[2]}/${parts[3]}`;
    window.history.replaceState(null, "", newPath);
    dispatch(setHindiView(!state.isHindi));
  };

   useEffect(() => {
    if (pathname.startsWith('/hindi')) {
      dispatch(setHindiView(true));
    } else {
      dispatch(setHindiView(false));
    }
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch('https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/tags_bg_10_june')
      .then(res => res.json())
      .then(data => {
        if (mountedRef?.current) {
          const singleData = data?.data?.find(
            tag => tag?.tag_name?.replace(/ /g, '-')?.toLowerCase() === id?.toLowerCase()
          );
          singleCardRef.current = singleData;
          setSingleCardData(singleData);
          setTrendingTags(data);
        }
      });

    return () => {
      mountedRef.current = false;
    };
  }, [id]);

  const tagListDataEvent = () => {
    let value = pathname.split('/');
    value = value[value.length - 1];
    let searchItem = search.split('=');
    customEvent(EVENT_TYPE.tagView, {
      slug: value,
      category: 'tags-category',
      heading: value,
      type: 'tags-type',
      src: search ? searchItem[1] : 'blog',
    });
  };

  // useEffect(() => {
  //   if (id) {
  //     const category = id || 'top';
  //     tagListDataEvent();
  //     trackScreen(SCREEN_NAME.tagList);
  //     dispatch(fetchStoryTags(category));
  //     dispatch(setIframeView(search == '?hideBanner=yes' || state.isiFrameView ? true : false));
  //   }
  // }, [pathname, singleCardData]);

  useEffect(() => {
    if (id) {
      const category = id || 'top';
      tagListDataEvent();
      trackScreen(SCREEN_NAME.tagList);
      dispatch(fetchStoryTags(category));
      dispatch(setIframeView(search == '?hideBanner=yes' || state.isiFrameView ? true : false));
    }
  }, [singleCardData]);


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

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      localStorage.removeItem('searchValue');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const style = document.head.appendChild(document.createElement('style'));
    const tempStyle = `
      .tagListBanner {
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
      }
    `;

    if (isTagsHome) {
      style.textContent += tempStyle;
    } else {
      style.textContent.replace(tempStyle, '');
    }

    return () => document.head.removeChild(style);
  }, [pathname]);

  useEffect(() => {
    if (state.storyListing.length > 0) {
      const shuffle = function (o) {
        for (let i = o.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [o[i], o[j]] = [o[j], o[i]];
        }
        return o;
      };
      let newStoryListing = shuffle([...state.storyListing]);
      let number = 8;
      setNewStoryArr(newStoryListing.slice(0, number));
    }
  }, [state.storyListing]);


  const renderStoriesList = () => {
    const searchValue = storySearch.toLowerCase();

    const storyArr =
      searchValue.length > 2
        ? state.storyListing.filter(
          v =>
            v.name
              .toLowerCase()
              .split(' ')
              .some(v => v.startsWith(searchValue)) ||
            v.name.toLowerCase().startsWith(searchValue)
        )
        : newStoryArr;

    if (!!storyArr && !!storyArr.length) {
      return storyArr.map((story, index) => (
        <CardInspiring
          isHindi={state.isHindi}
          colSize={3}
          pageId={id}
          screenName={SCREEN_NAME.storyList}
          story={story}
          key={`${story.thumb}${index}`}
        />
      ));
    } else {
      return <h2 className='text-center f20 text-white w-100 z-index-1'>No stories found with "{searchValue}"</h2>;
    }
  };
   
  let pageTitle = state.isHindi ? `प्रेरक ${id
      .replace(/-/g, ' ')
      .replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} कहानियां देखें और प्रेरणा लें।` : `${id
        .replace(/-/g, ' ')
        .replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} Motivational People & Profiles | Watch Video Stories`;
  let pageDescription = state.isHindi ? `मोटिवेशनल ${id
      .replace(/-/g, ' ')
      .replace(/^(.)|\s+(.)/g, c =>
        c.toUpperCase()
      )} वीडियो कहानियों, लोगों और प्रोफाइल से देखें और सीखें। प्रेरणादायक पर्सनल, करियर जर्नी और बिज़नेस ब्रांड कहानियाँ सुनें।` : `Watch & learn from motivational ${id
        .replace(/-/g, ' ')
        .replace(/^(.)|\s+(.)/g, c =>
          c.toUpperCase()
        )} video stories, people and profiles. Hear inspiring personal, career journey and business brand stories. Meet and discover interesting people.`;

   const handleBackClick = (e) => {
    e.preventDefault();
    // router.push(state.isHindi ? '/hindi/tags' : '/tags');
    router.back();
  }

  useEffect(() => {
      // Update title
      document.title = pageTitle;
      // Update or create meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', pageDescription);
      } else {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        metaDesc.content = pageDescription;
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
      updateOrCreateMeta('og:title', pageTitle);
      updateOrCreateMeta('og:description', pageDescription);
      updateOrCreateMeta('og:url', HOST + pathname);
      updateOrCreateMeta('og:image', TAG_LIST.ogImage);
      updateOrCreateMeta('og:site_name', TAG_LIST.siteName);
      // Update Twitter tags
      updateOrCreateMeta('twitter:title', pageTitle);
      updateOrCreateMeta('twitter:description', pageDescription);
      updateOrCreateMeta('twitter:image', TAG_LIST.ogImage);
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
        playerRef={tagPageRef}
        className={`detailPageMainBackground`}
        url='https://cdn.workmob.com/stories_workmob/web_home/blank-bg-video-tag/blank-bg-video-tag.m3u8'
        poster='https://cdn.workmob.com/stories_workmob/images/common/blog_bg.jpg'
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
        src='https://cdn.workmob.com/stories_workmob/images/common/blog_bg.jpg'
      />
      <div className='container'>
        <div className='row justify-content-center pt-5'>
          <div className='col-lg-10 col-md-12 col-sm-12 col-12 mb-3'>
            <div className='topHeading text-center mt-5'>
              <h1 className='firstTitle'><span>{id.replace(/-/g, ' ').toUpperCase()}</span></h1>
              <h1 className='secondTitle'>Get your single branding page and unique QR code to showcase your work with the power of video.</h1>
            </div>
          </div>
          <div className='col-lg-9 col-md-10 col-sm-12 col-11'>
            <div className={`position-relative ${parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'tags' && parts[3] != undefined || parts[0] == '' && parts[1] == 'tags' && parts[2] != undefined ? 'mb-0' : 'mb-5'}`}>
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
      {!state.isiFrameView && search != '?hideBanner=yes' && (
        <ErrorBoundary>
          <TagListBanner
            isiFrameView={state.isiFrameView}
            storySlug={id}
            isTagsHome={isTagsHome}
            trendingTags={trendingTags}
            storyListing={state.storyListing}
            storySearch={storySearch}
            onStorySearchChange={value => setStorySearch(value)}
            storyListTitle={storyListTitle}
            singleCardData={singleCardRef.current}
            pageTitle={pageTitle}
            pageDescription={pageDescription}
          />
        </ErrorBoundary>
      )}

      <div style={{ width: '95%', maxWidth: '100%' }} className='container-fluid'>
        {state.storyListLoading ? (
          <PHCardLoader />
        ) : (
          <div className='row inspring-thumbs'>{renderStoriesList()}</div>
        )}

        {parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'tags' && parts[3] != undefined || parts[0] == '' && parts[1] == 'tags' && parts[2] != undefined ? <div className='row justify-content-center'>
          <div className='col-lg-8 col-md-12 col-sm-12 col-12'>
            <div className='bottomHeading text-center'>
              <h1 className='firstTitle'>Join <span>20k+ people</span> using Workmob to build their brand using the power of video introductions</h1>
            </div>
          </div>
          <div className='col-lg-8 col-md-12 col-sm-12 col-12'>
            <div className='d-flex bottomBranding'>
              <Link
                href='/merikahani'
                className={`btn font-weight-bold ${state.isHindi ? 'font-khand' : ''} btn-lg mx-auto px-5 brandingPageEffect`}
              >
                {state.isHindi ? 'कहानी शेयर करें' : 'Get your branding page'}
              </Link>
            </div>
          </div>
        </div> : null}
      </div>
      <StoryDetailPageFooterNew changeText={true} homepage={true} />
    </>
  );
};

export default TagDetailPage;

// The styles and styleString remain the same
const styleString = `

  .TagListPage-tagName {
    // text-transform: capitalize;
    font-weight: 500;
    font-size: 45px;
  }

  .topHeading {
    color: #fff;
  }

  .topHeading .firstTitle {
    font-family: Montserrat, sans-serif;
    font-weight: bold;
    font-size: 28px;
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
      font-size: 13px;
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
      font-size: 12px;
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
      font-size: 15px;
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
  .bottomHeading {
    color: #fff;
}
.detailPageMainBackground {
  position: fixed;
  min-height: 100%;
  min-width: 100%;
  object-fit: cover;
  top: 0;
}
.detailPageBackgroundImage {
  position: fixed;
  min-height: 100%;
  min-width: 100%;
  top: 0;
  width: 200px;
  object-fit: cover;
}
.z-index-1 {
  z-index: 1;
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
