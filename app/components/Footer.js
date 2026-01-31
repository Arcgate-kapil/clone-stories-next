import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import CustomStyle from './common/CustomStyle';
import { Link } from 'react-router-dom';

export default () => {
  const { pathname } = useLocation();
  const isDetailPage = /^\/(?:hindi\/)?[^\/]*-[^\/]*/.test(pathname);
  const isHindi = useSelector(state => state.blogs.isHindi);

  return (
      <footer className={'page-footer my-3 pb-0' + (isDetailPage ? ' d-none' : '')}>
        <CustomStyle>{styleString}</CustomStyle>
        <div className='container'>
          <div className='row'>
            <div className='col-12 w-100'>
              <div
                className={(isDetailPage ? '' : 'd-none d-md-flex') + ' ml-md-0'}
                style={styles.appLinks}
              >
                <a
                  href='https://play.google.com/store/apps/details?id=com.workmob'
                  target='_blank'
                  className='mr-3'
                >
                  <img
                    className='w-100'
                    width="100%"
                    height="100%"
                    src='https://cdn.workmob.com/stories_workmob/web_home/googleplaystore.png'
                    alt='play store badge'
                  />
                </a>
                <a
                  href='https://apps.apple.com/in/app/workmob-professional-network/id901802570'
                  target='_blank'
                >
                  <img
                    className='w-100'
                    width="100%"
                    height="100%"
                    src='https://cdn.workmob.com/stories_workmob/web_home/appstore.png'
                    alt='app store badge'
                  />
                </a>
              </div>
              <div className='d-flex align-items-center justify-content-between flex-md-row flex-column'>
                <div className='d-flex flex-md-row flex-column'>
                  <div className='footer-copyright text-white font-12 mr-md-3 order-1 order-md-0'>
                    &copy; {new Date().getFullYear()} Workmob Pvt. Ltd. All rights reserved.
                  </div>
                  <div className='mb-2 mb-md-0'>
                    <Link
                      style={styles.footerLink}
                      to='/about'
                      className='mr-3'
                    >
                      {isHindi ? 'जानकारी' : 'About'}
                    </Link>
                    <a
                      style={styles.footerLink}
                      href='https://www.workmob.com/terms'
                      target='_blank'
                      className='mr-3'
                    >
                      {isHindi ? 'टर्म्स' : 'Terms'}
                    </a>
                    <a
                      className='mr-3'
                      style={styles.footerLink}
                      href='https://www.workmob.com/legal'
                      target='_blank'
                    >
                      {isHindi ? 'लीगल' : 'Legal'}
                    </a>
                    <a
                      className='mr-3'
                      style={styles.footerLink}
                      href='https://www.workmob.com/privacy'
                      target='_blank'
                    >
                      {isHindi ? 'प्राइवेसी' : 'Privacy'}
                    </a>
                    <a
                      className='mr-md-3'
                      style={styles.footerLink}
                      href='https://www.workmob.com/brand-ambassador'
                      target='_blank'
                    >
                      {isHindi ? 'एम्बेसडर' : 'Ambassador'}
                    </a>
                  </div>
                </div>
                <div className='footer-social text-nowrap'>
                  <a
                    href='https://www.facebook.com/workmobapp/'
                    target='_blank'
                    className='btn btn-social-icon bg-transparent'
                  >
                    <img
                      width="100%"
                      height="auto"
                      src='https://cdn.workmob.com/stories_workmob/images/common/facebook.svg'
                      alt='fb'
                    />
                  </a>
                  <a
                    href='https://www.instagram.com/workmobapp/'
                    target='_blank'
                    className='btn btn-social-icon bg-transparent'
                  >
                    <img
                      width="100%"
                      height="auto"
                      src='https://cdn.workmob.com/stories_workmob/images/common/instagram.svg'
                      alt='instagram'
                    />
                  </a>
                  <a
                    href='https://youtube.com/channel/UCqOjwc1ZJmhy5oJJM3rhziA'
                    target='_blank'
                    className='btn btn-social-icon bg-transparent'
                  >
                    <img
                      width="100%"
                      height="auto"
                      src='https://cdn.workmob.com/stories_workmob/images/common/youtube.svg'
                      alt='youtube'
                    />
                  </a>
                  <a
                    href='https://twitter.com/Workmob'
                    target='_blank'
                    className='btn btn-social-icon bg-transparent'
                  >
                    <img
                      width="100%"
                      height="auto"
                      src='https://cdn.workmob.com/stories_workmob/images/common/twitter.svg'
                      alt='twitter'
                    />
                  </a>
                  <a
                    href='https://www.linkedin.com/company/workmobapp/'
                    target='_blank'
                    className='btn btn-social-icon bg-transparent'
                  >
                    <img
                      width="100%"
                      height="auto"
                      src='https://cdn.workmob.com/stories_workmob/images/common/linkedin.svg'
                      alt='linkedin'
                    />
                  </a>
                </div>
                <p className={'Footer-madeWithLove' + (!isDetailPage ? ' d-none' : '')}>
                  <span>MADE WITH&nbsp;</span>
                  <img
                    className='mt-1'
                    src='https://cdn.workmob.com/intro_workmob/images/common/heart.svg'
                    // src='https://www.workmob.com/static/media/heart.33403302.svg'
                    alt='heart'
                    width='12'
                    height='12'
                  />
                  <span>&nbsp;IN भारत</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
};

const styleString = `
  .Footer-madeWithLove {
    font: 100 13px/2 "Segoe UI", sans-serif;
    width: 128px;
    margin: 0 auto;
    align-self: flex-end;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
  }
`;

const styles = {
  linkParent: {
    display: 'flex',
  },

  footerLink: {
    fontSize: '12px',
    textDecoration: 'none',
    color: '#fff',
  },
  appLinks: {
    width: '230px',
    margin: '0 auto 0.5em',
    display: 'flex',
  },
};
