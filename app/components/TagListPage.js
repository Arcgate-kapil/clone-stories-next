'use client';
import React, { useEffect, useState, useRef } from 'react';
import TagListBanner from '../components/TagList/TagListBanner';
import ErrorBoundary from '../components/ErrorBoundry';
import { TAG_LIST, HOST } from '../constants/localString';
import { EVENT_TYPE, SCREEN_NAME } from '../constants/firebaseString';
import { customEvent, trackScreen } from '../firebase/firebase';
import { fetchStoryTags, setIframeView, setHindiView, fetchInsightListing } from '../lib/features/blogSlice';
import CloseBtn from '../components/common/CloseBtn';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import CustomStyle from '../components/common/CustomStyle';
import StoriesOverlayCat from './Stories/StoriesOverlayCat';
import StoryDetailPageFooterNew from '../components/StoryDetail/StoryDetailPageFooterNew';
import TagListStoryVideo from '../components/TagList/TagListStoryVideo';
import { getCookie } from '../utils';
import { useParams, usePathname, useSearchParams, useRouter } from 'next/navigation';

const TagListPage = () => {
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
  const [userInfo, setUserInfo] = useState(null);
  const [tagSearch, setTagSearch] = useState('');
  const [storySearch, setStorySearch] = useState('');
  const [singleCardData, setSingleCardData] = useState({});
  const [newStoryArr, setNewStoryArr] = useState([]);
  const [navType, setNavType] = useState('fixedNav');
  const [overlayCat, setoverlayCat] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');
  const [openLayout, setOpenLayout] = useState(false);
  const parts = pathname.split('/');
  let filteredTags = [];

  const mountedRef = useRef(true);
  let storyListTitle = '';

  const toggleLanguage = (e) => {
    e.preventDefault();
    const newPath = !state.isHindi ? `/hindi/${parts[1]}` : `/${parts[2]}`;
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
        // if (mountedRef?.current) {
        const singleData = data?.data?.find(
          tag => tag?.tag_name?.replace(/ /g, '-')?.toLowerCase() === id?.toLowerCase()
        );
        singleCardRef.current = singleData;
        setSingleCardData(singleData);
        setTrendingTags(data?.data);
        // }
      });

    return () => {
      mountedRef.current = false;
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

  useEffect(() => {
    if (id) {
      const category = id || 'top';
      tagListDataEvent();
      trackScreen(SCREEN_NAME.tagList);
      dispatch(fetchStoryTags(category));
      dispatch(setIframeView(search == '?hideBanner=yes' || state.isiFrameView ? true : false));
    }
  }, [pathname, singleCardData]);

  useEffect(() => {
    dispatch(fetchInsightListing());
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

  let pageTitle = !!id
    ? state.isHindi ? `प्रेरक ${id
      .replace(/-/g, ' ')
      .replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} कहानियां देखें और प्रेरणा लें।` : `Watch & Learn from Motivational ${id
        .replace(/-/g, ' ')
        .replace(/^(.)|\s+(.)/g, c => c.toUpperCase())} Video Stories`
    : state.isHindi ? TAG_LIST.title_hi : TAG_LIST.title;
  let pageDescription = !!id
    ? state.isHindi ? `${id
      .replace(/-/g, ' ')
      .replace(/^(.)|\s+(.)/g, c =>
        c.toUpperCase()
      )} टैग की गई प्रेरक वीडियो कहानियां देखें और सीखें।` : `Watch & learn from motivational ${id
        .replace(/-/g, ' ')
        .replace(/^(.)|\s+(.)/g, c =>
          c.toUpperCase()
        )} video stories. Hear inspiring personal, career journey and business brand stories. Meet and discover interesting people.`
    : state.isHindi ? TAG_LIST.description_hi : TAG_LIST.description;

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    // Update title
    document.title = state.isHindi ? TAG_LIST.title_hi : TAG_LIST.title;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', state.isHindi ? TAG_LIST.description_hi : TAG_LIST.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = state.isHindi ? TAG_LIST.description_hi : TAG_LIST.description;
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
    updateOrCreateMeta('og:title', state.isHindi ? TAG_LIST.title_hi : TAG_LIST.title);
    updateOrCreateMeta('og:description', state.isHindi ? TAG_LIST.description_hi : TAG_LIST.description);
    updateOrCreateMeta('og:url', HOST + pathname);
    updateOrCreateMeta('og:image', TAG_LIST.ogImage);
    updateOrCreateMeta('og:site_name', TAG_LIST.siteName);
    // Update Twitter tags
    updateOrCreateMeta('twitter:title', state.isHindi ? TAG_LIST.title_hi : TAG_LIST.title);
    updateOrCreateMeta('twitter:description', state.isHindi ? TAG_LIST.description_hi : TAG_LIST.description);
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

  const handleBackClick = (e) => {
    e.preventDefault();
    router.push(state.isHindi ? '/hindi' : '/');
    // router.back();
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

      <div style={styles.container}>
        <h1 className='TagListPage-para'>
          Discover motivational personal & business stories by popular tags
        </h1>
        <div className='search-box my-3 text-center TagListPage-searchBar'>
          <div className='input-group mb-3 input-group-lg'>
            <input
              value={tagSearch}
              onChange={event => setTagSearch(event.target.value)}
              placeholder='Search tag'
              type='text'
              className='form-control mx-auto'
            />
            <i className='icon icon-icon-search-new'></i>
          </div>
        </div>
        <div className={`TagListPage-trendingTags`}>
          {(() => {
            filteredTags = trendingTags.filter(v =>
              v.tag_name.toLowerCase().includes(tagSearch.toLowerCase())
            );

            if (filteredTags.length === 0) {
              return <><span></span> <span style={{ color: '#fff', textAlign: 'center', marginBottom: 0, fontSize: '21px' }}>No Data Exist</span> <span></span></>;
            }

            return filteredTags.map((v, index) => (
              <Link key={index} href={state.isHindi ? `/hindi/tags/${v.tag_name.toLowerCase().replace(/ /g, '-')}` : `/tags/${v.tag_name.toLowerCase().replace(/ /g, '-')}`}>
                <img
                  style={styles.trendingImg}
                  src={state.isHindi ? v.small_background_img_hindi : v.small_background_img}
                  alt={`${v.tag_name} image`}
                />
              </Link>
            ));
          })()}
          {/* {trendingTags
            .filter(v => v.tag_name.toLowerCase().includes(tagSearch.toLowerCase()))
            .map((v, index) => (
              <Link key={index} href={`/tags/${v.tag_name.toLowerCase().replace(/ /g, '-')}`}>
                <img
                  style={styles.trendingImg}
                  src={state.isHindi ? v.small_background_img_hindi : v.small_background_img}
                  alt={`${v.tag_name} image`}
                />
              </Link>
            ))} */}
        </div>
      </div>

      {!isTagsHome
        ? singleCardRef.current && (
          <ErrorBoundary>
            <TagListStoryVideo singleCardData={singleCardRef} trendingTags={trendingTags} />
          </ErrorBoundary>
        )
        : null}
      <StoryDetailPageFooterNew changeText={true} homepage={true} />
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

export default TagListPage;

// The styles and styleString remain the same
const styleString = `
  .TagListPage-para {
    color: #fff;
    font-size: 1.8em;
    text-align: center;
    max-width: 1000px;
    margin: 0.31em auto 1em;
    font-family: 'Montserrat', sans-serif;
  }

  .TagListPage-searchBar {
    max-width: 700px;
    margin: 0 auto;
  }

  .TagListPage-trendingTags {
    max-width: 1200px;
    margin: 4em auto 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2em;
  }

  .TagListPage-tagName {
    // text-transform: capitalize;
    font-weight: 500;
    font-size: 45px;
  }

  @media(max-width: 770px) {
    .TagListPage-para {
      font-size: 1.2em;
    }
  }

  @media (max-width: 675px) {
    .TagListPage-trendingTags {
      grid-template-columns: 1fr 1fr;
      gap: 1em;
      margin-top: 1.5em;
    }
  }

  @media (min-width: 475px) and (max-width: 576px) {
    .bottomHeading .firstTitle {
      font-size: 17px !important;
      margin-top: 30px !important;
    }
  }

  @media (max-width: 475px) {
    .bottomHeading .firstTitle {
      font-size: 16px !important;
      margin-top: 30px !important;
    }

    .detailFooter-madeWithLove {
      font-size: 11px !important;
  }
  }
  @media (min-width: 576px) and (max-width: 768px) {
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
  .bottomHeading {
    color: #fff;
}
.z-index-1 {
  z-index: 1;
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
`;

const styles = {
  meriKahani: {
    font: '5vw Alata',
    textAlign: 'center',
  },
  container: {
    margin: '0 1em',
  },
  trendingImg: {
    width: '100%',
    borderRadius: '1vw',
  },
  paddingAll: {
    paddingTop: '55%',
    borderRadius: '39px',
    background: '#000'
  },


  // oiljrlgjk;l new 
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
