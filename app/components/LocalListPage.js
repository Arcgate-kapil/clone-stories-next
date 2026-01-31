'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, usePathname, useSearchParams, useRouter } from 'next/navigation';
import StoriesPageBanner from '../components/Stories/StoriesPageBanner';
import StoriesPageCategories from '../components/Stories/StoriesPageCategories';
import ErrorBoundary from '../components/ErrorBoundry';
import { SCREEN_NAME } from '../constants/firebaseString';
import { trackScreen } from '../firebase/firebase';
import { LOCAL_LIST_PAGE, HOST } from '../constants/localString';
import { fetchCity, fetchCategories, fetchStoryListing, fetchStoryListingByLocation, fetchAllListingByLocation, setIframeView, filterStoryListing, filterAllStoryListing, setLayoverPlayBtn, fetchMasterListing, setHindiView } from '../lib/features/blogSlice';
import { useSelector, useDispatch } from 'react-redux';
import StoryDetailPageFooterNew from '../components/StoryDetail/StoryDetailPageFooterNew';
import CustomStyle from '../components/common/CustomStyle';

const LocalListPage = (props) => {
  const state = useSelector((state) => state.blog);
  let dispatch = useDispatch();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const id = params.id; // Assuming the route is [id].js or similar
  const search = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const [storyArr, setStoryArr] = useState([]);
  const sessionStorageRef = useRef(true);
  const uniqueData = useRef(null);
  const [customSearchValue, setCustomSearchValue] = useState('');
  let storyListTitle = '';
  let homePara = '';
  const parts = pathname.split('/');
  const [urlExists, setUrlExists] = useState(null);
  const [voicesUrlExists, setVoicesUrlExists] = useState(null);

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
    }

    dispatch(setIframeView(search == '?hideBanner=yes' || state.isiFrameView ? true : false));

    dispatch(fetchCity());
    dispatch(fetchCategories());
  }, [pathname]);

  const prevPath = useRef(pathname);
  // useEffect(() => {
  //   if (prevPath.current != pathname && !!id) {
  //     window.scrollTo(0, 0);
  //   }
  // }, [pathname]);

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

  useEffect(() => {
    // Update title
    document.title = state.isHindi ? LOCAL_LIST_PAGE.title_hi : LOCAL_LIST_PAGE.title;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', state.isHindi ? LOCAL_LIST_PAGE.description_hi : LOCAL_LIST_PAGE.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = state.isHindi ? LOCAL_LIST_PAGE.description_hi : LOCAL_LIST_PAGE.description;
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
    updateOrCreateMeta('og:title', state.isHindi ? LOCAL_LIST_PAGE.title_hi : LOCAL_LIST_PAGE.title);
    updateOrCreateMeta('og:description', state.isHindi ? LOCAL_LIST_PAGE.description_hi : LOCAL_LIST_PAGE.description);
    updateOrCreateMeta('og:url', HOST + pathname);
    updateOrCreateMeta('og:image', LOCAL_LIST_PAGE.ogImage);
    updateOrCreateMeta('og:site_name', LOCAL_LIST_PAGE.siteName);
    // Update Twitter tags
    updateOrCreateMeta('twitter:title', state.isHindi ? LOCAL_LIST_PAGE.title_hi : LOCAL_LIST_PAGE.title);
    updateOrCreateMeta('twitter:description', state.isHindi ? LOCAL_LIST_PAGE.description_hi : LOCAL_LIST_PAGE.description);
    updateOrCreateMeta('twitter:image', LOCAL_LIST_PAGE.ogImage);
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

      <ErrorBoundary>
        <StoriesPageCategories
          fetchStoryListingByLocation={fetchStoryListingByLocation}
          fetchStoryListing={fetchStoryListing}
          categoryId={id}
          categories={state.categories}
          blogs={state.blogs}
          locationList={state.locationList}
        />
      </ErrorBoundary>
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

export default LocalListPage;