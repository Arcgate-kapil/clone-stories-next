'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, usePathname, useRouter } from 'next/navigation';
import StoryDetailPage from './StoryDetailPage';
import { HOME_PAGE, HOST } from '../constants/localString';
import { setVCard, setFlagBtn, fetchStoryDetail, setHindiView, setHindiButtonView } from '../lib/features/blogSlice';
import { EVENT_TYPE } from '../constants/firebaseString';
import { getCookie } from '../utils';
import { customEvent } from '../firebase/firebase';
import { useSelector } from 'react-redux';
// import {
//   setFlagButton,
// } from '../actions/blog';
import { PHStoryLoader } from './common/PlaceHolder';
import { useDispatch } from 'react-redux';
import { useFetch } from '../utils/useFetch';
import useWindowSize from '../utils/useWindowSize';
import CustomStyle from './common/CustomStyle';

const BlogDetailPage = (props) => {
  const dispatch = useDispatch();
  const [qrData, setQrData] = useState({});
  const [imageSrc, setImageSrc] = useState('');
  const [vCardData, setVCardData] = useState('');
  const [photoExists, setPhotoExists] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const state = useSelector((state) => state.blog);
  const [navType, setNavType] = useState('fixedNav');
  const [userInfo, setUserInfo] = useState(null);
  const [isMobileActive, setIsMobileActive] = useState(false);
  const mobileToggleRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const buttonRef = useRef(null);
  const toggleRef = useRef(null);

  // Next.js App Router equivalents
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const storySlug = params.slug;
  const searchTerm = searchParams.get('search');
  const { width } = useWindowSize();
  // const cameFromInside = useRef(searchParams.has('f'))

  useEffect(() => {
    dispatch(fetchStoryDetail(storySlug));
    // window.scroll(0, 0);
  }, []);

  // useEffect(() => {
  //   if (cameFromInside.current) {
  //     const cleanUrl = window.location.pathname
  //     window.history.replaceState(
  //       window.history.state,
  //       '',
  //       cleanUrl
  //     )
  //   }
  // }, [])

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes("#guid=") && search.includes("?src=vcAppQr") && hash.split("#guid=")[1].length == 16 && state.blogDetail?.consent_received == true) {
      dispatch(setVCard(true));
    } else {
      dispatch(setVCard(false));
    }
  }, [pathname, searchParams, state.blogDetail]);

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    let _userInfo = null;

    if (!!getCookie('userInfo')) {
      _userInfo = JSON.parse(getCookie('userInfo'));
    }

    setUserInfo(_userInfo);

    if (searchTerm == '?hideBanner=yes') {
      sessionStorage.setItem('hideHeader', true);
    }

    window.addEventListener('scroll', listenScrollEvent);

    return () => {
      window.removeEventListener('scroll', listenScrollEvent);
      localStorage.removeItem('hideHeader');
    };
  }, [])

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

  useEffect(() => {
    if (storySlug?.length != 0 && params?.videoSlug == undefined) { // Assuming videoSlug is another param if present
      dispatch(setFlagBtn(true));
    }
  }, [storySlug]);

  // const redirectUrlArr =
  //   useFetch(
  //     'https://cdn.workmob.com/stories_workmob/config/redirect_url_list.json'
  //   ) || [];

  // const _index = redirectUrlArr.findIndex(o => o[storySlug]);
  // if (_index > -1) {
  //   storySlug = redirectUrlArr[_index][storySlug];
  //   router.replace('/' + storySlug);
  // }

  const articleViewEvent = (storyDetail) => {
    const searchItem = searchParams.toString().split('=');
    customEvent(EVENT_TYPE.articleView, {
      slug: storyDetail.slug,
      category: storyDetail.category,
      heading: storyDetail.storyHeading,
      type: storyDetail.storyType,
      src: searchParams.has('src') ? searchParams.get('src') : 'blog'
    });
  };

  const prevPath = useRef(pathname).current;

  useEffect(() => {
    if (prevPath != pathname) {
      // window.scrollTo(0, 0);
      dispatch(fetchStoryDetail(storySlug));
    }
    if (state.blogDetail) {
      articleViewEvent(state.blogDetail);
    }
  }, [pathname, state.blogDetail]);

  const downloadVCard = async (e) => {
    e.preventDefault();
    const userConfirmed = window.confirm("Do you want to save the VCF contact?");

    if (userConfirmed) {
      try {
        const response = await fetch(`https://s3.ap-south-1.amazonaws.com/cdn.workmob.com/stories_workmob/vcards${pathname}.vcf`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const vcfData = await response.text();
        const blob = new Blob([vcfData], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${pathname}.vcf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading the VCF file:', error);
      }
    } else {
      console.log("User canceled the download.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://s3.ap-south-1.amazonaws.com/cdn.workmob.com/stories_workmob/vcards${pathname}.vcf`);
        if (response?.status == 200) {
          const data = await response.text();
          parseVCardForPhoto(data);
          setVCardData(data);
        } else {
          // throw new Error('Network response was not ok: ' + response.statusText);
        }
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const parseVCardForPhoto = (data) => {
    const lines = data.split('\n');
    lines.forEach(line => {
      if (line.startsWith('PHOTO;ENCODING=b;TYPE=JPEG')) {
        const photoData = line.split(':')[1]?.trim();
        let base64 = 'data:image/jpeg;base64,' + photoData;
        setImageSrc(base64);
        if (base64) {
          const isBase64 = base64.startsWith('data:image/jpeg;base64,');
          if (isBase64) {
            setPhotoExists(true);
          }
        }
      }
    });
    return photoExists;
  };

  useEffect(() => {
    if (vCardData?.length > 0) {
      function parseVCard(vCardString) {
        const vCardData = {};
        const lines = vCardString?.split('\n');

        let currentKey = null;
        let currentValue = '';

        lines?.forEach(line => {
          line = line.trim();

          if (!line || line.startsWith('BEGIN') || line.startsWith('END')) {
            return;
          }

          if (line.includes(':')) {
            if (currentKey) {
              vCardData[currentKey] = currentValue.replace(/;/g, '').replace(/\b\w/g, char => char.toUpperCase());
            }

            const [key, ...valueParts] = line?.split(':');
            currentKey = key;
            currentValue = valueParts.join(':');
          } else {
            currentValue += line;
          }
        });

        if (currentKey) {
          vCardData[currentKey] = currentValue.replace(/\s+/g, '');
        }

        return vCardData;
      }

      let vCard = parseVCard(vCardData);

      if (vCard) {
        setQrData(vCard);
      } else {
        setQrData('No QR code found.');
      }
    }
  }, [vCardData, loading]);

  const handleCall = (e) => {
    e.preventDefault();
    window.location.href = `tel:${qrData['TEL;TYPE=CELL']}`;
  };

  const toggleLanguage = (e) => {
    e.preventDefault();
    const newPath = pathname.startsWith('/hindi') ? pathname.replace('/hindi', '') : '/hindi' + pathname;
    window.history.replaceState(null, "", newPath);
    dispatch(setHindiView(!state.isHindi));
  };

  useEffect(() => {
    if (pathname.startsWith('/hindi')) {
      dispatch(setHindiView(true));
    } else {
      dispatch(setHindiView(false));
    }
  }, [pathname]);

  const handleBackClick = (e) => {
    e.preventDefault();
    const getcacheDataFromSession = sessionStorage.getItem('cacheData');
    if (getcacheDataFromSession == null) {
      state.isHindi ? router.replace('/hindi') : router.replace('/');
    } else {
      state.isHindi ? (getcacheDataFromSession.startsWith('/hindi') ? router.replace(getcacheDataFromSession) : router.replace(`/hindi${getcacheDataFromSession}`)) : (getcacheDataFromSession.startsWith('/hindi') ? (getcacheDataFromSession == "/hindi" ? router.replace('/') : router.replace(getcacheDataFromSession?.slice(6))) : router.replace(getcacheDataFromSession));
    }
    // if (cameFromInside.current) {
    //   router.back()
    // } else {
    //   if (state.isHindi) {
    //    router.replace('/hindi')
    //   } else {
    //    router.replace('/')
    //   }
    // }
  }

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

  useEffect(() => {
    // Update title
    document.title = state.isHindi ? `${`${props.feedDetail.name_hindi}, ${props.feedDetail.company_name_hindi ? props.feedDetail.company_name_hindi + ' में' : ''} ${props.feedDetail.job_title_hindi}, ${props.feedDetail.location_hindi}`}` : `${`${props.feedDetail.name}, ${props.feedDetail.job_title}${props.feedDetail.company_name ? ' at ' + props.feedDetail.company_name : ''}, ${props.feedDetail.location.charAt(0).toUpperCase() + props.feedDetail.location.slice(1)} | Profile & Intro Video`}`;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', state.isHindi ? `${`${props.feedDetail.name_hindi}, ${props.feedDetail.company_name_hindi ? props.feedDetail.company_name_hindi + ',' : ''} ${props.feedDetail.location_hindi} की प्रेरणादायक कहानी देखें।`}` : `${`Watch inspiring video story, intro video and see profile of ${props.feedDetail.name}, ${props.feedDetail.job_title}${props.feedDetail.company_name ? ' at ' + props.feedDetail.company_name : ''}, ${props.feedDetail.location.charAt(0).toUpperCase() + props.feedDetail.location.slice(1)}.`}`);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = state.isHindi ? `${`${props.feedDetail.name_hindi}, ${props.feedDetail.company_name_hindi ? props.feedDetail.company_name_hindi + ',' : ''} ${props.feedDetail.location_hindi} की प्रेरणादायक कहानी देखें।`}` : `${`Watch inspiring video story, intro video and see profile of ${props.feedDetail.name}, ${props.feedDetail.job_title}${props.feedDetail.company_name ? ' at ' + props.feedDetail.company_name : ''}, ${props.feedDetail.location.charAt(0).toUpperCase() + props.feedDetail.location.slice(1)}.`}`;
      document.head.appendChild(metaDesc);
    }
    // Update Open Graph tags
    const updateOrCreateMeta = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
      }
    };
    updateOrCreateMeta('og:title', state.isHindi ? `${`${props.feedDetail.name_hindi}, ${props.feedDetail.company_name_hindi ? props.feedDetail.company_name_hindi + ' में' : ''} ${props.feedDetail.job_title_hindi}, ${props.feedDetail.location_hindi}`}` : `${`${props.feedDetail.name}, ${props.feedDetail.job_title}${props.feedDetail.company_name ? ' at ' + props.feedDetail.company_name : ''}, ${props.feedDetail.location.charAt(0).toUpperCase() + props.feedDetail.location.slice(1)} | Profile & Intro Video`}`);
    updateOrCreateMeta('og:description', state.isHindi ? `${`${props.feedDetail.name_hindi}, ${props.feedDetail.company_name_hindi ? props.feedDetail.company_name_hindi + ',' : ''} ${props.feedDetail.location_hindi} की प्रेरणादायक कहानी देखें।`}` : `${`Watch inspiring video story, intro video and see profile of ${props.feedDetail.name}, ${props.feedDetail.job_title}${props.feedDetail.company_name ? ' at ' + props.feedDetail.company_name : ''}, ${props.feedDetail.location.charAt(0).toUpperCase() + props.feedDetail.location.slice(1)}.`}`);
    updateOrCreateMeta('og:url', HOST + pathname);
    updateOrCreateMeta('og:image', state.isHindi ? props.feedDetail.mobileThumb_hindi : props.feedDetail.mobileThumb);
    updateOrCreateMeta('og:site_name', HOME_PAGE.siteName);
    // Update Twitter tags
    updateOrCreateMeta('twitter:title', state.isHindi ? `${`${props.feedDetail.name_hindi}, ${props.feedDetail.company_name_hindi ? props.feedDetail.company_name_hindi + ' में' : ''} ${props.feedDetail.job_title_hindi}, ${props.feedDetail.location_hindi}`}` : `${`${props.feedDetail.name}, ${props.feedDetail.job_title}${props.feedDetail.company_name ? ' at ' + props.feedDetail.company_name : ''}, ${props.feedDetail.location.charAt(0).toUpperCase() + props.feedDetail.location.slice(1)} | Profile & Intro Video`}`);
    updateOrCreateMeta('twitter:description', state.isHindi ? `${`${props.feedDetail.name_hindi}, ${props.feedDetail.company_name_hindi ? props.feedDetail.company_name_hindi + ',' : ''} ${props.feedDetail.location_hindi} की प्रेरणादायक कहानी देखें।`}` : `${`Watch inspiring video story, intro video and see profile of ${props.feedDetail.name}, ${props.feedDetail.job_title}${props.feedDetail.company_name ? ' at ' + props.feedDetail.company_name : ''}, ${props.feedDetail.location.charAt(0).toUpperCase() + props.feedDetail.location.slice(1)}.`}`);
    updateOrCreateMeta('twitter:image', state.isHindi ? props.feedDetail.mobileThumb_hindi : props.feedDetail.mobileThumb);
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', HOST + pathname);
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = HOST + pathname;
      document.head.appendChild(canonical);
    }
    // Optional: Update robots meta if needed
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      robots.content = 'index, follow';
      document.head.appendChild(robots);
    }
  }, [state.isHindi, pathname]);

  return (
    <>
      <CustomStyle>{stylesCss}</CustomStyle>
      <div>
        {searchParams.get('hideBanner') != 'yes' && <div className="waveBtn animate__animated animate__jello" style={{ pointerEvents: 'none' }}>
          <i
            style={{ pointerEvents: 'auto' }}
            onClick={(e) => handleBackClick(e)}
            className={`btnClose icon icon-cancel d-flex align-items-center justify-content-center rounded-circle font-weight-bold`}
          />
          <div
            onClick={(e) => handleBackClick(e)}
            className="closeBtnWave d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgb(223, 98, 92)', cursor: 'pointer', pointerEvents: 'auto' }}
          >
            &nbsp;
          </div>
        </div>}
        <div
          className='detailsiteHeader'
          style={{ ...styles.headerContainer, ...styles[navType] }}
        >
          <nav
            className={`d-none d-md-flex ${width > 767 && width < 1400 ? 'w-92' : ''}`}
            style={state.isFlagBtn ? styles.headerDesktopNewNew : styles.headerDesktopNew}
          >
            {state.isFlagBtn && <div className="dropdown">
              <div ref={buttonRef} onClick={handleToggle} style={styles.langButtonNew} className="dropdown-toggle rounded-circle ml-2 three-btn-dot mb-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <svg width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" className="bi bi-three-dots-vertical">
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
              onClick={(e) => toggleLanguage(e)}
              className='rounded-circle ml-2 hindi-button'
              style={styles.langButtonNew}
              role='button'
            >
              {state.isHindi ? 'Eng' : 'हिंदी'}
            </div>
          </nav>
          <nav
            className='d-flex d-md-none'
            style={{ ...styles.headerMobileNew, width: 'calc(100% - 44px)' }}
          >
            <div className="dropdown">
              <div ref={mobileButtonRef} onClick={handleMobileToggle} style={styles.langButtonNew} className="dropdown-toggle rounded-circle ml-2 three-btn-dot mb-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <svg width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" className="bi bi-three-dots-vertical">
                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                </svg>
              </div>
              <div ref={mobileToggleRef} className={isMobileActive ? 'dropdown-menu show' : 'dropdown-menu'} aria-labelledby="dropdownMenuButton" x-placement="bottom-start">
                <div className='arrow-box'></div>
                <a className="dropdown-item" target="_blank" href="https://wa.me/919001985566?text=I want to report this user">Report</a>
                <a className="dropdown-item" target="_blank" href="https://wa.me/919001985566?text=I want to report this user">Help</a>
              </div>
            </div>
            <div
              onClick={(e) => toggleLanguage(e)}
              className='rounded-circle ml-2 hindi-button hindi-buttonNew'
              style={styles.langButtonNew}
              role='button'
            >
              {state.isHindi ? 'Eng' : 'हिंदी'}
            </div>
          </nav>
        </div>
        {state.isVCardShow && vCardData.length > 0 && (
          <div className='upload-section'>
            <div className='row justify-content-center align-items-center h-100'>
              <div className='col-xl-3 col-lg-5 col-md-7 col-sm-9 col-10'>
                <div className='upload-video-section px-4 py-5'>
                  <div className='main-photo d-flex justify-content-center maxHeightImage'>
                    {loading ? 'hello' : (
                      <img
                        src={photoExists ? imageSrc : 'https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg'}
                        alt='Story Detail'
                        className='img-fluid h-100 zIndexCustom'
                      />
                    )}
                  </div>
                  <h2 className='text-center main-title'>{qrData['N']}</h2>
                  <h2 className='text-center sub-title'>{qrData['ORG']}</h2>
                  <h2 className='text-center sub-sub-title'>{qrData['TEL;TYPE=CELL']}</h2>
                  <div className='bothButton'>
                    <button
                      onClick={(e) => handleCall(e)}
                      type='submit'
                      className='btn btn-primary border-0 buttonSubmitCall font-alata'
                    >
                      Call now
                    </button>
                    <button
                      onClick={(e) => downloadVCard(e)}
                      type='submit'
                      className='btn btn-primary border-0 buttonSubmitSave font-alata'
                    >
                      Save Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!!state.blogDetail && state.blogDetail.category.toLowerCase() == 'stories' ? (
          <StoryDetailPage
            toggleHindButtonOnHeader={setHindiButtonView}
            isHindi={state.isHindi}
            // storyDetail={state.blogDetail}
            storyDetail={props.feedDetail}
            userClick={props?.location?.state?.userClick} // Adjust if needed; this might need to be passed differently
            isLayoverPlayBtn={state.isLayoverPlayBtn}
          />
        ) : (
          <div className='BlogDetail-contentPlaceholder'>
            <PHStoryLoader />
            <div className='BlogDetail-mobilePlaceholder'></div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogDetailPage;

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
    color: '#fff',
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
    backgroundColor: 'transparent',
  },
  scrollNav: {
    zIndex: 8,
    backgroundColor: '#000',
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
}

const stylesCss = `
  .BlogDetail-mobilePlaceholder {
    background: #191919;
    display: none;
  }

  .BlogDetail-mobilePlaceholder::before {
    content: '';
    display: block;
    padding-top: 178%;
  }

  @media (max-width: 767px) {
    .BlogDetail-mobilePlaceholder {
      display: block;
    }

    .BlogDetail-contentPlaceholder > :first-child {
      display: none;
    }
  }

  .upload-section {
    position: fixed;
    z-index: 8;
    width: 100%;
    height: 100%;
    background-color: hsla(27, 64%, 5%, 0.87);
    top: 0;
    bottom: 0;
  }
  .upload-video-section {
    background-color: rgba(4, 31, 74, 0.6);
    color: #fff;
    padding: 27px 16px;
    border-radius: 12px;
    margin-bottom: 40px;
    margin-top: 40px;
  }
  .upload-video-section .main-title {
    font-family: "Montserrat", sans-serif;
    color: #fff;
    font-weight: 500;
    font-size: 18px;
    margin-top: 18px;
    line-height: 1.4;
    margin-bottom: 0;
  }
  .upload-video-section .sub-title {
    font-family: "Montserrat", sans-serif;
    color: #fff;
    font-weight: 500;
    font-size: 18px;
    margin-top: 9px;
    line-height: 1.4;
    margin-bottom: 0;
  }
  .upload-video-section .sub-sub-title {
    font-family: "Montserrat", sans-serif;
    color: #fff;
    font-weight: 500;
    font-size: 18px;
    margin-top: 9px;
    line-height: 1.4;
    margin-bottom: 30px;
  }
  .upload-video-section .buttonSubmitCall {
    background-color: rgba(2, 50, 124, 1);
    border-radius: 100px;
    height: 40px;
    padding-left: 40px;
    padding-right: 40px;
    font-weight: 500;
    font-size: 16px;
  }
  .upload-video-section .buttonSubmitSave {
    background-color: rgba(2, 50, 124, 1);
    border-radius: 100px;
    height: 40px;
    padding-left: 30px;
    padding-right: 30px;
    font-weight: 500;
    font-size: 16px;
  }
  .bothButton {
    display: flex;
    justify-content: space-around;
  }
  .maxHeightImage {
    max-height: 229px;
    max-width: 229px;
    margin: 0 auto;
    border-radius: 12px;
  }
  @media only screen and (max-width: 420px) {
    .upload-video-section .buttonSubmitCall {
      padding-left: 29px !important;
      padding-right: 29px !important;
      font-size: 15px !important;
    }

    .upload-video-section .buttonSubmitSave {
      padding-left: 17px !important;
      padding-right: 17px !important;
      font-size: 15px !important;
    }
  }
  .zIndexCustom {
    border-radius: 20px;
    height: 229px;
  }
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
