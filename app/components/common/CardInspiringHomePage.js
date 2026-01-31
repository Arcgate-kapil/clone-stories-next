
import React from 'react';
import { YELLOW } from '../../constants/colors';
import Link from 'next/link';
import Image from 'next/image';
import { getAltImg } from '../../utils';
import { EVENT_TYPE } from '../../constants/firebaseString';
// import { customEvent } from '@/app/firebase/firebase';
import useWindowSize from '../../utils/useWindowSize';
import CustomStyle from './CustomStyle';

let CardInspiringHomePage = props => {
  const { width } = useWindowSize();

  const {
    colSize = 4,
    pageId = '',
    isHindi,
    index
  } = props;
  let {
    thumb,
    webpthumb,
    slug,
    storyType,
    location_hindi = '',
    storyHeading = '',
    storyHeading_hindi = '',
    screenName,
    location,
    company_name,
    company_name_hindi = '',
    industry_hindi = ''
  } = props.story;

  if (isHindi) {
    location = location_hindi || location;
    storyHeading = storyHeading_hindi || storyHeading;
    company_name = company_name_hindi || company_name;
    storyType = industry_hindi || storyType;
  }

  // const cardClick = () => {
  //   customEvent(EVENT_TYPE.storyCardClick, {
  //     screen_name: screenName,
  //     story_slug: slug,
  //   });
  // };

  return (
    <>
      <CustomStyle>{stylesCss}</CustomStyle>
      <Link
        onClick={() => {
          if (props?.onStoreSession) {
            props?.onStoreSession();
          }
          // cardClick();
          props.onClick && props.onClick();
        }}
        href={{
          pathname: `${isHindi ? 'hindi/' : '/'}${slug}`,
          state: { userClick: true },
        }}
        className={`col-6 col-md-${colSize} mb-sm-5 mb-2 mt-2 px-xl-5 px-md-3 px-1 insipiringCardContent minHeight243 cardSingle${index}`}
      >
        <div className='height100 h-100 betweenSec'>
          <div
            className={width > 767 ? 'hoverCard homepageVideoInspiringCard cardHovers h-100' : 'nocardHovers h-100'}
          >
            <img
              loading='lazy'
              style={{ zIndex: 1 }}
              className='position-absolute w-100 h-100 frame'
              src={'https://cdn.workmob.com/stories_workmob/images/common/phone-frame.png'}
              alt='frame'
            />
            {/* <LazyLoadImage
            effect='blur'
            width='100%'
            height='100%'
            wrapperClassName='w-100 lazyLoad-card-inspiring'
            alt={getAltImg(thumb)}
            src={thumb}
          /> */}
          <span className='w-100 lazyLoad-card-inspiring lazy-load-image-background blur lazy-load-image-loaded' style={{ color: 'transparent', display: 'inline-block', height: '100%' }}>
            <Image
              src={webpthumb ? webpthumb : thumb}
              alt={getAltImg(thumb)}
              width={500}
              height={300}
              placeholder="blur"
              blurDataURL={thumb}
              className='h-100 w-100 lazyLoad-card-inspiring'
            />
            </span>
            <div
              style={styles.bottomBg}
              className='position-absolute w-100 py-lg-3 py-3 px-1 px-md-2 px-lg-2 px-xl-3 caption-container'
            >
              {!pageId && (
                <p className='px-0 px-md-2 mb-0 category-badge'>
                  <small className={`badge badge-dark rounded p-1 small ${isHindi ? 'font-khand' : ''}`}>{storyType}</small>
                </p>
              )}
              {!!location && (
                <span
                  style={{ marginLeft: -2 }}
                  className={`d-sm-flex d-md-none align-items-center location px-0 px-md-2 small mb-1 mt-0 ${isHindi ? 'font-khand' : ''}`}
                >
                  <i className='icon icon-location' />
                  {location}
                </span>
              )}
              <p
                style={styles.title}
                className={`m-0 px-2 px-md-2 text-left caption font-16 ${isHindi ? 'font-khand' : 'font-alata'}`}
              >
                {storyHeading}
              </p>
              <div className='d-md-flex flex-wrap d-none align-items-center justify-content-start mt-1'>
                {!!company_name && (
                  <span
                    style={{ marginLeft: -2 }}
                    className={`d-flex align-items-center location px-0 px-md-2 small mb-1 mt-0 mr-0 ${isHindi ? 'font-khand' : ''}`}
                  >
                    <i className='icon icon-company' />
                    {company_name}
                  </span>
                )}
                {!!location && (
                  <span
                    style={{ marginLeft: -2 }}
                    className={`d-flex align-items-center location px-0 px-md-2 small mb-1 mt-0 ${isHindi ? 'font-khand' : ''}`}
                  >
                    <i className='icon icon-location' />
                    {location}
                  </span>
                )}
              </div>
            </div>
            <span className='position-absolute playBtn text-white'>
              <i className='icon icon-play' />
            </span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default CardInspiringHomePage;

const styles = {
  cardHover: {
    background: 'rgba(255,255,255,0.1)',
    boxShadow: '0px 6px 12px rgba(255,255,255,0.3)',
    // aspectRatio: '50 / 89',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
  card: {
    borderRadius: 10,
    background: 'rgba(255,255,255,0.1)',
    boxShadow: '0px 6px 12px rgba(255,255,255,0.3)',
    // aspectRatio: '50 / 89',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    overflow: 'hidden',
  },
  bottomBg: {
    bottom: 5,
    left: 0,
    background:
      'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)',
  },
  title: {
    color: YELLOW,
    lineHeight: '1.3em',
  },
};

const stylesCss = `
.height100 {
  height: 100%;
  position: relative;
}
.paddingTops178 {
  padding-top: 178%;
  position: absolute;
}
// .height100 {
//   position: relative;
// }
// .paddingTops178 {
//   padding-top: 178%;
// }
.minHeight243 {
  min-height: 243px;
  // min-height: 100vh;
}
.homepageVideoInspiring{ 
    border-radius: 44px;
    position:absolute;
    padding:5px;
    bottom:0;
    top:0;
    left:0;
    right:0;
    width:100%;
    height:100%;
    object-fit:unset
}
.hoverCard{
  border-radius: 30px;
  overflow:hidden
}
.homepageVideoInspiringCard video{ 
  border-radius: 44px;
  position:absolute;
  padding:5px;
  bottom:0;
  top:0;
  left:0;
  right:0;
  width:100%;
  height:100%;
  object-fit:unset
}

@media screen and (max-width: 767px) {
  .homepageVideoInspiring{ 
    border-radius: 10px !important;
    padding:0
  }
  .homepageVideoInspiringCard video{
    border-radius: 10px !important;
    padding:0
  }
}
@media screen and (max-width: 1100px) {
  .homepageVideoInspiring{ 
    border-radius: 22px !important;
  }
  .homepageVideoInspiringCard video{
    border-radius: 22px !important;
  }
  .hoverCard{
    border-radius: 22px;
  }
}
@media screen and (max-width: 1600px) {
  .homepageVideoInspiring{ 
    border-radius: 30px;
  }
  .homepageVideoInspiringCard video{
    border-radius: 30px;
  }
}
.nocardHovers {
  border-radius: 10px !important;
    background: rgba(255,255,255,0.1);
    box-shadow: rgba(255,255,255,0.3) 0px 6px 12px;
    position: absolute;
    // position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    z-index: 1;
    width: 100%;

    // width: 100%;
    // display: block;
    // position: absolute;
    // top: 0;
    // right: 0;
    // bottom: 0;
    // left: 0;
    // z-index: 1;
    // overflow: hidden;
    // border-radius: 1.4vw;
}
.cardHovers {
  background: rgba(255,255,255,0.1);
  box-shadow: rgba(255,255,255,0.3) 0px 6px 12px;
  // aspectRatio: '50 / 89';
  // position: relative;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
}
.betweenSec::before {
  content: "";
  padding-top: 175%;
  display: block;
  border-radius: 2vw;
  background: rgba(0, 0, 0, .5);
  box-shadow: 0 6px 12px hsla(0, 0%, 100%, .3);
},
`;
