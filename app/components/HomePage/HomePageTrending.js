import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useFetch } from '../../utils/useFetch';
import ListTitle from '../common/ListTitle';

function HomePageTrending(props) {
  const isHindi = useSelector(state => state.blog.isHindi);
  const trendingTags =
    useFetch(
      'https://cdn.workmob.com/stories_workmob/promotional/Tags_bg/tags_bg.json'
    ) || [];

  useEffect(() => {
    const style = document.head.appendChild(document.createElement('style'));

    style.textContent = `
      .trendingTags > :not(:last-child) {
        margin-right: 2em;
      }

      @media (max-width: 767px) {
        .trendingTags > :not(:last-child) {
          margin-right: 1em;
        }
      }
    `;

    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="container">
      <ListTitle title="Trending" link='tags' handleClick={props?.handleClick} zoom={true} />
      <div style={styles.trendings} className='trendingTags noScrollbar'>
        {trendingTags.slice(0, 3).map((v, index) => (
          <Link
            style={styles.trending}
            key={index}
            href={`/tags/${v.tag_name.toLowerCase().replace(/ /g, '-')}`}
            onClick={() => {
              if (props.handleClick) {
                props.handleClick()
              }
            }}
          >
            <div style={styles.imagePlaceHolder}></div>
            <LazyLoadImage
              style={styles.image}
              src={isHindi ? v.small_background_img_hindi : v.small_background_img}
              alt={`${v.tag_name} image`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePageTrending;

const styles = {
  trendings: {
    margin: '2.5em 0 3.5em',
    display: 'flex',
    overflow: 'auto',
  },
  trending: {
    flex: '1',
    minWidth: '200px',
    background: '#1c1c1c',
    position: 'relative',
    borderRadius: '1vw',
    overflow: 'hidden',
  },
  imagePlaceHolder: {
    paddingTop: '69.38%',
  },
  image: {
    width: '100%',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
};
