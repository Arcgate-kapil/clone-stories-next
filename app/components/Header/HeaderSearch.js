import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
import { fetchStoryListing } from '../../actions/blog';
import CardInspiring from '../common/CardInspiring';
import StoriesPageBanner from '../Stories/StoriesPageBanner';
import CloseBtn from '../common/CloseBtn';
import CustomStyle from '../common/CustomStyle';

function HeaderSearch({ closeOverlay, masterIndex }) {
  const dispatch = useDispatch();
  const isHindi = useSelector(state => state.blogs.isHindi);
  const storyListing = useSelector(state => state.blogs.storyListing);
  const [storyArray, setStoryArray] = useState();
  const searchTimeoutRef = useRef();
  const searchValueRef = useRef();

  useEffect(() => {
    dispatch(fetchStoryListing('top'));
    document.body.style.overflow = 'hidden';

    return () => {document.body.style.overflow = ''};
  }, []);

  useEffect(() => {
    if (!storyArray && storyListing.length) {
      setStoryArray(storyListing);
    }
  }, [storyListing]);

  useEffect(() => {
    const searchValue = searchValueRef.current;

    if (masterIndex && searchValue) {
      searchMasterIndex(searchValue);
    }
  }, [masterIndex]);

  function searchMasterIndex(value) {
    const searchValue = value.toLowerCase();
    const atSearch = searchValue.startsWith('@'); // search string starting with @ symbol

    searchValueRef.current = searchValue;
    clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      const matchesFound = [];

      if (masterIndex && searchValue.length >= (atSearch ? 4 : 3)) {
        if (atSearch) {
          for (let user of masterIndex) {
            if (
              user.workmobUserName &&
              user.workmobUserName.toLowerCase().startsWith(searchValue.slice(1))
            ) {
              matchesFound.push(user);
            }
          }
        } else {
          for (let user of masterIndex) {
            const name = user.name && user.name.toLowerCase();

            if (
              user.slug &&
              user.thumb &&
              user.storyHeading &&
              name &&
              (name.split(' ').some(v => v.startsWith(searchValue)) || name.startsWith(searchValue))
            ) {
              matchesFound.push(user);
            }
          }
        }

        setStoryArray(matchesFound);
      } else {
        setStoryArray(storyListing);
      }
    }, 1000);
  }

  return (
    <div className='noScrollbar HeaderSearch'>
      <CustomStyle>{styleString}</CustomStyle>
      <CloseBtn closeModalOnly={true} handleClick={closeOverlay} />
      <StoriesPageBanner
        resultsLength={storyArray ? storyArray.length : 0}
        filterStoryListing={event => searchMasterIndex(event.target.value)}
        isHindi={isHindi}
        storyListTitle={isHindi ? 'प्रेरक कहानियां' : 'Inspiring Stories'}
      />
      <div className='inspring-thumbs HeaderSearch-cardsContainer'>
        {storyArray &&
          storyArray.map((v, i) => (
            <CardInspiring
              key={`${v.thumb}${i}`}
              isHindi={isHindi}
              story={v}
              colSize={3}
              onClick={closeOverlay}
            />
          ))}
      </div>
    </div>
  );
}

export default HeaderSearch;

const styleString = `
  .storiesPageBanner {
    margin-top: 1em !important;
    padding-top: 0 !important;
  }

  .storiesPageBanner .input-group  {
    max-width: 900px;
  }

  .HeaderSearch {
    background: top left/contain url(https://cdn.workmob.com/stories_workmob/images/common/blog_bg.webp);
    overflow: auto;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .HeaderSearch-cardsContainer {
    width: 90%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
  }
`;
