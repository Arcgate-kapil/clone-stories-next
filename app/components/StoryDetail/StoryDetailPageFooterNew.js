import React, { useEffect, useRef } from 'react';
import useWindowSize from '../../utils/useWindowSize';
import { useSelector } from 'react-redux';
import CustomStyle from '../common/CustomStyle';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const StoryDetailPageFooterNew = (props) => {
  const { width } = useWindowSize();
  const state = useSelector(state => state.blog);
  const footerRef = useRef();
  const pathname = usePathname();

  useEffect(() => {
    const footerStyle = footerRef.current.style;
    if (window.innerWidth < 500) {
      footerStyle.fontSize = '7.5px';
    } else if (window.innerWidth < 900) {
      footerStyle.fontSize = '10px';
    } else {
      footerStyle.fontSize = '1rem';
    }
  }, [width]);

  return (
    <>
      <CustomStyle>{styleString}</CustomStyle>
      <div className={`container mx-width-cust-1300 ${pathname == '/merikahani' ? 'pb-84' : ''}`}>
      <div className={`HomePageFooter ${pathname == '/merikahani' || pathname == '/hindi/merikahani' ? 'mt-3' : 'mt-5'}`} ref={footerRef}>
        <div style={styles.container}>
          {props?.isDetailPage ? null : <div className='footerWorkmobLogo'>
            <img
              width="172px"
              height="100%"
              src='https://cdn.workmob.com/stories_workmob/images/common/workmob_logo_new.png'
              alt='logo'
            />
          </div>}

          {props?.isDetailPage ? null : <div className='footer-social-org text-nowrap fotter-links'>
            <a
              href='https://www.facebook.com/workmobapp/'
              target='_blank'
              className='btn btn-social-icon bg-transparent'
            >
              <img
                width="100%"
                height="100%"
                src='https://cdn.workmob.com/stories_workmob/images/common/facebook.svg'
                alt='fb'
                className='fb'
              />
            </a>
            <a
              href='https://www.instagram.com/workmobapp/'
              target='_blank'
              className='btn btn-social-icon bg-transparent'
            >
              <img
                width="100%"
                height="100%"
                src='https://cdn.workmob.com/stories_workmob/images/common/instagram.svg'
                alt='instagram'
                className='instagram'
              />
            </a>
            <a
              href='https://youtube.com/channel/UCqOjwc1ZJmhy5oJJM3rhziA'
              target='_blank'
              className='btn btn-social-icon bg-transparent'
            >
              <img
                width="100%"
                height="100%"
                src='https://cdn.workmob.com/stories_workmob/images/common/youtube.svg'
                alt='youtube'
                className='youtube'
              />
            </a>
            <a
              href='https://twitter.com/Workmob'
              target='_blank'
              className='btn btn-social-icon bg-transparent'
            >
              <img
                width="100%"
                height="100%"
                src='https://cdn.workmob.com/stories_workmob/images/common/twitter.svg'
                alt='twitter'
                className='twitter'
              />
            </a>
            <a
              href='https://www.linkedin.com/company/workmobapp/'
              target='_blank'
              className='btn btn-social-icon bg-transparent'
            >
              <img
                width="100%"
                height="100%"
                src='https://cdn.workmob.com/stories_workmob/images/common/linkedin.svg'
                alt='linkedin'
                className='linkedin'
              />
            </a>
          </div>}

          <div className={`d-flex flex-md-row flex-column footer-links-main ${props?.isDetailPage ? 'mb-3' : ''}`}>
            <div className='footer-links text-white font-12 mr-md-3 order-1 order-md-0 text-center'>
              &copy; {new Date().getFullYear()} {state.isHindi ? 'वर्कमोब प्रा. लि. सभी अधिकार सुरक्षित।' : 'Workmob Pvt. Ltd. All rights reserved.'}
            </div>
            <div className='mb-2 mb-md-0'>
              <Link style={styles.footerLink} href={state.isHindi ? '/hindi/about' : '/about'} className='mr-4'>
                {state.isHindi ? 'जानकारी' : 'About'}
              </Link>
              <a
                style={styles.footerLink}
                href='https://www.workmob.com/terms'
                target='_blank'
                className='mr-4'
              >
                {state.isHindi ? 'टर्म्स' : 'Terms'}
              </a>
              <a
                className='mr-4'
                style={styles.footerLink}
                href='https://www.workmob.com/legal'
                target='_blank'
              >
                {state.isHindi ? 'लीगल' : 'Legal'}
              </a>
              <a
                className='mr-4'
                style={styles.footerLink}
                href='https://www.workmob.com/privacy'
                target='_blank'
              >
                {state.isHindi ? 'प्राइवेसी' : 'Privacy'}
              </a>
              <a
                className='mr-md-3'
                style={styles.footerLink}
                href='https://www.workmob.com/brand-ambassador'
                target='_blank'
              >
                {state.isHindi ? 'एम्बेसडर' : 'Ambassador'}
              </a>
            </div>
          </div>
            {props?.isDetailPage ? null : <div className='d-flex playStOreIcons'>
              <a
                href='https://play.google.com/store/apps/details?id=com.workmob'
                target='_blank'
                className='mr-3'
              >
                <img
                  className='w-100 h-100'
                  src='https://cdn.workmob.com/stories_workmob/web_home/googleplaystore.png'
                  loading="lazy"
                  alt='play store badge'
                />
              </a>
              <a
                href='https://apps.apple.com/in/app/workmob-professional-network/id901802570'
                target='_blank'
              >
                <img
                  className='w-100 h-100'
                  src='https://cdn.workmob.com/stories_workmob/web_home/appstore.png'
                  loading="lazy"
                  alt='app store badge'
                />
              </a>
            </div>}
        </div>
        <div style={styles.bottomContent}>
          {props?.isDetailPage ? null : <p className='d-none d-md-block text-left hpSimplified font-regular font-26 mb-0' style={styles.bottomPara}>
            Aapki Digital Pehchan
          </p>}
            <div className='bottomFootImg d-grid-cust mb-4 mx-auto'>
              <img
              src="https://cdn.workmob.com/stories_workmob/images/Swadeshi.png"
              alt='Made with love in bharat2'
              width={width < 821 && width > 767 ? '165' : '165'}
              height={width < 821 && width > 767 ? '29' : '29'}
              className={width < 768 ? 'mx-auto' : 'mx-auto'}
              style={{ margin: props?.isDetailPage ? '0 auto' : ''}}
            />
            <img
              src="https://cdn.workmob.com/stories_workmob/web_home/made-with-love-in-bharat-new.png"
              alt='Made with love in bharat2'
              width={width < 821 && width > 767 ? '154' : '200'}
              height={width < 821 && width > 767 ? '25' : '36'}
              className={width < 768 ? 'mb-0 mx-auto' : 'mb-0'}
              style={{ margin: props?.isDetailPage ? '0 auto' : ''}}
            />
            </div>
          {props?.isDetailPage ? null : <p className='d-none d-md-block text-right hpSimplified font-regular font-26 mb-0' style={styles.bottomPara}>
            We can. Bharat can.
          </p>}
        </div>
      </div>
      </div>
    </>
  );
};

export default StoryDetailPageFooterNew;

const styleString = `

.fotter-links a{
  padding:0.375rem 1rem
}

.fotter-links a .fb{
  width:16px
}
.fotter-links a .instagram{
  width:28px
}.fotter-links a .youtube{
  width:34px
}.fotter-links a .twitter{
  width:24px
}
.fotter-links a .linkedin{
  width:30px
}

.footer-links-main{
    font-family: "Montserrat", sans-serif;
    z-index:1;
    margin-bottom:2rem;
    font-weight: 700;
}
.playStOreIcons{
  max-width:300px;
  margin-bottom:1rem;
  margin-top:-0.5rem;
  z-index: 1;
}

.orginitiative{
    font: 1.5rem Alata, sans-serif;
    margin-bottom:0.5rem;
}
.footerWorkmobLogo{
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    margin:0rem auto 3px;
    z-index:1
}
    .footer-social-org{
        margin:1rem auto;
        z-index:1;
    }
  .HomePageFooter {
    color: white;
    font: 1rem Montserrat, sans-serif;
    padding: 1.5em 2em 0;
    // margin-top:3rem !important 
  }

  .HomePageFooter-meriKahani {
    font: 5em Alata, sans-serif;
    position: relative;
    margin-bottom: 0;
  }

  .HomePageFooter-meriKahaniHindi {
    font: bold 5em Montserrat, sans-serif;
    position: relative;
  }

  .HomePageFooter-karmayogiFestival {
    width: 36em;
    margin-bottom: 0.5em;
  }

  .HomePageFooter-titleBox {
    font-size: 1.6em;
    line-height:1.4em;
    font-weight: bold;
    border: 5px solid rgba(255, 255, 255, 0.4);
    background:rgba(0, 0, 0, 0.2);
    padding: 1em;
    color: white;
    filter: drop-shadow(black 0.05em 0.1em 0.05em);
  }

  .HomePageFooter-smallItem {
    font-size: 1.6em;
    font-weight: bold;
    padding: 0.5em;
    color: rgb(247 217 57);
    filter: drop-shadow(black 0.05em 0.1em 0.05em);
  }

  .HomePageFooter-banaoApniPehchan {
    font-size: 3rem;
    font-weight: bold;
    margin: 0 0 0.2em;
    position:relative;
  }

  .HomePageFooter-banaoApniPehchanNew {
    font-size: 30px;
    font-weight: bold;
    margin: 0 auto 0.2em;
    position:relative;
    font-family: "khand", sans-serif;
  }

  .HomePageFooter-celebrating {
    font-size: 2em;
    font-weight: bold;
    display: flex;
    width: 300px;
    margin: 0 auto 0.35em;
  }

  .HomePageFooter-category {
    margin-left: 0.3em;
    transform: translateY(80%);
    opacity: 0;
    white-space: nowrap;
  }

  .HomePageFooter-animateCategory {
    animation: moveIn linear 2.5s 4.5 forwards;
  }

  .HomePageFooter-animateCelebrating {
    animation: fadeOutFadeIn linear 2.5s 11.25s forwards;
  }

  .HomePageFooter-madeWithLove {
    font: 100 13px/2 "Montserrat", sans-serif;
    width: 160px;
    margin: 0 auto 0.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    // justify-content: space-between;
  }

  .detailFooter-madeWithLove {
    color: rgba(254, 187, 4, 1);
    font-weight: 600;
    font-size: 13px;
  }

  @keyframes moveIn {
    0% {
      transform: translateY(80%) ;
      opacity: 0;
    }
  
    10%,
    90% {
      transform: translateY(0) ;
      opacity: 1;
    }
  
    100% {
      transform: translateY(-80%);
      opacity: 0;
    }
  }

  @keyframes fadeOutFadeIn {
    0% {
      opacity: 1;
    }
  
    50% {
      opacity: 0;
    }
  
    100% {
      opacity: 1;
      width: max-content
    }
  }


  @media(max-width: 900px) {
    .HomePageFooter-celebrating {
      width: 185px;
    }
  }
  @media(max-width: 767px) {
    .playStOreIcons{
      max-width:230px;
      margin-bottom:1rem
    }

    .HomePageFooter{
      margin-top:1rem !important
    }
    .HomePageFooter-banaoApniPehchan{
      font-size: 2.8rem;
    }
    .HomePageFooter-titleBox{
      line-height: 18px;
      font-size: 16px;
      border: 3px solid rgba(255, 255, 255, 0.4);
    }
    .orginitiative{
        font: 1rem Alata, sans-serif;
    }
    .footer-social-org{
      margin:0rem auto 1rem;
  }
  }
  .font-26 {
      font-size: 26px !important;
  }
  .mx-width-cust-1300 {
      max-width: 1300px;
  }
  .pb-60 {
      padding-bottom: 60px;
  }
  .d-grid-cust {
      display: grid;
  }
`;

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sideContent: {
    width: '200px',
    minWidth: '170px',
    display: 'flex',
    alignItems: 'center',
  },
  manWoman: {
    width: '50%',
  },
  middleContent: {
    textAlign: 'center',
    maxWidth: '1250px',
    margin: '1rem auto 0 auto',
    padding: '0 1em',
    font: 'Montserrat, sans-serif',
  },
  bottomContent: {
    fontSize: '1.6em',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  bottomPara: {
    flex: '1',
    fontSize: '1.4rem',
    letterSpacing: '1px',
  },
  appLink: {
    width: '100px',
    marginBottom: '1em',
  },
  footerLink: {
    fontSize: '12px',
    textDecoration: 'none',
    color: '#fff',
  },
};
