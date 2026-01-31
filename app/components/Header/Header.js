import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { WHITE, TRANSPARENT, BLACK } from '../../constants/colors';
import { getCookie } from '../../utils';
import CloseBtn from '../common/CloseBtn';
import { useHistory } from 'react-router-dom';
import StoriesPageCategoryGrid from '../Stories/StoriesPageCategoryGrid';
import StoriesOverlayCat from '../Stories/StoriesOverlayCat';
import HeaderSearch from './HeaderSearch';
import { fetchCity } from '../../actions/blog';
import { fetchCategories } from '../../actions/blog';
import { useSelector, useDispatch } from 'react-redux';
import CustomStyle from '../common/CustomStyle';

const Header = props => {
  const dispatch = useDispatch();
  const isLayoverPlayBtn = useSelector(state => state.blogs.isLayoverPlayBtn);
  const isFlagBtn = useSelector(state => state.blogs.isFlagBtn);
  const locations = useSelector(state => state.blogs.locationList);
  const categories = useSelector(state => state.blogs.categories);
  const isHindi = useSelector(state => state.blogs.isHindi);
  const [masterIndex, setMasterIndex] = useState();
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const routerHistory = useHistory();
  const { pathname } = routerHistory.location;
  const [langFromPath, setLangFromPath] = useState(false);
  const [navType, setNavType] = useState('fixedNav');
  const [userInfo, setUserInfo] = useState(null);
  const isDetailPage = /^\/(?:hindi\/)?[^\/]*-[^\/]*/.test(pathname);
  const isVoicesPage = pathname.includes('/local') || pathname.includes('/voices');
  const isHomePage = /^\/(?:hindi\/?)?$/.test(pathname);
  const isTagsPage = pathname.includes('/tags');
  const isPodcastsPage = pathname.includes('/podcasts');
  const isVideoDetailPage = !isPodcastsPage && props.blogDetail;
  const [overlayCat, setoverlayCat] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isMobileActive, setIsMobileActive] = useState(false);
  const toggleRef = useRef(null);
  const buttonRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const parts = pathname.split('/');

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  const handleMobileToggle = () => {
    setIsMobileActive((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (toggleRef.current && !toggleRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMobileClickOutside = (event) => {
    if (mobileToggleRef.current && !mobileToggleRef.current.contains(event.target) && !mobileButtonRef.current.contains(event.target)) {
      setIsMobileActive(false);
    }
  };

  const handleIconClick = () => {
    localStorage.removeItem('searchValue');
  };

  useEffect(() => {
    // Add event listener for clicks outside
    document.addEventListener('mousedown', handleMobileClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleMobileClickOutside);
    };
  }, []);

  useEffect(() => {
    // fetch('https://cdn.workmob.com/stories_workmob/config/MasterIndex.json')
    //   .then(res => res.json())
    //   .then(data => setMasterIndex(data));
    dispatch(fetchCity());
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    if (pathname.includes('/hindi')) {
      props.setHindiText(true);
    } else {
      props.setHindiText(false);
    }

    setLangFromPath(true);
  }, []);

  useEffect(() => {
    const pathname = location.pathname;

    if (
      (langFromPath && isHomePage) ||
      isDetailPage ||
      isVoicesPage ||
      isTagsPage ||
      isPodcastsPage
    ) {
      if (isHindi && !pathname.includes('/hindi')) {
        routerHistory.replace('/hindi' + pathname);
      } else if (!isHindi && pathname.includes('/hindi')) {
        routerHistory.replace(pathname.replace('/hindi', ''));
      }
    }
  }, [pathname, isHindi, langFromPath]);

  useEffect(() => {
    let _userInfo = null;

    if (!!getCookie('userInfo')) {
      _userInfo = JSON.parse(getCookie('userInfo'));
    }

    setUserInfo(_userInfo);

    if (props.location.search.split("&")[0] == '?hideBanner=yes') {
      sessionStorage.setItem('hideHeader', true);
    }

    window.addEventListener('scroll', listenScrollEvent);

    return () => {
      window.removeEventListener('scroll', listenScrollEvent);
      localStorage.removeItem('hideHeader');
    };
  }, []);

  const goBack = () => {
    props.history.goBack();
  };

  const toggleLanguage = status => {
    const pathname = location.pathname;

    history.replaceState(
      null,
      '',
      pathname.includes('/hindi') ? pathname.replace('/hindi', '') : '/hindi' + pathname
    );
    props.setHindiText(status);
  };

  const listenScrollEvent = e => {
    const _elem3 = document.getElementById('promoCard');

    if (window.scrollY > 100) {
      setNavType('scrollNav');

      if (!!_elem3) {
        _elem3.classList.add('fixedToBottom');

        setTimeout(() => {
          if (!!_elem3) {
            _elem3.classList.remove('fixedToBottom');
            _elem3.removeAttribute('id');
          }
        }, 5000);
      }
    } else {
      setNavType('fixedNav');
      if (!!_elem3) {
        _elem3.classList.remove('fixedToBottom');
      }
    }
  };

  const langBtnElem = (
    <>
      {((!!props.blogDetail && !!props.blogDetail.is_hindi_translated && !!props.showHindButton) ||
        isHomePage ||
        isTagsPage ||
        isVoicesPage ||
        isPodcastsPage) && (
          <div
            onClick={() => toggleLanguage(!props.isHindi)}
            className='rounded-circle ml-2 hindi-button languageEffect'
            style={styles.langButton}
            role='button'
          >
            {props.isHindi ? 'Eng' : 'हिंदी'}
          </div>
        )}
    </>
  );

  const headerIconsElem = (
    <>
      {/* <i
        className='icon-location d-none d-md-flex'
        style={styles.locationIcon}
        onClick={() => setShowLocations(true)}
      ></i> */}
      {/* <div className='d-none d-md-flex' style={styles.headerIcon} onClick={() => setShowCategories(true)}> */}
      <div
        className='d-none d-md-flex categoryEffect'
        style={styles.headerIcon}
        onClick={() => setoverlayCat(true)}
      >
        {/* <svg viewBox='0 0 32 32' width='100%' height='100%'>
          <g>
            <path d='M12,0H2C0.895,0,0,0.895,0,2v10c0,1.104,0.895,2,2,2h10c1.105,0,2-0.896,2-2V2C14,0.895,13.105,0,12,0z    M12,12H2V2h10V12z' />
            <path d='M30,0H20c-1.105,0-2,0.895-2,2v10c0,1.104,0.895,2,2,2h10c1.104,0,2-0.896,2-2V2C32,0.895,31.104,0,30,0z    M30,12H20V2h10V12z' />
            <path d='M30,18H20c-1.105,0-2,0.896-2,2v10c0,1.105,0.895,2,2,2h10c1.104,0,2-0.895,2-2V20   C32,18.895,31.104,18,30,18z M30,30l-10,0V20h10V30z' />
            <path d='M12,18H2c-1.105,0-2,0.896-2,2v10c0,1.105,0.895,2,2,2h10c1.105,0,2-0.895,2-2V20   C14,18.895,13.105,18,12,18z M12,30L2,30V20h10V30z' />
          </g>
        </svg> */}
        <img src="https://cdn.workmob.com/stories_workmob/web_home/horizontal-lines.svg" style={{ width: '100%', height: '100%' }} />
      </div>
      <Link
        className='not-underline'
        to='/voices'
        onClick={handleIconClick}
      >
        <i
          className='icon-icon-search-new searchEffect'
          style={styles.headerIcon}
        // onClick={() => setShowHeaderSearch(true)}
        ></i>
      </Link>

      {langBtnElem}

    </>
  );

  if (props.location.search.split("&")[0] == '?hideBanner=yes' || !!props.isiFrameView) {
    if (props.location.search.split("&")[1] != 'showLanguage=true') {
      return null;
    }
  }

  // if (props.location.pathname == '/merikahani' || props.location.pathname.includes('/create')) {
  //   return <CloseBtn />;
  // }

  if (props.location.pathname == '/merikahani') {
    return <CloseBtn bgColor='rgb(223, 98, 92)' />;
  } else if (props.location.pathname.includes('/create')) {
    return <CloseBtn />;
  }

  return (
    <>
      <CustomStyle>{styleString}</CustomStyle>
      <div
        className={isVideoDetailPage ? 'detailsiteHeader' : 'siteHeader'}
        style={{ ...styles.headerContainer, ...styles[navType] }}
      >
        {(parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'local' && parts[3] != undefined) || (parts[0] == '' && parts[1] == 'local' && parts[2] != undefined) || (parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'tags' && parts[3] != undefined) || (parts[0] == '' && parts[1] == 'tags' && parts[2] != undefined) || (parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'voices' && parts[3] != undefined) || (parts[0] == '' && parts[1] == 'voices' && parts[2] != undefined) ? <nav className='d-flex justify-content-between custom-px'>
          <div>
            <img src='https://cdn.workmob.com/stories_workmob/images/common/logo.png' />
          </div>
          <div
            onClick={() => toggleLanguage(!props.isHindi)}
            className='rounded-circle ml-2 new-hindi-button'
            style={styles.langButtonNew}
            role='button'
          >
            {props.isHindi ? 'Eng' : 'हिंदी'}
          </div>
        </nav> : null}
        {(parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'tags' && parts[3] != undefined) || (parts[0] == '' && parts[1] == 'tags' && parts[2] != undefined) || (parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'voices' && parts[3] != undefined) || (parts[0] == '' && parts[1] == 'voices' && parts[2] != undefined) ? null : 
        <nav
          className='d-none d-md-flex'
          style={isVideoDetailPage ? (isFlagBtn) ? styles.headerDesktopNewNew : styles.headerDesktopNew : styles.headerDesktop}
        >
          {isVideoDetailPage ? (
            <>
              {isFlagBtn && <div className="dropdown">
                <div ref={buttonRef} onClick={handleToggle} style={styles.langButtonNew} className="dropdown-toggle rounded-circle ml-2 three-btn-dot mb-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <svg width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" class="bi bi-three-dots-vertical">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  </svg>
                </div>
                <div ref={toggleRef} className={isActive ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton" x-placement="bottom-start">
                  <div className='arrow-box'></div>
                  <a className="dropdown-item" target='_blank' href="https://wa.me/919001985566?text=I want to report this user">Report</a>
                  <a className="dropdown-item" target='_blank' href="https://wa.me/919001985566?text=I want to report this user">Help</a>
                </div>
              </div>}
              <div
                onClick={() => toggleLanguage(!props.isHindi)}
                className='rounded-circle ml-2 hindi-button'
                style={styles.langButtonNew}
                role='button'
              >
                {props.isHindi ? 'Eng' : 'हिंदी'}
              </div>
            </>
          ) : (
            <>
              {!isDetailPage && !isVoicesPage && (
                <div className='headerNavButtons' style={styles.navButtons}>
                  {headerIconsElem}
                </div>
              )}
              {/* <Link to={`/${isHindi ? 'hindi' : ''}`} className='align-self-center logo-link'>
                <img
                  className='home-logo'
                  src='https://cdn.workmob.com/stories_workmob/images/common/logo.png'
                  alt='logo'
                />
              </Link> */}
              <div className='justify-content-end headerNavButtons' style={styles.navButtons}>
                {!isDetailPage && !isVoicesPage && (
                  <ShareStoryButton userInfo={userInfo} isHindi={props.isHindi} />
                )}
                {/* {langBtnElem} */}
              </div>
            </>
          )}
        </nav>}
        {/* mobile */}
        {(parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'tags' && parts[3] != undefined) || (parts[0] == '' && parts[1] == 'tags' && parts[2] != undefined) || (parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'voices' && parts[3] != undefined) || (parts[0] == '' && parts[1] == 'voices' && parts[2] != undefined) ? null : <nav
          className='d-flex d-md-none'
          style={isFlagBtn ? { ...styles.headerMobileNew, width: isHomePage ? '100%' : 'calc(100% - 44px)' } : { ...styles.headerMobile, width: isHomePage ? '100%' : 'calc(100% - 44px)' }}
        >
          {isVideoDetailPage ? (
            <>
              {isFlagBtn && <div className="dropdown">
                <div ref={mobileButtonRef} onClick={handleMobileToggle} style={styles.langButtonNew} className="dropdown-toggle rounded-circle ml-2 three-btn-dot mb-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  <svg width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" class="bi bi-three-dots-vertical">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  </svg>
                </div>
                <div ref={mobileToggleRef} className={isMobileActive ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton" x-placement="bottom-start">
                  <div className='arrow-box'></div>
                  <a className="dropdown-item" target="_blank" href="https://wa.me/919001985566?text=I want to report this user">Report</a>
                  <a className="dropdown-item" target="_blank" href="https://wa.me/919001985566?text=I want to report this user">Help</a>
                </div>
              </div>}
              <div
                onClick={() => toggleLanguage(!props.isHindi)}
                className='rounded-circle ml-2 hindi-button hindi-buttonNew'
                style={styles.langButtonNew}
                role='button'
              >
                {props.isHindi ? 'Eng' : 'हिंदी'}
              </div>
            </>
          ) : (
            <>
              {!isDetailPage && !isVoicesPage && (
                <>
                  <div className='headerNavButtons mr-3' style={styles.navButtons}>
                    <ShareStoryButton userInfo={userInfo} isHindi={props.isHindi} />
                    <div
                      className='categoryEffect'
                      style={styles.headerIcon}
                      onClick={() => setoverlayCat(true)}
                    >
                      {/* <svg viewBox='0 0 32 32' width='100%' height='100%'>
                      <g>
                        <path d='M12,0H2C0.895,0,0,0.895,0,2v10c0,1.104,0.895,2,2,2h10c1.105,0,2-0.896,2-2V2C14,0.895,13.105,0,12,0z    M12,12H2V2h10V12z' />
                        <path d='M30,0H20c-1.105,0-2,0.895-2,2v10c0,1.104,0.895,2,2,2h10c1.104,0,2-0.896,2-2V2C32,0.895,31.104,0,30,0z    M30,12H20V2h10V12z' />
                        <path d='M30,18H20c-1.105,0-2,0.896-2,2v10c0,1.105,0.895,2,2,2h10c1.104,0,2-0.895,2-2V20   C32,18.895,31.104,18,30,18z M30,30l-10,0V20h10V30z' />
                        <path d='M12,18H2c-1.105,0-2,0.896-2,2v10c0,1.105,0.895,2,2,2h10c1.105,0,2-0.895,2-2V20   C14,18.895,13.105,18,12,18z M12,30L2,30V20h10V30z' />
                      </g>
                    </svg> */}
                      <img src="https://cdn.workmob.com/stories_workmob/web_home/horizontal-lines.svg" style={{ width: '100%', height: '100%' }} />
                    </div>
                  </div>

                </>
              )}
              <div className='justify-content-end headerNavButtons ml-3' style={styles.navButtons}>
                {!isDetailPage && !isVoicesPage && headerIconsElem}
                {/* {langBtnElem} */}
              </div>
            </>
          )}
        </nav>}
        {showLocations && (
          <StoriesPageCategoryGrid
            searchString={searchLocation}
            updateSearchString={event => setSearchLocation(event.target.value)}
            locationList={locations}
            closeOverlay={() => setShowLocations(false)}
          />
        )}
        {showCategories && (
          <StoriesPageCategoryGrid
            searchString={searchCategory}
            updateSearchString={event => setSearchCategory(event.target.value)}
            categoryList={categories.slice(1)}
            closeOverlay={() => setShowCategories(false)}
          />
        )}
        {overlayCat && (
          <StoriesOverlayCat
            searchString={searchCategory}
            updateSearchString={event => setSearchCategory(event.target.value)}
            categoryList={categories.slice(1)}
            closeOverlay={() => setoverlayCat(false)}
            {...props}
          />
        )}
        {!isHomePage &&
          props.location.search.split("&")[1] != 'showLanguage=true' &&
          props.location.search.split("&")[0] != 'hideBanner=yes' &&
          props.location.pathname != '/voices' &&
          props.location.pathname != '/podcasts' && <CloseBtn setLayoverPlayButton={props.setLayoverPlayButton} bgColor='#DF625C' goBack={goBack} />
        }
      </div>
    </>
  );
};

export default Header;

const styleString = `
.languageEffect{
  margin-left:0.7rem
}

.locationEffect, .categoryEffect, .searchEffect, .languageEffect, .headerShareButton,.searchEffect{
  transition: transform 0.3s ease-in-out;
}

.locationEffect:hover, .categoryEffect:hover, .searchEffect:hover, .languageEffect:hover,.searchEffect:hover{
  transform: scale(1.2);
}
.headerShareButton:hover {
  transform: scale(1.1);
}

.home-logo{
  width: 80%
}
.logo-link{
  display: block;
  margin-bottom: auto;
  text-align:center
}
  @media (max-width: 767px) {
    .categoryEffect{
      padding:0.4em 0.4em 0.4em 0.3em !important
    }
    .siteHeader {
      position: sticky !important;
      position: -webkit-sticky !important;
      // background: black !important;
    }
    .detailsiteHeader{
      position: sticky !important;
      position: -webkit-sticky !important;
    }
    .headerShareButton {
      font-size: 10px;
      padding: 4px 7px !important;
    }

    .hindi-button {
      font-size: 9px;
      width: 27px !important;
      height: 27px !important;
    }

    .hindi-buttonNew{
      font-size: 12px;
      width: 35px !important;
      height: 35px !important;
    }

    .headerNavButtons {
      font-size: 15.5px;
    }
  }
  @media (min-width: 2000px) {
.home-logo{ 
   width: 100%
}
  }
  .not-underline {
    text-decoration: none !important;
  }
  .custom-px {
    padding: 3px 113px 4px 42px;
  }
  @media (min-width: 500px) and (max-width: 767px) {
    .custom-px { 
      padding: 3px 48px 4px 14px;
    }
  }

  @media (max-width: 500px) {
    .custom-px img { 
      width: 145px;
    }
    .custom-px  { 
      padding: 3px 50px 4px 13px;
    }
  }
  .new-hindi-button {
    width: 34px;
    height: 34px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background-color: rgba(0, 0, 0, 0.4);
    color: #fff;
    font-size: 12px;
    outline: none !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ffffff4d;
    transition: transform .3s ease-in-out;
  }
  .three-btn-dot {
    width: 38px;
    height: 38px;
    color: #fff;
    font-size: 12px;
    outline: none !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    transition: transform .3s ease-in-out;
    background-color: rgba(0, 0, 0, 0.5);
  }
.hindi-button {
   width: 38px;
    height: 38px;
    color: #fff;
    font-size: 12px;
    outline: none !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    transition: transform .3s ease-in-out;
    background-color: rgba(0, 0, 0, 0.5);
    background-image: unset;
}
 
  .three-btn-dot::after {
    display: none;
  }
  .dropdown-menu {
    position: absolute;
    willChange: transform;
    top: 7px;
    left: 0px;
    transform: translate3d(0px, 37px, 0px);
    box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.5);
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    padding-left: 9px;
    padding-right: 9px;
    padding: .1rem 9px !important;
  }
  .dropdown-menu .dropdown-item {
    color: rgba(196, 80, 54, 1);
    padding-left: 5px;
    padding-right: 5px;
    font-weight: 500;
    font-family: 'Alata';
  }
  .dropdown-menu .dropdown-item:nth-child(2) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.5) !important;
  }
  .dropdown-menu .dropdown-item:hover {
    background-color: unset;
    color: rgba(196, 80, 54, 1);
  }
  .dropdown-menu .dropdown-item:focus {
    background-color: unset;
    color: rgba(196, 80, 54, 1);
  }
  .dropdown-menu .arrow-box {
    position: relative;
  }
  .dropdown-menu .arrow-box::before {
    content: ""; 
    position: absolute;
    top: -21px; 
    left: 9%; 
    transform: translateX(-35%); 
    border-width: 10px; 
    border-style: solid;
    border-color: transparent transparent rgba(0, 0, 0, 0.4) transparent; 
    z-index: 1001;
}
@media screen and (max-width: 766px) {
  .three-btn-dot {
    width: 35px !important;
    height: 35px !important;
  }
  .dropdown-menu {
    top: 7px !important;
  }
}
`;

const styles = {
  headerContainer: {
    fontSize: '20px',
    padding: '0.375em',
    position: 'fixed',
    zIndex: '8',
    top: '0',
    left: '0',
    right: '0',
  },
  headerDesktop: {
    width: '72%',
    margin: '0 auto',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerDesktopNew: {
    width: '83%',
    margin: '0 auto',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerDesktopNewNew: {
    width: '83%',
    margin: '0 auto',
    // justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerMobile: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerMobileNew: {
    // justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  navButtons: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
  },
  headerIcon: {
    cursor: 'pointer',
    fill: '#d1d1d1',
    color: '#d1d1d1',
    width: '1.6em',
    height: '1.6em',
    padding: '0.4em',
    borderRadius: '50%',
    marginLeft: '0.5em',
    backgroundImage:
      ' url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    backgroundSize: '99% 100%',
    // backgroundColor: '#00000073',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: '1.15em',
    color: '#d1d1d1',
    width: '1.4em',
    height: '1.4em',
    borderRadius: '50%',
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    backgroundSize: '99% 100%',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  langButton: {
    border: 'none',
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    backgroundSize: '99% 100%',
    backgroundColor: '#00000073',
  },
  langButtonNew: {
    // border: '1px solid #ffffff4d',
  },
  logoLinkMobile: {
    minWidth: '77px',
    maxWidth: '125px',
    marginTop: '-0.15em',
    alignSelf: 'center',
  },
  btn: {
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    // backgroundColor: '#00000073',
    backgroundSize: '110%',
    backgroundPosition: 'center',
    color: WHITE,
    borderRadius: '30px',
    boxShadow: '0px 3px 6px #00000029',
    whiteSpace: 'nowrap',
  },
  dropDownList: {
    width: 380,
    maxWidth: '100%',
  },
  fixedNav: {
    zIndex: 8,
    transition: 'all 0.3s ease-in-out',
    backgroundColor: TRANSPARENT,
  },
  scrollNav: {
    zIndex: 8,
    backgroundColor: BLACK,
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0px 3px 6px rgba(255,255,255,0.2)',
  },
  showMenu: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: ' 100%',
    left: 0,
    top: 0,
    paddingTop: 0,
    height: '100vh',
  },
};

const ShareStoryButton = ({ classes, shareYourStoryClick, isHindi }) => {
  return (
    <Link
      onClick={shareYourStoryClick}
      to={{
        pathname: isHindi ? '/hindi/merikahani' : '/merikahani',
        state: true,
      }}
      style={styles.btn}
      className={`btn font-weight-bold ${isHindi ? 'font-khand' : 'montserrat-regular'} headerShareButton ${classes}`}
    >
      {isHindi ? 'कहानी शेयर करें' : 'Share your story'}
    </Link>
  );
};