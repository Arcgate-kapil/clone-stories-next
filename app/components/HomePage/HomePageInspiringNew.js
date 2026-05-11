import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SCREEN_NAME } from '../../constants/firebaseString';
import CardInspiringHomePage from '../common/CardInspiringHomePage';
import styles from './HomePageInspiringNew.module.css';
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
  const blogs = props.blogs;
  const pathname = usePathname();
  const [visibleCount, setVisibleCount] = useState(20); // pehle sirf 8
  const loaderRef = useRef(null);
 
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
    if (blogs?.stories?.length) {
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
 
        const allData = [...slicedData, ...blogs?.stories];
        const seen = new Set();
        const uniqueArrayData = allData.filter(item => {
          if (seen.has(item.slug)) return false;
          seen.add(item.slug);
          return true;
        });
        // let jsonObject = allData.map(JSON.stringify);
        // let uniqueSet = new Set(jsonObject);
        // let uniqueArrayData = Array.from(uniqueSet).map(JSON.parse);
 
        uniqueData.current = uniqueArrayData;
      } else if (sessionStorageRef.current) {
        setStoryArr(blogs?.stories.slice(0, 20));
        sessionStorage.removeItem(pathname);
      }
    }
  }, [blogs?.stories]);
 
  const handleStoreSession = () => {
    sessionStorage.setItem(pathname, JSON.stringify(storyArr));
    sessionStorage.setItem('cacheData', pathname);
    sessionStorage.setItem('homepageScrollY', window.scrollY.toString());
  };
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => Math.min(prev + 20, storyArr.length));
        }
      },
      { threshold: 0.1 }
    );
 
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [storyArr.length]);
 
  return (
    <>
      <div
        style={{ width: '100%', maxWidth: '90%' }}
        className={`container-fluid ${styles.homepageInspiringStory}`}
      >
        <div className='row inspring-thumbs' ref={flexContainerRef}>
          {storyArr.length == 0 ?
            <PHCardLoader />
            :
            (
              <>
                {storyArr?.slice(0, visibleCount)?.map((story, index) => (
                  <CardInspiringHomePage
                    isHindi={isHindi}
                    colSize={3}
                    screenName={SCREEN_NAME.homePage}
                    story={story}
                    key={index}
                    onStoreSession={handleStoreSession}
                  />
                ))}
                {visibleCount < storyArr.length && (
                  <div ref={loaderRef} style={{ height: '20px', width: '100%' }} />
                )}
              </>
            )
          }
        </div>
      </div>
    </>
  );
};
 
export default HomePageInspiringNew;