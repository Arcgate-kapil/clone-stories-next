import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SCREEN_NAME } from '../../constants/firebaseString';
import { useSelector } from 'react-redux';
import CardInspiringHomePage from '../common/CardInspiringHomePage';
import CustomStyle from '../common/CustomStyle';
import { PHCardLoader } from '../common/PlaceHolder';

const HomePageInspiringNew = props => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [activeItem, setActiveItem] = useState('cardSingle0');
  const [storyArr, setStoryArr] = useState([]);
  const sessionStorageRef = useRef(true);
  const uniqueData = useRef(null);
  const debounceTimeout = useRef(null);
  const isScrolling = useRef(false);
  const flexContainerRef = useRef(null);
  const isHindi = props.isHindi;
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleItems([entry.target.classList[entry.target.classList.length - 1]]);
          }
        });
      },
      { threshold: 0.9 }
    );

    if (flexContainerRef.current) {
      const items = Array.from(flexContainerRef.current.children);
      items.forEach(item => observer.observe(item));
    }

    return () => observer.disconnect();
  }, [flexContainerRef]);

  useEffect(() => {
    const handleScroll = () => {
      isScrolling.current = true;
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        isScrolling.current = false;
        if (visibleItems.length > 0) {
          if (visibleItems !== activeItem) {
            setActiveItem(visibleItems);
          }
        }
      }, 500); // Adjust the delay as needed
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [visibleItems]);

  useEffect(() => {
    if (props?.blogs?.stories?.length) {
      const getDataFromSession = sessionStorage.getItem(pathname);
      const cacheDataSession = sessionStorage.getItem('cacheData');
      if (pathname !== cacheDataSession) {
        sessionStorage.removeItem(cacheDataSession);
      }
      if (getDataFromSession && pathname === cacheDataSession) {
        const newStoryListing = JSON.parse(getDataFromSession);
        const slicedData = newStoryListing.slice(0, 20);
        setStoryArr(slicedData);
        sessionStorage.removeItem(pathname);
        sessionStorageRef.current = false;

        const allData = [...slicedData, ...props.blogs.stories];
        let jsonObject = allData.map(JSON.stringify);
        let uniqueSet = new Set(jsonObject);
        let uniqueArrayData = Array.from(uniqueSet).map(JSON.parse);

        uniqueData.current = uniqueArrayData;
      } else if (sessionStorageRef.current) {
        setStoryArr(props?.blogs?.stories.slice(0, 20));
        sessionStorage.removeItem(pathname);
      }
    }
  }, [props?.blogs?.stories]);

  const handleStoreSession = () => {
    sessionStorage.setItem(pathname, JSON.stringify(storyArr));
    sessionStorage.setItem('cacheData', pathname);
    sessionStorage.setItem('homepageScrollY', window.scrollY.toString());
  };

  // const dummyArray = [
  //   {
  //     'slug': 'dr-amit-jain-education-academia-jaipur',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/dr-amit-jain-education-academia-jaipur.webp'
  //   },
  //   {
  //     'slug': 'sonal-goel-government-politics',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/sonal-goel-government-politics-panipat-thumb.webp'
  //   },
  //   {
  //     'slug': 'kunal-bagla-founder-ceo-arcgate',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/kunal-bagla-founder-ceo-arcgate-udaipur-thumb.webp'
  //   },
  //   {
  //     'slug': 'nirmala-sewani-astrology',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/nirmala-sewani-astrology-jaipur-thumb.webp'
  //   },
  //   {
  //     'slug': 'dr-ashish-singhal-hospital-health-care',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/dr-ashish-singhal-hospital-health-care-udaipur-thumb.webp'
  //   },
  //   {
  //     'slug': 'dr-narendra-singh-rathore-education-academia',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/dr-narendra-singh-rathore-education-academia-udaipur-thumb.webp'
  //   },
  //   {
  //     'slug': 'chetna-bhati-law-enforcement-safety',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/chetna-bhati-law-enforcement-safety-udaipur-thumb.webp'
  //   },
  //   {
  //     'slug': 'uddhav-poddar-bhumika-enterprises',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/udhav-poddar.webp'
  //   },
  //   {
  //     'slug': 'praveen-kumar-law-enforcement-safety',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/praveen-kumar-law-enforcement-safety-jaipur-thumb.webp'
  //   },
  //   {
  //     'slug': 'manoj-sharma-government-politics',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/manoj-sharma-government-politics-jaipur-thumb.webp'
  //   },
  //   {
  //     'slug': 'dr-baheti-hospital-health-care',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/dr-baheti-hospital-health-care-udaipur-thumb.webp'
  //   },
  //   {
  //     'slug': 'vikram-joshi-rangotri-owner',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/vikram-joshi-rangotri-owner-jaipur-thumb.webp'
  //   },
  //   {
  //     'slug': 'dr-priyanka-pareek-kayakalya-nature-cure-co-founder',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/dr-priyanka-pareek-kayakalya-nature-cure-co-founder-udaipur-thumb.webp'
  //   },
  //   {
  //     'slug': 'ravi-jhankal-arts-entertainment',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/ravi-jhankal-arts-entertainment-mumbai-thumb.webp'
  //   },
  //   {
  //     'slug': 'pooja-jha-government-politics',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/pooja-jha-government-politics-jamshedpur-thumb.webp'
  //   },
  //   {
  //     'slug': 'deepak-mazumdar-shiladhish-art-research-institute',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/deepak-mazumdar-shiladhish-art-research-institute-mumbai-thumb.webp'
  //   },
  //   {
  //     'slug': 'shivangee-vikram-music-dance-academies',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/shivangee-vikram-music-dance-academies-ahmedabad-thumb.webp'
  //   },
  //   {
  //     'slug': 'dr-jagat-shah-commerce-industry',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/dr-jagat-shah-commerce-industry-ahmedabad-thumb.webp'
  //   },
  //   {
  //     'slug': 'amreen-fatima-arts-entertainment',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/amreen-fatima-arts-entertainment-doha-thumb.webp'
  //   },
  //   {
  //     'slug': 'tarika-bhanupratap-she-circle-india-founder',
  //     'thumb': 'https://cdn.workmob.com/stories_workmob/devimg/tarika-bhanupratap-founder-udaipur-thumb.webp'
  //   }
  // ]

  // useEffect(() => {
  //   if (storyArr.length > 0) {
  //     const updatedStoryArr = storyArr.map(item1 => {
  //       const item2 = dummyArray.find(item => item.slug === item1.slug);
  //       if (item2) {
  //         return { ...item1, thumb: item2.thumb };
  //       }
  //       return item1;
  //     });
  //     setStoryArr(updatedStoryArr);
  //   }
  // }, [storyArr]);

  // storyArr?.forEach(item1 => {
  //   const item2 = dummyArray.find(item => item.slug === item1.slug);
  //   console.log('item2', item2, item1);
  //   if (item2) {
  //       item1.thumb = item2?.thumb; 
  //   }
  // });

  return (
    <>
      <CustomStyle>{stylesCss}</CustomStyle>
      <div
        style={{ width: '100%', maxWidth: '90%' }}
        className='container-fluid homepage-inspiring-story'
      >
        <div className='row inspring-thumbs' ref={flexContainerRef}>
          {storyArr.length == 0 ?
            <PHCardLoader />
            :
            storyArr?.map((story, index) => (
              <CardInspiringHomePage
                isHindi={isHindi}
                colSize={3}
                screenName={SCREEN_NAME.homePage}
                story={story}
                key={index}
                onStoreSession={handleStoreSession}
              />
            ))
          }
        </div>
      </div>
    </>
  );
};

export default HomePageInspiringNew;

const stylesCss = `
.testing:nth-child(4n + 1) {
  position: relative;
  top: 50px !important;
}
.testing:nth-child(2n + 1) {
  position: relative;
  top: 100px !important;
}
@media only screen and (min-width: 767px) and (max-width: 876px) {
  .testing.minHeight243 {
    min-height: 251px !important;
  }
  testing .height100 {
    height: 251px !important;
  }
  .testing .cardHovers {
    height: 251px !important;
  }
}
@media only screen and (min-width: 876px) and (max-width: 1100px) {
  .testing.minHeight243 {
    min-height: 351px !important;
  }
  testing .height100 {
    height: 351px !important;
  }
  .testing .cardHovers {
    height: 351px !important;
  }
}
.testing.minHeight243 {
  min-height: 451px;
}
testing .height100 {
  height: 451px;
  position: relative;
}
.testing .paddingTops178 {
  padding-top: 178%;
  position: absolute;
}
.testing .manyThings {
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}
.testing .cardHovers {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: rgba(255, 255, 255, 0.3) 0px 6px 12px;
  position: relative;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 451px;
}
.testing .hoverCard {
  border-radius: 30px;
  overflow: hidden;
}
.homepage-inspiring-story{ 
  margin-bottom:6rem
}
@media screen and (max-width: 767px) {
  .homepage-inspiring-story{ 
    margin-bottom:0rem;
  }

`;
