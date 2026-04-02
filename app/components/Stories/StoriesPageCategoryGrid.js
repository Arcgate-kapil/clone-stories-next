'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import CloseBtn from '../common/CloseBtn';
import CustomStyle from '../common/CustomStyle';
import useWindowSize from '../../utils/useWindowSize';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchCity, fetchCityNew } from '@/app/lib/features/blogSlice';

function StoriesPageCategoryGrid({
  searchString,
  updateSearchString,
  locationList,
  categoryList,
  closeOverlay,
  closeBtnAction,
}) {
  const state = useSelector(state => state.blog);
  const pathname = usePathname();
  const isLocationList = Array.isArray(locationList);
  // const [filteredList, setFilteredList] = useState(isLocationList ? locationList : categoryList);
  const [filteredList, setFilteredList] = useState([]);
  let dispatch = useDispatch();
  const { width } = useWindowSize();

  useEffect(() => {
    if (isLocationList) {
      setFilteredList(locationList);
    } else {
      setFilteredList(categoryList);
    }
  }, [locationList]);

  function sortList(a, b) {
    const nameA = a[isLocationList ? 'location' : 'category'].toUpperCase();
    const nameB = b[isLocationList ? 'location' : 'category'].toUpperCase();

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    }

    return 0;
  }

  function handleInputChange(event) {
    const value = event.target.value;

    updateSearchString(event);

    if (isLocationList) {
      setFilteredList(
        locationList.filter(location =>
          value ? location.id.includes(value.toLowerCase()) : true
        )
      );
    } else {
      setFilteredList(
        categoryList.filter(category =>
          value ? category.category.includes(value.toLowerCase()) : true
        )
      );
    }
  }

  useEffect(() => {
    const waveBtnList = document.querySelectorAll('.waveBtn');
    const style = document.head.appendChild(document.createElement('style'));

    style.textContent = `
      body {
        overflow: hidden;
      }
    `;

    waveBtnList.forEach(v => {
      const closeBtnWave = v.querySelector('.closeBtnWave');

      if (closeBtnWave.style.backgroundColor !== 'rgb(195, 61, 235)') {
        v.classList.add('bottomCloseBtn');
      }
    });

    return () => document.head.removeChild(style);
  }, []);

  const loadMore = () => {
    if (state.hasMore) {
      dispatch(fetchCityNew(state.lastKey));
    }
  };

  return (
    <div className='categories-optionsOverlay'>
      <CustomStyle>{styleString}</CustomStyle>
      <div className='categories-head'>
        {isLocationList ? (
          <>
            <h2 className='categories-headTitle'>Discover your city</h2>
            <p className='categories-headLocationPara'>
              Meet local professionals, business owners, startups, and more
            </p>
          </>
        ) : (
          <h2 className='categories-headTitle categories-categoryTitle'>
            <span>Browse & discover Indian professionals, business </span>
            <span>owners, and more by industry</span>
          </h2>
        )}
      </div>
      <div className='categories-search'>
        <i className='categories-searchIcon icon-icon-search-new'></i>
        <input
          className='categories-optionsInput'
          placeholder={isLocationList ? 'Search City' : 'Search Category'}
          value={searchString}
          onChange={handleInputChange}
        />
      </div>
      <CloseBtn
        closeModalOnly={true}
        handleClick={closeBtnAction ? closeBtnAction : closeOverlay}
        bgColor='rgb(195, 61, 235)'
      />
      <div id="scrollableCategories" className='noScrollbar categories-gridContainer'>
        <InfiniteScroll
          dataLength={filteredList?.length}
          next={loadMore}
          hasMore={state.hasMore}
          scrollableTarget="scrollableCategories"
        >
          {isLocationList ? (
            <div className='categories-topRow' style={{ display: searchString ? 'none' : '' }}>
              {filteredList.slice(0, 5).map((location, i) => (
                <Link
                  className='categories-locationLink'
                  href={`${state.isHindi ? '/hindi' : ''}/local/${location.id.replace(/_/g, '-')}`}
                  key={i}
                  onClick={closeOverlay}
                >
                  <img
                    className='categories-optionsImage'
                    src={`https://cdn.workmob.com/stories_workmob/images/${state.isHindi ? 'hindi_' : ''
                      }locations/${location.id}.png`}
                    alt={`${location.id} image`}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div
              className='categories-topRow categories-categoryTopRow'
              style={{ display: searchString ? 'none' : '' }}
            >
              {filteredList.slice(0, 5).map((category, index) => (
                <Link
                  className='categories-categoryLink'
                  style={styles.optionLink}
                  onClick={closeOverlay}
                  key={index}
                  href={`${pathname.includes('/podcasts') ? '/podcasts' : `${state.isHindi ? '/hindi' : ''}/voices`
                    }/${category.category}`}
                >
                  <img
                    className='categories-optionsImage'
                    src={`https://cdn.workmob.com/stories_workmob/images/category-bg/${category.category}.png`}
                    alt={`${category.category} image`}
                  />
                </Link>
              ))}
            </div>
          )}

          <div
            style={
              isLocationList
                ? { gridTemplateColumns: searchString ? 'repeat(auto-fill, minmax(223px, 1fr))' : '' }
                : { gridTemplateColumns: searchString ? 'repeat(auto-fill, minmax(250px, 1fr))' : '' }
            }
            className={`noScrollbar categories-` + (isLocationList ? 'locationGrid' : 'categoryGrid')}
          >
            {isLocationList
              ? filteredList
                .slice(searchString || width <= 950 ? 0 : 5)
                .sort(sortList)
                .map((location, index) => (
                  <Link
                    className='categories-locationLink'
                    style={{ ...styles.optionLink, background: '#1c1c1c' }}
                    onClick={closeOverlay}
                    key={index}
                    href={`${state.isHindi ? '/hindi' : ''}/local/${location.id.replace(/_/g, '-')}`}
                  >
                    <img
                      className='categories-optionsImage'
                      src={`https://cdn.workmob.com/stories_workmob/images/${state.isHindi ? 'hindi_' : ''
                        }locations/${location.id}.png`}
                      alt={`${location.id} image`}
                    />
                  </Link>
                ))
              : filteredList
                .slice(searchString || width <= 950 ? 0 : 5)
                .sort(sortList)
                .map((category, index) => (
                  <Link
                    style={styles.optionLink}
                    className='categories-categoryLink'
                    onClick={closeOverlay}
                    key={index}
                    href={`${pathname.includes('/podcasts')
                      ? '/podcasts'
                      : `${state.isHindi ? '/hindi' : ''}/voices`
                      }/${category.category}`}
                  >
                    <div className='categories-categoryPlaceholder'></div>
                    <img
                      className='categories-optionsImage'
                      src={`https://cdn.workmob.com/stories_workmob/images/category-bg/${category.category}.png`}
                      alt={`${category.category} image`}
                    />
                  </Link>
                ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default StoriesPageCategoryGrid;

const styleString = `
  .categories-optionsOverlay {
    font-size: 14px;
    padding: 1em 2em 2em;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1031;
    background: rgba(0, 0, 0, 0.93);
    color: #fff;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  .categories-head {
    font-size: 1em;
    margin-top: 1.25em;
    margin-bottom: 0.6em;
    text-align: center;
  }

  .categories-headTitle {
    font: 2.6em "Montserrat", sans-serif;
    position: relative;
    padding-bottom: 0.2em;
    font-weight: 500;
  }

  .categories-headTitle::after {
    content: '';
    width: 50px;
    height: 6px;
    background: #f96332;
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    margin: 0 auto;
  }

  .categories-headTitle, 
  .categories-headTitle > span {
    color: #e7c822;
    display: block;
  }

  .categories-headLocationPara {
    font: 1.35em "Alata", sans-serif;
    max-width: 900px;
    margin: 0 auto;
  }

  .categories-search {
    font-size: 1.6em;
    width: 100%;
    max-width: 700px;
    padding: 0.25em 1em 0.25em 2em;
    text-align: initial;
    margin: 0 auto;
    background: #373436;
    border-radius: 30px;
    position: relative;
    flex-shrink: 0;
  }
 
  .categories-searchIcon {
    font-size: 0.9em;
    font-weight: 600;
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #6d6d6d;
  }

  .categories-searchIcon::before {
    font-weight: bold;
  }

  .categories-optionsInput {
    font-family: "Alata" san-serif;
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #fff;
  }

  .categories-gridContainer {
    margin: 1.6em auto 0;
    width: 100%;
    min-height: 0;
    overflow: auto;
  }

  .categories-topRow {
    margin-bottom: 2.5em;
    display: flex;
  }

  .categories-topRow > * {
    flex: 1;
  }

  // .categories-topRow > :nth-child(3)::after {
  //   content: '';
  //   width: 50px;
  //   height: 6px;
  //   background: #f96332;
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   margin: 0.5em auto 0;
  // }

  .categories-topRow.categories-categoryTopRow > :nth-child(3)::after {
    top: 88%;
    margin-top: 0;
  }

  .categories-topRow > .categories-locationLink:not(:last-child) {
    margin-right: 2em;
  }

  .categories-locationGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
    gap: 2em;
    grid-gap: 2em;
  }

  .categories-categoryGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0;
  }

  .categories-locationLink {
    background: #1c1c1c;
    border-radius: 1.1vw;
    position: relative;
  }

  .categories-locationLink::before {
    content: '';
    padding-top: 100%;
    display: block;
  }

  .categories-categoryLink::before {
    content: '';
    display: block;
    padding-top: 74.39%;
  }

  .categories-optionsImage {
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .categories-categoryPlaceholder {
    position: absolute;
    width: 85%;
    height: 78%;
    left: 0;
    right: 0;
    top: 6%;
    background: #1c1c1c;
    border-radius: 12px;
    margin: 0 auto; 
  }

  .bottomCloseBtn {
    display: none;
  }

  @media (max-width: 440px) {
    .categories-locationGrid,
    .categories-categoryGrid {
      grid-template-columns: 1fr 1fr !important;
    }

    .categories-locationGrid {
      gap: 1.4em;
      grid-gap: 1.4em;
    }
  }

  @media (max-width: 600px) {
    .categories-optionsOverlay {
      padding: 1em 1em 2em;
    }
  
    .categories-head {
      font-size: 0.8em;
    }

    .categories-headTitle {
      font-size: 2em
    }

    .categories-headTitle::after {
      width: 30px;
      height: 3px;
    }
  }

  @media(max-width: 950px) {
    .categories-topRow {
      display: none;
    }

    .categories-search {
      font-size: 1.25em;
    }
  }

  @media(max-width: 1140px) {
    .categories-headTitle.categories-categoryTitle {
      font-size: 4.6vw;
      padding-bottom: 0.35em;
    }
  }
`;

const styles = {
  optionLink: {
    borderRadius: '12px',
    position: 'relative',
  },
};
