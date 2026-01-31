import React, { useRef, useEffect, useState } from 'react';
import CustomStyle from '../common/CustomStyle';
import useWindowSize from '../../utils/useWindowSize';
import Image from 'next/image';

function HomePageBannerNew(props) {
  let isHindi = props.isHindi;
  const [itemIndex, setItemIndex] = useState(0);
  const itemRef = useRef(0);
  const [headerImages, setHeaderImages] = useState([]);

  useEffect(() => {
    if (isHindi) {
      const imagesHindi = [
        'https://cdn.workmob.com/stories_workmob/web_home/bharat-ke-apne-karamyogi.png',
        'https://cdn.workmob.com/stories_workmob/web_home/meet-indias-own-hindi.png',
        'https://cdn.workmob.com/stories_workmob/web_home/watch-discover-connect-hindi.png',
      ];
      const imagesHindiMobile = [
        'https://cdn.workmob.com/stories_workmob/web_home/meri-kahani-mobile-hindi.png',
        'https://cdn.workmob.com/stories_workmob/web_home/meet-indias-own-mobile-hindi.png',
        'https://cdn.workmob.com/stories_workmob/web_home/watch-discover-connect-mobile-hindi.png',
      ];
      const imageMain = window.innerWidth > 767 ? imagesHindi : imagesHindiMobile;
      setHeaderImages(imageMain);
    } else {
      const images = [
        'https://cdn.workmob.com/stories_workmob/web_home/bharat-ke-apne-karamyogi-english.webp',
        'https://cdn.workmob.com/stories_workmob/web_home/meet-indias-own.webp',
        'https://cdn.workmob.com/stories_workmob/web_home/watch-discover-connect.png',
      ];
      const imagesMobile = [
        'https://cdn.workmob.com/stories_workmob/web_home/meri-kahani-english.png',
        'https://cdn.workmob.com/stories_workmob/web_home/meet-indias-own-mobile-english.png',
        'https://cdn.workmob.com/stories_workmob/web_home/watch-discover-connect-mobile-english.png',
      ];
      const imageMain = window.innerWidth > 767 ? images : imagesMobile;
      setHeaderImages(imageMain);
    }
  }, [isHindi]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (itemRef.current == 2) {
        setItemIndex(0);
        itemRef.current = 0;
      } else {
        setItemIndex(prev => prev + 1);
        ++itemRef.current;
      }
    }, 6000);
    return () => {
      clearInterval(interval);
    };
  }, [isHindi]);

  return (
    <div className='homeBanner'>
      <CustomStyle>{styleString}</CustomStyle>
      <div className='HomePageBanner-videoContainer'>
        <div className='headerPaddingTop'></div>
        {headerImages[0] && <div className='imagesContainer'>
          {itemIndex == 0 && <Image className='elementToFadeInAndOut h-100 w-100' alt="Stories Intro" width={1200} height={250} src={headerImages[0]} />}
          {itemIndex == 1 && <Image className='elementToFadeInAndOut h-100 w-100' alt="Stories Intro" width={1200} height={250} src={headerImages[1]} />}
          {itemIndex == 2 && <Image className='elementToFadeInAndOut h-100 w-100' alt="Stories Intro" width={1200} height={250} src={headerImages[2]} />}
        </div>}
      </div>
      <div className='info-hide'>
        <h1>
          India's Professional Community | Meet Startups, Business Owners, Professionals & more
        </h1>
        <h2>
          Meet India's own professionals, startups, business owners, social workers, creators and
          more. Watch, discover and get to know professionals in your city.
        </h2>
      </div>
    </div>
  );
}

export default HomePageBannerNew;

const styleString = `
.headerPaddingTop{
  padding-top:15.66%
}

.imagesContainer{
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width:100%
}

.elementToFadeInAndOut {
  width:100%;
  // height: 100%;
  -webkit-animation: fadeinout 2s linear forwards;
  animation: fadeinout 7s linear forwards;
  opacity: 0;
}

@-webkit-keyframes fadeinout {
50% { opacity: 1; }
}

@keyframes fadeinout {
50% { opacity: 1; }
}

.info-hide{
  width: 0;
  height: 0;
  font-size: 0;
  opacity: 0;
  pointer-events: none;
}
.info-hide h1, .info-hide h2{
  width: 0;
  height: 0;
  font-size: 0;
}
  .HomePageBanner-videoContainer {
    // background: #1c1c1c;
    position: relative;
    max-width:84%;
    margin:0rem auto 2rem;
    border-radius:1.5rem
  }

  .HomePageBanner-video {
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius:1.5rem
  }

  .HomePageBanner-bottomContent {
    font: bold 1.5em "Montserrat", sans-serif;
  }

  @media(max-width: 575px) {
    .headerPaddingTop{
      padding-top:23.66%
    }
    .HomePageBanner-bottomContent {
      font-size: 12px;
    }
    .HomePageBanner-videoContainer {
      max-width:100%;
      margin:0rem auto 1rem;
      border-radius:0.5rem
    }
    .HomePageBanner-video {
      border-radius:0.5rem
    }
  }
`;
