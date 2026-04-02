'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/database';
import { SCREEN_NAME } from '@/app/constants/firebaseString';
import useWindowSize from '@/app/utils/useWindowSize';
import Modal from '../common/Modal/Modal';
import SocialShare from '../common/SocialShare';
import { COMMON_HASHTAG } from '@/app/constants/localString';
import { useSelector, useDispatch } from 'react-redux';
import CustomStyle from '../common/CustomStyle';
import { StoryViewsFirebase } from '@/app/firebase/initFirebase';
import { setLayoverPlayBtn } from '@/app/lib/features/blogSlice';
import StoryPageMobileVideoContainer from './StoryPageMobileVideoContainer';
import VideoContainerDetailPageWeb from './VideoContainerDetailPageWeb';
import { transform } from 'lodash';

const StoryDetailPageBanner = (props) => {
  const { width } = useWindowSize();
  const [showAlert, toggleAlert] = useState(false);
  const [showShareBtns, setShowShareBtns] = useState(false);
  const [showAppDownload, setShowAppDownload] = useState(false);
  const [viewCount, setViewCount] = useState(null);
  const [ip, setIP] = useState('');
  const pathname = usePathname();
  const state = useSelector((state) => state.blog);
  const isHindi = state.isHindi;
  const dispatch = useDispatch();

  // Extract story details
  let {
    storyHeading,
    job_title_hindi,
    storyHeading_hindi,
    job_title,
    videoUrl,
    thumb,
    quote,
    quote_hindi,
    industry_hindi,
    workmobUserName = '',
    name,
    name_hindi,
    location,
    location_hindi,
    date_hindi,
    metaTitle,
    metaDesc,
    company_name,
    company_name_hindi,
    isSmall = false,
    storyType,
    website,
    facebook,
    instagarm,
    youtube,
    linkedin,
    twitter,
    ebook,
    mobileVideoThumb,
  } = props.storyDetail || {};

  const slugName = pathname?.split('/').pop();

  useEffect(() => {
    getDataIp();
  }, []);

  useEffect(() => {
    if (!ip || !slugName) return;
    const postData = {
      user_id: '',
      name: '',
      Os: 'website',
      Version: '',
      ip_address: ip,
      updated_time: Date.now(),
    };
    const newPostKey = firebase.database(StoryViewsFirebase).ref().child('StoriesViews').push().key;
    const updates = {};
    updates[newPostKey] = postData;
    firebase.database(StoryViewsFirebase).ref('StoriesViews').child(slugName).update(updates);
  }, [ip, slugName]);

  useEffect(() => {
    if (!slugName) return;
    const db = firebase.database(StoryViewsFirebase).ref('StoriesViews').child(slugName);
    db.on('value', snapshot => {
      const data = snapshot.val();
      if (data) setViewCount(Object.keys(data).length);
    });
    return () => db.off();
  }, [slugName]);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', showAppDownload);
  }, [showAppDownload]);

  const getDataIp = async () => {
    try {
      const res = await axios.get('https://api.ipify.org/');
      setIP(res.data);
    } catch (err) {
      console.error('IP fetch failed', err);
    }
  };

  if (isHindi) {
    storyHeading = storyHeading_hindi;
    name = name_hindi;
    location = location_hindi;
    company_name = company_name_hindi;
    quote = quote_hindi;
    storyType = industry_hindi;
    job_title = job_title_hindi;
  }

  function closeAppDownloadOverlay(event) {
    if (event.target.className === 'bannerAppDownload') {
      setShowAppDownload(false);
    }
  }

  const handleOpenVcfContact = () => {
    dispatch(props?.setVCard(true))
  }

  // Helper: detect mobile
  function isMobile() {
    if (typeof window !== 'undefined') {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        window?.navigator?.userAgent
      );
    }
  }

  const reactionIconsElem = (
    <>
      <div
        style={styles.reactionIconBackgroud}
        className={showShareBtns ? 'd-md-none' : ''}
        onClick={() => setShowAppDownload(true)}
      >
        {/* Like */}
        <svg viewBox='0 0 56.811 49.938' style={styles.reactionIcon}>
          <path
            d='M-179.583,321.363a6.146,6.146,0,0,1-3.861-1.563c-1.326-1.1-2.672-2.175-4.017-3.254-5.184-4.154-10.543-8.452-14.812-13.869-6.147-7.8-5.877-16.89.687-23.155,6.487-6.194,13.2-5.925,21.065.879,5.4-6.791,12.136-7.726,20.047-2.776,7.7,4.821,9.745,13.661,5.077,21.992-3.91,6.979-10,11.726-15.882,16.316-1.812,1.411-3.684,2.874-5.452,4.368A4.345,4.345,0,0,1-179.583,321.363Z'
            transform='translate(208.203 -272.926)'
            fill='none'
            stroke='#fff'
            strokeWidth='3'
          />
        </svg>
      </div>
      <div
        style={styles.reactionIconBackgroud}
        className={showShareBtns ? 'd-md-none' : ''}
        onClick={() => setShowAppDownload(true)}
      >
        {/* Comment */}
        <svg viewBox='0 0 58.267 55.059' style={styles.reactionIcon}>
          <path
            d='M1242.634,446.43c-15.262,0-27.633,10.292-27.633,22.986a21.09,21.09,0,0,0,7.823,16l-2.8,12.089,14.856-6.04a32.985,32.985,0,0,0,7.753.932c15.261,0,27.633-10.29,27.633-22.986S1257.894,446.43,1242.634,446.43Z'
            transform='translate(-1213.5 -444.93)'
            fill='none'
            stroke='#fff'
            strokeWidth='3'
          />
        </svg>
      </div>
      <div className='position-relative'>
        <div style={styles.reactionIconBackgroud} onClick={() => setShowShareBtns(!showShareBtns)}>
          {showShareBtns ? (
            // close
            <svg viewBox='0 0 512 512' style={styles.reactionIcon}>
              <path
                fill='currentColor'
                d='M331.3 180.7c-6.25-6.25-16.38-6.25-22.62 0L256 233.4L203.3 180.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62L233.4 256L180.7 308.7c-6.25 6.25-6.25 16.38 0 22.62c6.246 6.246 16.37 6.254 22.62 0L256 278.6l52.69 52.69c6.246 6.246 16.37 6.254 22.62 0c6.25-6.25 6.25-16.38 0-22.62L278.6 256l52.69-52.69C337.6 197.1 337.6 186.9 331.3 180.7zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256S512 397.4 512 256S397.4 0 256 0zM256 480c-123.5 0-224-100.5-224-224s100.5-224 224-224s224 100.5 224 224S379.5 480 256 480z'
              />
            </svg>
          ) : (
            // share
            <svg viewBox='0 0 55.212 53.223' style={styles.reactionIcon}>
              <path
                d='M54.681,15.837,40.217,3.1a1.147,1.147,0,0,0-.8-.4,1.189,1.189,0,0,0-1.194,1.194h0V9.733a29.867,29.867,0,0,0-9.687,1.99S2,24.861,2,52.727a1.309,1.309,0,0,0,1.327,1.194c.663,0,1.062-.531,1.194-1.194,0-11.943,5.971-20.436,17.914-25.345A65.893,65.893,0,0,1,38.359,23.8v5.706A1.189,1.189,0,0,0,39.554,30.7h0a.946.946,0,0,0,.8-.4L54.814,17.562a1.147,1.147,0,0,0,.4-.8,2.139,2.139,0,0,0-.531-.929'
                transform='translate(-1 -1.699)'
                fill='none'
                stroke='#fff'
                strokeWidth='2'
              />
            </svg>
          )}
        </div>
        <SocialShare
          customClass='bannerShareBtns mb-1'
          customStyle={showShareBtns ? styles.shareBtnVisible : styles.shareBtnsHidden}
          emailText={metaDesc}
          storyHeading={storyHeading}
          emailSub='Watch this inspiring video'
          fbTitle={COMMON_HASHTAG.inspiringStories}
          twitterTitle={`${storyHeading}. Watch an inspiring story. ${COMMON_HASHTAG.common}`}
          embedLink={`https://stories.workmob.com${pathname}`}
          // copyLink={
          //   workmobUserName &&
          //   `https://www.workmob.com/${isHindi ? 'hindi/' : ''}${workmobUserName.toLowerCase()}`
          // }
          copyLink={`https://stories.workmob.com${pathname}`}
        />
      </div>
    </>
  );

  const socialLinksElem = (
    <>
      <div style={styles.socialLinks} className={width < 969 ? 'mb-18 social-bottom' : 'social-bottom'}>
        <span style={styles.linkLabel}>Connect with me</span>
        <div style={styles.iconGroup}>
          <a
            target='_blank'
            // href='https://wa.me/919001985566?text=I want to join your movement.'
            href={
              `https://wa.me/919001985566?text=` +
              (workmobUserName
                ? `I want to connect with @${workmobUserName}`
                : 'I want to join your movement.')
            }
            style={styles.iconLink}
          >
            <svg
              width='48'
              height='48'
              viewBox='0 0 48 48'
              style={{ ...styles.iconSvg, margin: 0 }}
            >
              <path
                d='M11.61,44.575a23.825,23.825,0,0,0,12.306,3.408A24.123,24.123,0,0,0,48,23.992a23.992,23.992,0,1,0-44.575,12.4L0,48ZM2.829,23.992a21.079,21.079,0,1,1,9.744,17.873l-.541-.345L4.159,43.842l2.323-7.874-.345-.54A21.176,21.176,0,0,1,2.829,23.992Zm0,0'
                transform='translate(0 -0.001)'
                fill='#fff'
              />
              <path
                d='M121.461,103.719a21.526,21.526,0,0,0,17.265,17.265c2.836.54,7,.622,9.033-1.413l1.134-1.134a3.031,3.031,0,0,0,0-4.287l-4.535-4.535a3.032,3.032,0,0,0-4.287,0l-1.134,1.134a2.017,2.017,0,0,1-2.7.008l-4.523-4.713-.02-.021a1.781,1.781,0,0,1,0-2.516l1.134-1.134a3.029,3.029,0,0,0,0-4.287l-4.535-4.535a3.035,3.035,0,0,0-4.287,0l-1.134,1.134h0c-1.623,1.624-2.165,5.085-1.413,9.034Zm3.432-7.014c1.19-1.163,1.127-1.185,1.258-1.185a.175.175,0,0,1,.124.051c4.779,4.8,4.587,4.522,4.587,4.66a.172.172,0,0,1-.051.124l-1.134,1.134a4.632,4.632,0,0,0-.011,6.543l4.526,4.716.021.021a4.87,4.87,0,0,0,6.744,0l1.134-1.134a.176.176,0,0,1,.248,0c4.779,4.8,4.587,4.522,4.587,4.659a.171.171,0,0,1-.051.124l-1.134,1.134c-.777.777-3.252,1.242-6.48.627a18.671,18.671,0,0,1-14.994-14.994c-.615-3.228-.15-5.7.627-6.48Zm0,0'
                transform='translate(-110.025 -84.172)'
                fill='#fff'
              />
            </svg>
          </a>
          {!!facebook?.length && (
            <a href={facebook} target='_blank' style={styles.iconLink}>
              <img
                width="100%"
                height="auto"
                style={styles.iconSvg}
                src='https://cdn.workmob.com/stories_workmob/images/common/facebook.svg'
                alt='facebook icon'
              />
            </a>
          )}
          {!!instagarm?.length && (
            <a href={instagarm} target='_blank' style={styles.iconLink}>
              <img
                width="100%"
                height="auto"
                style={styles.iconSvg}
                src='https://cdn.workmob.com/stories_workmob/images/common/instagram.svg'
                alt='instagram icon'
              />
            </a>
          )}
          {!!youtube?.length && (
            <a href={youtube} target='_blank' style={styles.iconLink}>
              <img
                width="100%"
                height="auto"
                style={styles.iconSvg}
                src='https://cdn.workmob.com/stories_workmob/images/common/youtube.svg'
                alt='youtube icon'
              />
            </a>
          )}
          {!!twitter?.length && (
            <a href={twitter} target='_blank' style={styles.iconLink}>
              <img
                style={styles.iconSvg}
                width="100%"
                height="auto"
                src='https://cdn.workmob.com/stories_workmob/images/common/twitter.svg'
                alt='twitter icon'
              />
            </a>
          )}
          {!!linkedin?.length && (
            <a href={linkedin} target='_blank' style={styles.iconLink}>
              <img
                style={styles.iconSvg}
                width="100%"
                height="auto"
                src='https://cdn.workmob.com/stories_workmob/images/common/linkedin.svg'
                alt='linkedin icon'
              />
            </a>
          )}
        </div>
      </div>
      {!!website?.length && (
        <a
          className='visitWebsiteBannerMob montserrat-regular newVisit'
          style={styles.visitWebsite}
          target='_blank'
          href={website}
        >
          Visit my website
        </a>
      )}
    </>
  );

  const downloadLinksElem = (
    <div
      className={`${!!ebook?.length ? '' : 'd-none'}`}
      style={styles.socialLinks}
    >
      <span style={styles.linkLabel}>Download</span>
      {!!ebook?.length && (
        <a style={styles.iconGroup} href={ebook}>
          eBook
          <svg viewBox='0 0 91.962 122.627' style={styles.iconSvg}>
            <g transform='translate(0 0)'>
              <path
                d='M8.617,122.606a32.888,32.888,0,0,1-4.937-2.48A9.237,9.237,0,0,1,.021,112.9C0,112.585,0,112.267,0,111.946V10.678C0,6.341,1.815,3.015,5.729,1.107A10.9,10.9,0,0,1,10.321.042q26.571-.108,53.149,0a3.992,3.992,0,0,1,2.516,1.053Q78.5,13.464,90.881,25.987a3.989,3.989,0,0,1,1.032,2.537q.078,41.9.033,83.791a10.157,10.157,0,0,1-7.843,10.03c-.258.072-.51.18-.765.27ZM61.307,5.18c-.471-.024-.786-.054-1.1-.054H10.885c-3.83,0-5.75,1.986-5.75,5.891v100.56c0,3.956,1.926,5.882,5.882,5.885H80.929a8.4,8.4,0,0,0,2.358-.282c2.4-.711,3.533-2.588,3.533-5.7V30.657H71.685A10.27,10.27,0,0,1,61.3,20.156ZM66.439,9.2v9.985a17.787,17.787,0,0,0,.084,1.8,4.71,4.71,0,0,0,4.5,4.43c3.02.147,6.053.081,9.079.1h2.639Z'
                transform='translate(0 0.013)'
                fill='#fff'
              />
              <path
                d='M86.32,142.429a15.9,15.9,0,0,1,.081,6.3c-.18.951-.369,1.869-.6,2.771-.624,2.384-1.446,4.718-2.1,7.1a1.989,1.989,0,0,0,.3,1.56,62.514,62.514,0,0,0,9.94,9.6,2.54,2.54,0,0,0,1.6.438c3.4-.417,6.788-1.062,10.231-.528a13.587,13.587,0,0,1,2.774.657c2.927,1.113,4.136,3.3,3.68,6.428-.438,3-2.507,4.829-5.567,5.4s-5.4-.921-7.771-2.4c-1.572-.969-3.071-2.043-4.538-3.161a2.2,2.2,0,0,0-2.136-.522c-5.135,1.413-10.291,2.744-15.417,4.2a2.856,2.856,0,0,0-1.5,1.332,45.326,45.326,0,0,1-7.864,11.074c-2.25,2.241-4.676,4.331-7.933,4.826a7.849,7.849,0,0,1-7.175-2.475c-2.217-2.378-1.8-6.08,1.122-8.443a36.6,36.6,0,0,1,6.1-3.926c3.806-1.992,7.735-3.755,11.587-5.669a2.444,2.444,0,0,0,1.158-1.2q2.618-7.3,5.1-14.649a1.825,1.825,0,0,0-.372-1.362c-2.1-2.927-4.124-5.894-5.054-9.427a13.9,13.9,0,0,1,1.377-11.275,5.447,5.447,0,0,1,3.875-2.552c3.851-.618,6.974.072,8.254,3.1A15.569,15.569,0,0,1,86.32,142.429ZM79.6,154.372c1-3.659,2.474-7.019,1.854-10.78-.3-1.848-1.515-2.8-3.155-1.971a3.51,3.51,0,0,0-1.437,2.12C75.868,147.651,77.355,150.992,79.6,154.372Zm7.762,17.417L81.5,165.242c-1,3-1.944,5.843-2.945,8.86Zm-20.1,13.116c.3-.585.3-.681-.3-.372-3.083,1.7-6.179,3.392-9.241,5.132a5.469,5.469,0,0,0-1.287,1.227c-.408.462-.3.867.276,1.131a3.4,3.4,0,0,0,3.3-.018,23.493,23.493,0,0,0,7.258-7.1Zm33.725-10.318c-1.053-.084-1.062-.375-.108.351a22.516,22.516,0,0,0,2.292,1.422,8.136,8.136,0,0,0,2.336.714c.717.1,1.485-.054,1.566-1.035s-.7-1.074-1.353-1.134c-1.566-.15-3.149-.219-4.727-.318Z'
                transform='translate(-35.649 -95.422)'
                fill='#fff'
              />
            </g>
          </svg>
        </a>
      )}
    </div>
  );

  return (
    <>
      <CustomStyle>{styleString}</CustomStyle>
      {/* <LazyLoadImage
        className='detail-Poster'
        src={mobileVideoThumb}
        description={`${name} - ${metaTitle} - ${metaDesc} - ${slugName}`}
        title={`${name} - ${metaTitle} - ${metaDesc} - ${slugName}`}
        alt={`${name} - ${metaTitle} - ${metaDesc} - ${slugName}`}
        fetchPriority='high'
        draggable='false'
        threshold={25}
      /> */}
      {/* <span className='w-100 lazyLoad-card-inspiring lazy-load-image-background blur lazy-load-image-loaded' style={{ color: 'transparent', display: 'inline-block', height: '100%' }}>
        <Image
          className='detail-Poster'
          src={mobileVideoThumb}
          alt={`${name} - ${metaTitle} - ${metaDesc} - ${slugName}`}
          title={`${name} - ${metaTitle} - ${metaDesc} - ${slugName}`}
          width={500}
          height={300}
          priority
        />
      </span> */}
      <div
        style={{
          minHeight: '336px',
          background: '#3f3f3f',
        }}
        className='jumbotron bg-trabsparent p-0 mb-3 position-relative detailPage text-white d-md-block d-none'
      >
        <div className='position-relative'>
          <div style={{ paddingTop: '40.84%' }}></div>
        </div>
        <div style={styles.overlay} className='position-absolute h-100 w-100'></div>
        <div
          style={{ top: 0, left: 0 }}
          className='position-absolute h-100 w-100 d-flex align-items-center'
        >
          <div className={width > 767 && width < 1400 ? 'w-100 h-100 mr-0 mr-md-5 pl-0 m-l-23' : 'w-100 h-100 mx-0 mx-md-5 px-0 px-md-5'}>
            <div className={`d-flex align-items-end justify-content-between h-100 pb-4 mx-0 ${width > 1300 ? 'mx-5' : ''} ${width > 767 && width < 1400 ? 'ml-0 m-t-172' : ''} ${width < 969 ? 'cust-mt-62' : ''}`}>
              {!!isSmall && (
                <div style={{ maxHeight: '100%' }} className='col-md-4 col-sm-1 d-xl-block d-none'>
                  &nbsp;
                </div>
              )}
              <div className='col-xl-9 col-lg-8 col-md-8 px-3 position-relative' style={{ zIndex: 1 }}>
                <h1
                  className={`bannerHeading text-white font-weight-bold heading ${isHindi ? 'font-khand' : 'montserrat-regular'} font-50`}
                  style={{ lineHeight: isHindi ? '1.5' : '', marginBottom: '0.5em' }}
                >
                  <div className='mb-2 mx-0'>
                    <div
                      style={{ zIndex: 1 }}
                      className='badge badge-dark rounded p-2 mb-0 position-relative'
                    >
                      {storyType}
                    </div>
                  </div>
                  <span className={`StoryDetailPageBanner-heading hpSimplified ${isHindi ? 'font-khand' : 'font-regular'} font-color`}>{storyHeading}</span>
                  <p className='d-flex align-items-center flex-row flex-wrap mt-1'>
                    {!!company_name && (
                      <span className='bannerDetail d-flex align-items-center location pr-3 mb-1'>
                        <i
                          style={{ marginTop: -2, marginLeft: -8 }}
                          className='icon icon-company'
                        />
                        {!!job_title ? `${job_title}, ${company_name}` : company_name}
                      </span>
                    )}
                    {!!location && (
                      <span className='bannerDetail d-flex align-items-center location minus'>
                        <i className='icon icon-location' />
                        {location}
                      </span>
                    )}
                  </p>
                </h1>
                {!!quote && (!isSmall || width < 700) && (
                  <blockquote className={`h3 ${isHindi ? 'font-khand' : 'baskervville-regular'} darkGreen position-relative font-40 mb-3 sub-heading newQuotes`}>
                    {quote}
                  </blockquote>
                )}
                <div style={width < 969 ? { ...styles.socialLinksNow, marginBottom: '1em' } : { ...styles.socialLinks, marginBottom: '1em' }}>
                  {socialLinksElem} {props?.storyDetail?.show_contact && props?.vCardData.length > 0 && props?.storyDetail?.hasOwnProperty("show_contact") && <span onClick={handleOpenVcfContact} style={{ cursor: 'pointer' }} className='vcfContact'>Contact me</span>}
                </div>
                {downloadLinksElem}
              </div>
              <div className='col-xl-3 col-lg-4 col-md-4' style={{ paddingLeft: width > 1024 && width < 1400 ? '35px' : '', paddingRight: width > 1024 && width < 1400 ? '35px' : '' }}>
                <div className={`mobileSectionCol ${width > 767 && width < 1400 ? 'mb-0' : ''} ${width < 768 ? 'mb-5' : ''}`}>
                  <div className={width > 767 && width < 1400 ? 'videoDetailContainerPaddingClassNow' : 'videoDetailContainerPaddingClass'} />
                  {width > 768 && (
                    <VideoContainerDetailPageWeb
                      videoUrl={videoUrl}
                      screenName={SCREEN_NAME.storyDetail}
                      poster={thumb}
                      userClick={props?.userClick}
                      isLayoverPlayBtn={state.isLayoverPlayBtn}
                      setLayoverPlayButton={setLayoverPlayBtn}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={width > 767 && width < 1400 ? styles.reactionIconsDesktopNH : styles.reactionIconsDesktop}>{reactionIconsElem}</div>
      </div>

      {/* mobile layout */}
      <div className='d-md-none' style={styles.bannerMobileLayout}>
        <div style={styles.bannerMobileContainer}>
          <div style={styles.mobileImgContainer}>
            <div style={{ paddingTop: '178%' }}></div>
            <div style={styles.reactionIconsMobile}>{reactionIconsElem}</div>
            {width < 768 && isMobile() && (
              <StoryPageMobileVideoContainer
                url={videoUrl}
                userClick={props?.userClick}
                title={name}
                isLayoverPlayBtn={state.isLayoverPlayBtn}
                setLayoverPlayButton={setLayoverPlayBtn}
              />
            )}
          </div>
        </div>
        {!!quote && <blockquote className='mobileNewQuotes' style={isHindi ? styles.hindibannerMobileQuote : styles.bannerMobileQuote}>{quote}</blockquote>}
        <div style={{ ...styles.socialLinksMobile, display: 'block !important' }}>
          {socialLinksElem} {props?.storyDetail?.show_contact && props?.vCardData.length > 0 && props?.storyDetail?.hasOwnProperty("show_contact") && <span onClick={handleOpenVcfContact} style={{ cursor: 'pointer' }} className='vcfContact'>Contact me</span>}
        </div>
        <div style={styles.socialLinksMobile}>
          {downloadLinksElem}
        </div>
      </div>
      {showAppDownload && (
        <div
          className='bannerAppDownload'
          style={styles.appDownloadOverlay}
          onClick={closeAppDownloadOverlay}
        >
          <div style={styles.appDownloadPopup}>
            <i
              className='icon-cancel'
              style={styles.closeDownloadPopup}
              onClick={() => setShowAppDownload(false)}
            ></i>
            <div style={styles.appDownloadHeading}>Download app</div>
            <div className='d-flex'>
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
          </div>
        </div>
      )}
      <Modal showAlert={showAlert} toggleAlert={toggleAlert} />
    </>
  );
};

export default StoryDetailPageBanner;

const styleString = `
  .visitWebsiteBannerMob{
    background:none !important;
    border:1px solid white;
    margin-right: 12px;
  }
  .newVisit {
    font-weight: 600;
    font-size: 13px;
    padding: 0.48em 1em !important;
    opacity: 0.5;
    border-width: 2px;
  }
  .detail-Poster{
    position: absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    opacity:0;
    pointer-events: none;
  }
  .bannerShareBtns {
    transition: opacity linear 100ms;
    position: absolute;
    bottom: 100% !important;
    right: initial;
    left: 0%;
    background: transparent;
  }

  .bannerShareBtns ul {
    flex-direction: column !important;
  }

  .date-content {
    bottom: -15px;
    right: 0;
  }

  .StoryDetailPageBanner-heading {
    color: rgb(253, 203, 92);
    filter: drop-shadow(black 0.05em 0.1em 0.05em);
  }
  .mobileSectionCol{
    position:relative;
    transform: perspective(1000px) rotateY(-20deg) rotateX(2deg) rotate(1deg) translateX(-20px);
    z-index: 1;
  }
  .videoDetailContainerPaddingClass{
    padding-top:178%;
    border-radius: 35px;
    background:black
  }
  .videoDetailContainerPaddingClassNow{
    padding-top: 178%;
    // padding-top:169%;
    border-radius: 35px;
    background:black
  }
  
  @media (max-width: 940px) {
    .bannerHeading {
      font-size: 19px;
    }

    .bannerDetail {
      font-size: 16px !important;
    }

  }

  @media (max-width: 767px) {
    .social-bottom{
      margin-bottom: 10px;
    }
    .visitWebsiteBannerMob{
      line-height:1.7 !important;
      padding: 0.45em 0.8em !important;
      margin-right: 12px;
    }
  }
  .font-color {
      color: #FFD736;
  }
  .newQuotes::before {
      width: 69px !important;
      height: 45px !important;
      top: -11px !important;
      left: -31px !important;
      background-size: contain !important;
      background-repeat: no-repeat !important;
  }
  .cust-mt-62 {
      margin-top: 62px;
  }
  .mobileNewQuotes::before {
      left: -4px !important;
      top: -7px !important;
  }
  .mb-18 {
      margin-bottom: 18px;
  }
       .vcfContact {
      opacity: .5;
      color: rgba(255, 255, 255, 1);
      font-weight: 600;
      font-size: 13px;
      padding-top: .47em !important;
      padding-bottom: .47em !important;
      padding-left: 1.8em !important;
      padding-right: 1.8em !important;
      border: 2px solid rgba(255, 255, 255, 1);
      border-radius: 9999px;
      line-height: 1.7;
      font-family: Montserrat, sans-serif;
  }
`;

const styles = {
  overlay: {
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bannerDesktopImg: {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
  videoLink: {
    width: '100px',
    height: '100px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    borderRadius: '50%',
    textDecoration: 'none',
    display: 'flex',
  },
  bannerPlayButton: {
    fontSize: '2.5em',
    width: '50%',
    height: '50%',
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.5)',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    paddingLeft: '0.1em',
  },
  shareBtnVisible: {
    opacity: 1,
    pointerEvents: 'auto',
  },
  shareBtnsHidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
  reactionIconsDesktop: {
    position: 'absolute',
    right: '1.7em',
    bottom: '0.85em',
    cursor: 'pointer',
    position: 'absolute',
    zIndex: 1,
  },
  reactionIconsDesktopNH: {
    position: 'absolute',
    right: '1.7em',
    bottom: '0',
    cursor: 'pointer',
    position: 'absolute',
    zIndex: 1,
    transform: 'translateY(158px)'
  },
  reactionIcon: {
    width: '20px',
  },
  reactionIconBackgroud: {
    borderRadius: '50%',
    textAlign: 'center',
    width: '32px',
    background: 'rgba(0, 0, 0, 0.5)',
    padding: '4px 0px',
    marginBottom: '5px',
    marginRight: '5px',
  },
  socialLinks: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '1.1em',
    lineHeight: 1.9,
  },
  socialLinksNow: {
    display: 'block',
    alignItems: 'center',
    marginRight: '1.1em',
  },
  viewsShow: {
    position: 'absolute',
    bottom: '4px',
  },
  iconGroup: {
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '1.1em',
  },
  linkLabel: {
    fontSize: '1em',
    fontWeight: 'bold',
    fontFamily: 'Montserrat, sans-serif',
    opacity: 0.8,
  },
  iconLink: {
    color: 'inherit',
  },
  iconSvg: {
    width: '1.5em',
    height: '1.5em',
    marginLeft: '1em',
  },
  visitWebsite: {
    color: 'inherit',
    padding: '0.25em 0.6em',
    borderRadius: '30px',
    background:
      'center/100% 100% url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    lineHeight: '1.5',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    // marginLeft: '1.1em',
    marginRight: '14px',
  },
  appDownloadOverlay: {
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.93)',
    position: 'fixed',
    zIndex: '11',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appDownloadPopup: {
    width: '400px',
    maxWidth: 'calc(100% - 2em)',
    minHeight: '130.94px',
    borderRadius: '0.8em',
    padding: '1em 1em 1.5em',
    backgroundImage: 'url(https://cdn.workmob.com/stories_workmob/images/common/blog_bg.webp)',
    backgroundSize: '100% 100%',
    position: 'relative',
    border: '1px solid #757575',
  },
  appDownloadHeading: {
    fontSize: '1.4em',
    marginBottom: '1em',
    textAlign: 'center',
  },
  closeDownloadPopup: {
    fontSize: '1.8em',
    width: '1em',
    height: '1em',
    padding: '0.6em',
    position: 'absolute',
    top: '0',
    right: '0',
    transform: 'translate(25%, -25%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    background: 'rgb(195, 61, 235)',
    cursor: 'pointer',
  },
  // mobile
  viewsShowMobile: {
    position: 'absolute',
    bottom: '8px',
  },

  bannerMobileLayout: {
    width: 'calc(100% - 1.5em)',
    color: '#fff',
    margin: '1em auto 0',
    position: 'relative',
    zIndex: 1,
  },
  bannerMobileContainer: {
    padding: '0.5em',
    marginBottom: '1.3em',
    background: 'linear-gradient(118deg, #e34a28 25%, #fff, #2f8707 75%)',
  },
  mobileImgContainer: {
    background: '#1c1c1c',
    position: 'relative',
  },
  bannerMobileImg: {
    width: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
  },
  bannerMobileImgOverlay: {
    background: 'linear-gradient(transparent 80%, rgba(0, 0, 0, 0.6))',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
  bannerInfoContainer: {
    width: '100%',
    padding: '0.65em',
    position: 'absolute',
    bottom: '0',
  },
  bannerStoryType: {
    fontSize: '0.8em',
    display: 'inline-block',
    color: 'inherit',
    background: 'rgba(0, 0, 0, 0.5)',
    padding: '0.25em 0.5em',
    marginBottom: '0.5em',
    borderRadius: '5px',
    lineHeight: '1.7',
  },
  bannerSubInfo: {
    padding: '0.8em 0.5em',
    border: '4px solid #fff',
    background: 'black',
    textAlign: 'center',
  },
  bannerName: {
    font: 'bold 1.5em Alata, sans-serif',
    color: '#e34a28',
    textTransform: 'uppercase',
  },
  bannerJobTitle: {
    fontWeight: 'bold',
  },
  bannerLocation: {
    textTransform: 'capitalize',
  },
  reactionIconsMobile: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: '1.25%',
    left: '5px',
    zIndex: '1',
  },
  bannerMobileQuote: {
    font: '1.4em Baskervville',
    color: '#8fc9c7',
    position: 'relative',
  },
  hindibannerMobileQuote: {
    font: '1.4em Khand',
    color: '#8fc9c7',
    position: 'relative',
  },
  socialLinksMobile: {
    fontSize: '11.2px',
    marginBottom: '1em',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerDateMobile: {
    fontSize: '1.15em',
    color: '#d5d5d5',
  },
};
