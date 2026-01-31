'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import StoriesPageCategories from '../components/Stories/StoriesPageCategories';
import ErrorBoundary from '../components/ErrorBoundry';
import { SCREEN_NAME } from '../constants/firebaseString';
import { trackScreen } from '../firebase/firebase';
import { CATEGORY_LIST_PAGE, HOST } from '../constants/localString';
// import NotFoundPage from './NotFoundPage';
import { fetchCategories, fetchStoryListing, fetchStoryListingByLocation } from '../lib/features/blogSlice';
import { useSelector, useDispatch } from 'react-redux';
// import CustomStyle from '../components/common/CustomStyle';

const CategoriesListPage = (props) => {
  const state = useSelector((state) => state.blog);
  let dispatch = useDispatch();
  const pathname = usePathname();
  const params = useParams();
  const id = params.id; // Assuming the route is [id].js or similar

  useEffect(() => {
    return () => {
      sessionStorage.setItem('lastScroll', window.scrollY);
    };
  }, []);


  useEffect(() => {
    trackScreen(SCREEN_NAME.storyList);
    dispatch(fetchCategories());
  }, [pathname]);

  const prevPath = useRef(pathname);
  useEffect(() => {
    if (prevPath.current != pathname && !!id) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  if (!!state.categories && !!state.categories.length) {
    const isCategoryAvailable = state.categories.filter(o => o.category == id);

    // if (!isCategoryAvailable.length && !!id) {
    //   return <NotFoundPage />;
    // }
  }

  useEffect(() => {
    // Update title
    document.title = state.isHindi ? CATEGORY_LIST_PAGE.title_hi : CATEGORY_LIST_PAGE.title;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', state.isHindi ? CATEGORY_LIST_PAGE.description_hi : CATEGORY_LIST_PAGE.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = state.isHindi ? CATEGORY_LIST_PAGE.description_hi : CATEGORY_LIST_PAGE.description;
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
    updateOrCreateMeta('og:title', state.isHindi ? CATEGORY_LIST_PAGE.title_hi : CATEGORY_LIST_PAGE.title);
    updateOrCreateMeta('og:description', state.isHindi ? CATEGORY_LIST_PAGE.description_hi : CATEGORY_LIST_PAGE.description);
    updateOrCreateMeta('og:url', HOST + pathname);
    updateOrCreateMeta('og:image', CATEGORY_LIST_PAGE.ogImage);
    updateOrCreateMeta('og:site_name', CATEGORY_LIST_PAGE.siteName);
    // Update Twitter tags
    updateOrCreateMeta('twitter:title', state.isHindi ? CATEGORY_LIST_PAGE.title_hi : CATEGORY_LIST_PAGE.title);
    updateOrCreateMeta('twitter:description', state.isHindi ? CATEGORY_LIST_PAGE.description_hi : CATEGORY_LIST_PAGE.description);
    updateOrCreateMeta('twitter:image', CATEGORY_LIST_PAGE.ogImage);
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
      {/* <CustomStyle>{styleString}</CustomStyle> */}
      <ErrorBoundary>
        <StoriesPageCategories
          categories={state.categories}
        />
      </ErrorBoundary>
    </>
  );
};

// const styleString = `
// `;

export default CategoriesListPage;