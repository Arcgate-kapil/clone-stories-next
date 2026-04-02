'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WHITE, ORANGE } from '../../constants/colors';
import CustomStyle from '../common/CustomStyle';
import { usePathname, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllListingByLocation, fetchMasterListingNew, fetchStoriesListingNew, fetchStoryListing } from '@/app/lib/features/blogSlice';

const StoriesPageBanner = (props) => {
  const {
    storyListTitle = props.isHindi ? 'प्रेरक कहानियां' : 'Inspiring Stories',
    homePara,
    filterStoryListing,
    resultsLength,
    masterListing,
    storyAllListing,
    storyListing,
    storiesListing,
    storyArr,
    setStoryArr,
    setCustomSearchValue,
    categoryNew,
    setIsSearchLoader,
  } = props;

  const pathname = usePathname();
  const { id } = useParams();
  const isLocalList = pathname.includes('/local/') && !!id;
  const isVoicesList = pathname.includes('/voices/') && !!id;
  const [searchValue, setSearchValue] = useState('');
  const searchTimeoutRef = useRef();
  const searchValueRef = useRef();
  const parts = pathname.split('/');
  let dispatch = useDispatch();
  const state = useSelector((state) => state.blog);

  const capitalizeEachWord = (str) => {
    return str.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  useEffect(() => {
    const savedValue = localStorage.getItem('searchValue');
    if (savedValue) {
      setSearchValue(savedValue);
    }
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

  useEffect(() => {
    if (pathname === '/voices' || pathname === '/hindi/voices') {
      setSearchValue('');
    }
  }, []);

  function handleOnChange(event) {
    if (pathname === '/voices' || pathname === '/hindi/voices' || (parts[0] === '' && parts[1] === 'hindi' && parts[2] === 'local' && parts[3] !== undefined) || (parts[0] === '' && parts[1] === 'local' && parts[2] !== undefined) || (parts[0] === '' && parts[1] === 'hindi' && parts[2] === 'voices' && parts[3] !== undefined) || (parts[0] === '' && parts[1] === 'voices' && parts[2] !== undefined)) {
      let value = event.target.value;
      setCustomSearchValue(event.target.value);
      const searchValue = value.toLowerCase();
      searchValueRef.current = searchValue;
      clearTimeout(searchTimeoutRef.current);

      searchTimeoutRef.current = setTimeout(() => {
        const matchesFound = [];

        const normalizeName = (name) => {
          const prefixes = ['dr.', 'mr.', 'ms.', 'mrs.', 'prof.', 'maj', 'gen', 'col.'];
          let normalized = name.toLowerCase();
          prefixes.forEach(prefix => {
            if (normalized.startsWith(prefix + ' ')) {
              normalized = normalized.replace(prefix + ' ', '');
            }
          });
          // Remove special characters (like parentheses)
          normalized = normalized.replace(/[()]/g, '').trim();

          // Normalize spaces
          normalized = normalized.replace(/\s+/g, ' ');
          return normalized.trim();
        };

        if (pathname === '/voices' || pathname === '/hindi/voices') {
          if (masterListing) {
            if (value.length > 1) {
              dispatch(fetchMasterListingNew(value));
              // setIsSearchLoader(true);
            } else {
              dispatch(fetchStoryListing(categoryNew));
              // setIsSearchLoader(false);
            }
            // for (let user of masterListing) {
            //   const name = user.name && user.name.toLowerCase();

            //   if (
            //     user.slug &&
            //     user.thumb &&
            //     user.storyHeading &&
            //     name &&
            //     user.name.toLowerCase().includes(searchValue.toLowerCase())
            //   ) {
            //     matchesFound.push(user);
            //   }
            // }
            // }
          } else {
            setStoryArr(storyArr.slice(0, 60));
          }
        }

        if ((parts[0] === '' && parts[1] === 'hindi' && parts[2] === 'local' && parts[3] !== undefined) || (parts[0] === '' && parts[1] === 'local' && parts[2] !== undefined)) {
          let city = parts[1] === 'hindi' ? parts[3] : parts[2];
          if (storyAllListing) {
            if (value.length > 1) {
              dispatch(fetchAllListingByLocation({ value, city }));
              setIsSearchLoader(true);
            } else {
              dispatch(fetchAllListingByLocation({ value, city }));
              setIsSearchLoader(false);
            }
            // for (let user of storyAllListing) {
            //   const name = user.name && user.name.toLowerCase();

            //   if (
            //     user.slug &&
            //     user.thumb &&
            //     user.storyHeading &&
            //     name &&
            //     (normalizeName(name).split(' ').some(v => v.startsWith(searchValue)) || normalizeName(name).startsWith(searchValue))
            //   ) {
            //     matchesFound.push(user);
            //   }
            // }
            // setStoryArr(matchesFound.slice(0, 8));
          } else {
            setStoryArr(storyArr.slice(0, 8));
          }
        }

        if ((parts[0] === '' && parts[1] === 'hindi' && parts[2] === 'voices' && parts[3] !== undefined) || (parts[0] === '' && parts[1] === 'voices' && parts[2] !== undefined)) {
          if (storiesListing) {
            if (value.length > 1) {
              dispatch(dispatch(fetchStoriesListingNew({ value, categoryNew })));
              setIsSearchLoader(true);
            } else {
              dispatch(dispatch(fetchStoriesListingNew({ value, categoryNew })));
              setIsSearchLoader(false);
            }
            // for (let user of storiesListing) {
            //   const name = user.name && user.name.toLowerCase();

            //   if (
            //     user.slug &&
            //     user.thumb &&
            //     user.storyHeading &&
            //     name &&
            //     (normalizeName(name).split(' ').some(v => v.startsWith(searchValue)) || normalizeName(name).startsWith(searchValue))
            //   ) {
            //     matchesFound.push(user);
            //   }
            // }
            // }
            // setStoryArr(matchesFound.slice(0, 8));
          } else {
            setStoryArr(storyArr.slice(0, 8));
          }
        }
      }, 1000);
    } else {
      if ((parts[0] === '' && parts[1] === 'hindi' && parts[2] === 'local' && parts[3] !== undefined) || (parts[0] === '' && parts[1] === 'local' && parts[2] !== undefined)) {
        props?.filterAllStoryListing(event);
        setCustomSearchValue(event.target.value);
      } else {
        props?.filterStoryListing(event);
        setCustomSearchValue(event.target.value);
      }
    }
    setSearchValue(event.target.value);
    localStorage.setItem('searchValue', event.target.value);
  }

  return (
    <div
      className={`${!!props.isiFrameView ? 'd-none' : 'd-block'} mt-md-4 mb-md-3 ${storyListTitle === 'Podcast' ? 'pt-3 mt-3' : ''
        } bg-transparent p-0 position-relative z-index-1 storyListing StoriesPageBanner`}
    >
      <CustomStyle>{styleString}</CustomStyle>
      <div style={{ top: 0, left: 0 }} className='w-100 d-flex align-items-center'>
        <div className='container'>
          <div className='row d-flex align-items-center justify-content-between'>
            <div className='col-12'>
              {(parts[0] === '' && parts[1] === 'hindi' && parts[2] === 'local' && parts[3] !== undefined) || (parts[0] === '' && parts[1] === 'local' && parts[2] !== undefined) || (parts[0] === '' && parts[1] === 'hindi' && parts[2] === 'voices' && parts[3] !== undefined) || (parts[0] === '' && parts[1] === 'voices' && parts[2] !== undefined) ? null : <><h1
                className={`StoriesPageBanner-titleContainer mt-md-4 mt-3 text-center heading caption`}
              >
                <span className='position-relative' style={{ fontSize: 'inherit' }}>
                  {storyListTitle === 'Podcast' && (
                    <i className='StoriesPageBanner-headphoneIcon icon icon-headphone-symbol headphone' />
                  )}
                  <span
                    className={
                      'StoriesPageBanner-title' +
                      (isLocalList || isVoicesList ? ' StoriesPageBanner-titleSmall' : '')
                    }
                  >
                    {storyListTitle}
                  </span>
                </span>
              </h1>
                <h2
                  className={`StoriesPageBanner-devider ${pathname === '/' ? 'StoriesPageBanner-deviderSearchPage' : ''
                    } text-white font-weight-bold text-center`}
                ></h2></>}
              <div className='StoriesPageBanner-homePara'>{homePara}</div>
              <div className='search-box my-3 text-center'>
                <div className='input-group input-group-lg StoriesPageBanner-searchBox'>
                  <input
                    value={searchValue}
                    onChange={handleOnChange}
                    placeholder={props.isHindi ? (parts[0] === '' && parts[1] === 'hindi' && parts[2] === 'local' && parts[3] !== undefined) || (parts[0] === '' && parts[1] === 'local' && parts[2] !== undefined) ? (storyArr[0]?.location_hindi === undefined ? 'नाम से खोजें' : `${storyArr[0]?.location_hindi} में पेशेवर खोजें`) : 'नाम से खोजें' : (parts[0] === '' && parts[1] === 'hindi' && parts[2] === 'local' && parts[3] !== undefined) || (parts[0] === '' && parts[1] === 'local' && parts[2] !== undefined) ? (storyArr[0]?.location === undefined ? 'Search by name' : `Search professionals in ${capitalizeEachWord(storyArr[0]?.location)}`) : 'Search by name'}
                    type='text'
                    className={`form-control mx-auto ${props.isHindi ? 'font-khand' : ''}`}
                  />
                  <i className='icon icon-icon-search-new'></i>
                </div>
                {searchValue.length > 0 && resultsLength === 0 && (
                  <p style={styles.notFoundMessage}>No stories found with "{searchValue}"</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesPageBanner;

const styleString = `
  .StoriesPageBanner-titleContainer {
    color: #fff;
    font-weight: bold;
  }

  .StoriesPageBanner-titleContainer::first-letter {
    text-transform: uppercase;
  }

  .StoriesPageBanner-devider {
    width: 50px;
    height: 6px;
    margin: 0.32em auto 0.25em;
    background: #f96332;
  }

  .StoriesPageBanner-deviderSearchPage {
    margin-top: 0.5em;
  }

  .StoriesPageBanner-headphoneIcon {
    font-size: 2em;
    position: absolute;
    right: 85%;
    bottom: 67%;
    transform: rotate(-45deg);
    color: #f96332;
  }

  .StoriesPageBanner-title {
    font: 1.4em/1 "Montserrat", sans-serif;
    color: #e7c822;
    font-weight: 500;
  }

  .StoriesPageBanner-homePara {
    color: #fff;
    font: 1.8em "Alata", sans-serif;
    text-align: center;
    line-height: 1.1;
  }
  

  .StoriesPageBanner-searchBox {
    max-width: 700px;
    margin: 0 auto;
  }

  .StoriesPageBanner-meriKahani {
    font: 80px/1 "Alata", sans-serif;
    display: flex;
    justify-content: center;
  }

  .StoriesPageBanner-meriKahani > :nth-child(1) {
    color: #ff9933;
  }

  .StoriesPageBanner-meriKahani > :nth-child(2) {
    color: #fff;
  }

  .StoriesPageBanner-meriKahani > :nth-child(3) {
    color: #128807;
  }

  @media(max-width: 760px) {
    .StoriesPageBanner-homePara {
      font-size: 1.2em;
    }

    .StoriesPageBanner-titleSmall {
      font-size: 1em;
    }

    .StoriesPageBanner-devider {
      width: 30px;
      height: 3px;
    }

    .StoriesPageBanner-deviderSearchPage {
      margin-top: 0.4em;
    }
  }
.z-index-1 {
  z-index: 1;
}
`;

const styles = {
  subTitle: {
    opacity: 0.9,
    color: WHITE,
    lineHeight: 1,
    fontSize: '3.4vw',
  },
  overlay: {
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  notFoundMessage: {
    color: '#dfdfdf',
  },
};
