'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { getAltImg } from '../../utils';
import { EVENT_TYPE } from '../../constants/firebaseString';
import { customEvent } from '@/app/firebase/firebase';
import { fetchStoryDetail } from '@/app/lib/features/blogSlice';
import useWindowSize from '../../utils/useWindowSize';

let CardInsight = (props) => {
  const { width } = useWindowSize();
  const cardRef = useRef();
  let dispatch = useDispatch();

  const { thumb, slug, storyHeading = '', screenName } = props.insight;

  const cardClick = () => {
    if (props.handleClick) {
      props.handleClick();
    }
    customEvent(EVENT_TYPE.insightCardClick, {
      screen_name: screenName,
      insight_slug: slug,
    });

    dispatch(fetchStoryDetail(slug));
  };

  useEffect(() => {
    const card = cardRef.current;

    card.style.height = `${(card.getBoundingClientRect().width / 100) * 69.38}px`;
  }, [width]);

  return (
    <Link
      onClick={cardClick}
      href={`/insights/${slug}`}
      className={`col-md-6 mb-sm-5 mt-2 text-decoration-none mb-2 px-sm-2 px-3 z-index-1`}
    >
      <div className="position-relative">
        <div style={styles.card} ref={cardRef} className="position-relative">
          <Image
            src={thumb}
            alt={getAltImg(thumb)}
            fill
            style={{ objectFit: 'cover', borderRadius: 15 }}
            placeholder="blur"
            blurDataURL={thumb} // Optional: provide a blur data URL if available
          />
        </div>
        <div style={{ bottom: 0, left: 0 }} className="w-100 py-3 px-1">
          <p
            style={styles.caption}
            className="m-0 font-weight-bold text-white caption montserrat-regular font-30"
          >
            {storyHeading}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CardInsight;

const styles = {
  card: {
    overflow: 'hidden',
    borderRadius: 15,
    minHeight: 200,
    // aspectRatio: '797 / 553',
    background: '#242526',
    boxShadow: '0px 6px 12px #00000029',
  },
};
