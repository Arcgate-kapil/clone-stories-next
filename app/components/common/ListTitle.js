'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { WHITE } from '../../constants/colors';
import { EVENT_TYPE } from '../../constants/firebaseString';
import { customEvent } from '@/app/firebase/firebase';
import { useSelector } from 'react-redux';
import CustomStyle from './CustomStyle';
import { usePathname } from 'next/navigation';

const ListTitle = props => {
  const state = useSelector(state => state.blog);
  const { title, link, type, handleClick } = props;
  const pathname = usePathname();
  const linkItem = useRef();

  const showMoreClick = (props) => {
    if (handleClick) {
      handleClick();
    }
    customEvent(EVENT_TYPE.showMore, {
      title: title,
      slug: link,
    });
  };

  // const inspireTitle = title.includes("Inspiring Stories")

  return (
    <>
      <CustomStyle>{styleString}</CustomStyle>
      <h2
        style={{
          ...styles[type == 'small' ? 'title' : 'heading'],
          lineHeight: state.isHindi ? '1.5' : 'normal',
        }}
        className={`mb-4 montserrat-regular position-relative font-weight-bold d-flex align-items-center justify-content-between sub-heading z-index-1 ${props.className}`}
      >
        {pathname === '/' && (link === "insights" || link === "tags" || link === "podcasts") ? (
          <Link
            onMouseOver={() => {
              // linkItem.current.parentNode.getElementsByClassName('ListTitle-devider')[0].classList.add('zoomAuto')
            }}
            onMouseLeave={() => {
              // linkItem.current.parentNode.getElementsByClassName('ListTitle-devider')[0].classList.remove('zoomAuto')
            }}
            href={`/${link}`}
            className={props.zoom ? `zoom` : ``}
            style={{ textDecoration: 'none', color: 'white' }}
            onClick={() => {
              if (handleClick) {
                handleClick();
              }
            }}
            ref={linkItem}
          >
            {title.toUpperCase().replace(/-/g, ' ')}
          </Link>
        ) : (
          title.toUpperCase().replace(/-/g, ' ')
        )}

        {!!link && (
          <Link
            onClick={showMoreClick}
            style={{ opacity: 0.8 }}
            href={`/${link}`}
            className={` text-decoration-none showMore p-2 text-white ${props.zoom ? `zoom2` : ``}`}
          >
            <i style={{ fontSize: 12 }} className='icon icon-right-arrow' />
          </Link>
        )}
        <span className='ListTitle-devider'></span>
      </h2>
    </>
  );
};

export default ListTitle;

const styleString = `
  .ListTitle-devider {
    position: absolute;
    left: 0;
    bottom: -10px;
    background: #F96332;
    width: 50px;
    height: 5px;
  }

  @media(max-width: 500px) {
    .ListTitle-devider {
      width: 30px;
      height: 4px;
    }
  }
`;

const styles = {
  heading: {
    color: WHITE,
    fontSize: '2vw',
    textTransform: 'uppercase',
  },
  title: {
    color: WHITE,
    fontSize: '1.5vw',
    textTransform: 'none',
  },
};
