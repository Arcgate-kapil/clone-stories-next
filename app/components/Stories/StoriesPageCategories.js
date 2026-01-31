'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import StoriesPageCategoryGrid from './StoriesPageCategoryGrid';
import { ORANGE_1, WHITE, GREEN, ORANGE } from '../../constants/colors';

const StoriesPageCategories = ({
  locationList,
  categories = [],
  categoryType = 'voices',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const id = params?.id; // Assuming this is in a dynamic route like /[id]
  const state = useSelector(state => state.blog);
  const localLatest = '/local/jaipur';

  const [showCategory, setShowCategory] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [categoryActive, setCategoryActive] = useState(false);
  const [locationActive, setLocationActive] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  function closeOverlay(type) {
    if (type === 'location') {
      setShowLocation(false);
    } else if (type === 'category') {
      setShowCategory(false);
    }
  }

  function closeBtnAction(type) {
    closeOverlay(type);
    // router.back(); // Use router.back() instead of window.history.back()
    router.push(state.isHindi ? '/hindi' : '/');
  }

  useEffect(() => {
    if (/^(?:\/hindi)?\/local\/?$/.test(pathname)) {
      setShowLocation(true);
    } else if (/^(?:\/hindi)?\/categories\/?$/.test(pathname)) {
      setShowCategory(true);
    } else {
      setShowLocation(false);
      setShowCategory(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (showLocation) {
      const path = state.isHindi ? '/hindi/local' : '/local';
      if (pathname !== path) {
        router.push(path); // Use router.push instead of window.history.pushState
      }
    } else if (showCategory && !pathname.includes('/podcasts') && !pathname.includes('/categories')) {
      const path = state.isHindi ? '/hindi/categories' : '/categories';
      if (pathname !== path) {
        router.push(path);
      }
    }
  }, [showLocation, showCategory, pathname, router, state.isHindi]);

  useEffect(() => {
    if (!!categories.length) {
      if (!id || pathname === localLatest) {
        setCategoryActive(false);
        setLocationActive(false);
      } else {
        if (pathname.includes('/local/')) {
          setLocationActive(true);
          setCategoryActive(false);
        } else {
          setCategoryActive(true);
          setLocationActive(false);
        }
      }
    }
  }, [id, pathname, categories.length, localLatest]);

  return (
    <>
      {!id && !pathname.includes('/categories') && (
        <small className='d-block btnViewMore text-center z-index-1 position-relative'>
          <div
            style={styles.btn}
            onClick={() => setShowCategory(true)}
            className={`btn font-weight-bold btn-lg mx-auto my-3 px-5 ${state.isHindi ? 'font-khand' : ''}`}
          >
            {state.isHindi ? 'और खोजें' : 'Explore more'}
          </div>
        </small>
      )}
      <section
        className='fixed-bottom px-1  px-md-0 py-3 categoryContainer text-center'
        style={{ overflow: 'visible' }}
      >
        <div className='category-container py-2 py-md-3 px-md-3  px-2 m-auto small'>
          <div className='d-flex align-items-center justify-content-start  justify-content-md-center'>
            <Link
              className={`mr-2 px-3 p-2 ${
                (!id || pathname === localLatest) ? `bg-black text-red font-weight-bold` : `text-white`
              } rounded-pill text-capitalize font-12 text-nowrap`}
              href={(state.isHindi ? '/hindi' : '') + (pathname.includes('/local') ? localLatest : `/${categoryType}`)}
            >
              Latest
            </Link>
            {!!locationList && !!locationList.length && (
              <div className='position-relative'>
                <span
                  onClick={() => setShowLocation(true)}
                  className={`moreBtn cursor-pointer ${
                    locationActive ? 'bg-black text-red font-weight-bold' : 'text-white'
                  } ${
                    showLocation ? 'arrow-up downArrow' : ''
                  }  mr-2 p-2 px-3 rounded-pill  text-capitalize font-12 text-nowrap`}
                >
                  By city
                </span>
                {showLocation && (
                  <StoriesPageCategoryGrid
                    searchString={searchLocation}
                    updateSearchString={event => setSearchLocation(event.target.value)}
                    locationList={locationList}
                    closeOverlay={() => closeOverlay('location')}
                    closeBtnAction={() => closeBtnAction('location')}
                  />
                )}
              </div>
            )}
            {!!categories && !!categories.length && (
              <div className='position-relative'>
                <span
                  onClick={() => setShowCategory(true)}
                  className={`moreBtn cursor-pointer ${
                    categoryActive ? 'bg-black text-red font-weight-bold' : 'text-white'
                  } ${
                    showCategory ? 'arrow-up downArrow' : ''
                  }  mr-2 p-2 px-3 rounded-pill text-capitalize font-12 text-nowrap`}
                >
                  By category
                </span>
                {showCategory && (
                  <StoriesPageCategoryGrid
                    searchString={searchCategory}
                    updateSearchString={event => setSearchCategory(event.target.value)}
                    categoryList={categories.slice(1)}
                    closeOverlay={() => closeOverlay('category')}
                    closeBtnAction={categoryType === 'voices' && (() => closeBtnAction('category'))}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default StoriesPageCategories;

const styles = {
  text1: {
    fontSize: 80,
    color: ORANGE_1,
    fontFamily: 'Alata',
  },
  text2: {
    fontSize: 80,
    color: WHITE,
    fontFamily: 'Alata',
  },
  text3: {
    fontSize: 80,
    color: GREEN,
    fontFamily: 'Alata',
  },
  caption: {
    lineHeight: 1,
    fontSize: '3.8vw',
  },
  subTitle: {
    opacity: 0.9,
    color: WHITE,
    lineHeight: 1,
    fontSize: '3.4vw',
  },
  divider: {
    width: 50,
    height: 6,
    margin: '45px auto 16px auto',
    backgroundColor: ORANGE,
  },
  overlay: {
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  btn: {
    color: WHITE,
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    backgroundPosition: 'center',
    borderRadius: 100,
  },
};
