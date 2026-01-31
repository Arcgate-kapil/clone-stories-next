import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCity } from '../../actions/blog';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ListTitle from '../common/ListTitle';
import StoriesPageCategoryGrid from '../Stories/StoriesPageCategoryGrid';

function HomePageCities() {
  const cities = useSelector(state => state.blogs.locationList);
  const isHindi = useSelector(state => state.blogs.isHindi);
  const [searchCity, setSearchCity] = useState('');
  const [showList, setShowList] = useState(false);
  const [showOnly, setShowOnly] = useState(6);
  const citiesRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCity());
  }, []);

  useEffect(() => {
    if (window.innerWidth < 750) {
      setShowOnly(3);
      citiesRef.current.style.gridTemplateColumns = 'repeat(auto-fill, minmax(90px, 1fr))';
      citiesRef.current.style.gap = '1em';
    } else if (window.innerWidth < 1000) {
      setShowOnly(4);
    }
  }, []);

  return (
    <div className='container'>
      <div style={styles.header}>
        <ListTitle title={isHindi ? 'शहरों' : 'Cities'} />
        <i
          style={styles.rightArrow}
          className='icon icon-right-arrow'
          onClick={() => setShowList(!showList)}
        />
        {showList && (
          <StoriesPageCategoryGrid
            searchString={searchCity}
            updateSearchString={event => setSearchCity(event.target.value)}
            locationList={cities}
            closeOverlay={() => setShowList(false)}
          />
        )}
      </div>
      <div style={styles.cities} ref={citiesRef}>
        {cities.length > 0 &&
          cities.slice(0, showOnly).map((city, index) => (
            <Link key={index} to={`/local/${city.id}`} style={styles.cityLink}>
              <div style={styles.imagePlaceHolder}></div>
              <LazyLoadImage
                style={styles.cityImage}
                src={`https://cdn.workmob.com/stories_workmob/images/${
                  isHindi ? 'hindi_' : ''
                }locations/${city.id}.png`}
                alt={`${city.id} image`}
              />
            </Link>
          ))}
      </div>
    </div>
  );
}

export default HomePageCities;

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightArrow: {
    fontSize: '12px',
    color: '#ffffff',
    cursor: 'pointer',
    padding: '0.55em',
  },
  cities: {
    margin: '1em 0 3.5em',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '2em',
    gridGap: '2em',
  },
  cityLink: {
    background: '#1c1c1c',
    position: 'relative',
    borderRadius: '10px',
  },
  cityImage: {
    width: '100%',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
  imagePlaceHolder: {
    paddingTop: '100%',
  },
};
