import React, { useEffect, useRef } from 'react';
import CloseBtn from './CloseBtn';
import CustomStyle from './CustomStyle';
import Link from 'next/link';

const AboutHeader = () => {
  const headerRef = useRef();

  useEffect(() => {
    let isThrottle;
    function changeHeaderBg() {
      if (isThrottle) return;
      isThrottle = true;
      setTimeout(() => {
        const header = headerRef.current;
        if (header) {
          if (window.scrollY) {
            header.style.background = 'black';
            header.style.boxShadow = 'rgba(255, 255, 255, 0.2) 0px 3px 6px';
          } else {
            header.removeAttribute('style');
          }
        }
        isThrottle = false;
      }, 100);
    }
    document.addEventListener('scroll', changeHeaderBg);
    return () => document.removeEventListener('scroll', changeHeaderBg);
  }, []);

  return (
    <React.Fragment>
      <CustomStyle>{styles}</CustomStyle>
      <div className='about-header' ref={headerRef}>
        <Link className='workmob-logo' href='/'>
          <img
            src='https://cdn.workmob.com/stories_workmob/images/common/logo.png'
            alt='workmob-logo'
          />
        </Link>
        {/* <div style={{ width: '10px', height: '10px' }}></div> */}
        <CloseBtn bgColor='#DF625C' />
      </div>
    </React.Fragment>
  );
};

export default AboutHeader;

const styles = `
.workmob-logo{
    // padding-top: 2vw;
    // padding-left: 5vw;
    // padding-bottom: 3vw;
    position:relative;
}
.workmob-logo img{
  // width: 50%;
  // margin-left: 7rem;
    width: 154px;
    height: 27px;
    margin-left: 0;
}

.about-header{ 
  display: flex;
  padding: 0.75em;
  position: fixed;
  z-index: 8;
  top: 0;
  left: 0;
  right: 0;
  justify-content: center;
}

@media (max-width: 767px) {
.workmob-logo{
  max-width: 125px;
  min-width: 77px;
}
 .workmob-logo img{
  width: 100%;
  margin: 0;
 }
}
`;
