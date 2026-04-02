'use client'; // Mark as client component since it uses hooks and client-side logic

import React, { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Next.js navigation hooks
import StoryDetailPageBanner from '../components/StoryDetail/StoryDetailPageBanner';
import StoryDetailPageContent from '../components/StoryDetail/StoryDetailPageContent';
import StoryDetailPageMoreVideos from '../components/StoryDetail/StoryDetailPageMoreVideos';
import ErrorBoundary from '../components/ErrorBoundry';
import { SCREEN_NAME } from '../constants/firebaseString';
import { setHindiButtonView } from '../lib/features/blogSlice';
import { trackScreen } from '../firebase/firebase';
import CustomStyle from '../components/common/CustomStyle';
import { useSelector, useDispatch } from 'react-redux';
import ReactHlsPlayer from '../components/HSL/components/react-hls-player';
import StoryDetailPageFooterNew from '../components/StoryDetail/StoryDetailPageFooterNew';
import useWindowSize from '../utils/useWindowSize';

const StoryDetailPage = (props) => {
  const router = useRouter();
  const pathname = usePathname();
  const detailPageRef = useRef();
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.blog);

  const backgroundVideo =
    state?.blogDetail?.video_url_landscape ||
    'https://cdn.workmob.com/stories_workmob/story_background_teaser/default-video/default-video.m3u8';

  useEffect(() => {
    sessionStorage.setItem('blogPath', pathname); // Use pathname from usePathname
  }, [pathname]);

  useEffect(() => {
    trackScreen(SCREEN_NAME.storyDetail);
    dispatch(setHindiButtonView(true));
    if (typeof window !== 'undefined') { // Check for window to avoid SSR issues
      window.scrollTo(0, 0);
    }
    return () => {
      dispatch(setHindiButtonView(false));
    };
  }, []);

  const { blogDetail, isHindi } = state;
  let { metaTitle, metaTitle_hindi, metaDesc, mobileThumb, mobileThumb_hindi, thumb } = blogDetail;

  if (isHindi || pathname.includes('/hindi/')) { // Use pathname from usePathname
    metaTitle = metaTitle_hindi;
    mobileThumb = mobileThumb_hindi;
  }

  return (
    <>
      <CustomStyle>{styleString}</CustomStyle>
      <ReactHlsPlayer
        playerRef={detailPageRef}
        className={`detailPageMainBackground`}
        url={backgroundVideo}
        controls={false}
        autoPlay={true}
        preload='auto'
        muted={true}
        playsInline={true}
        loop={true}
        id='detailPageMainBackground'
        onPlay={() => {
          const image = document.getElementsByClassName('detailPageBackgroundImage')[0];
          image.classList.add('d-none');
        }}
      />
      <img
        className='detailPageBackgroundImage'
        src='https://cdn.workmob.com/stories_workmob/web_home/earth_bg.webp'
      />
      <section style={{ paddingLeft: width > 767 && width < 1400 ? '26px' : '', paddingRight: width > 767 && width < 1400 ? '26px' : ''}} className='story-detail-page'>
        <ErrorBoundary>
          <StoryDetailPageBanner storyDetail={props?.storyDetail} vCardData={props?.vCardData} setVCard={props?.setVCard} />
        </ErrorBoundary>

        {/* Uncommented the commented sections as they seem functional */}
        <div className='container position-relative' style={{ zIndex: 1, maxWidth: '1310px', paddingRight: width < 768 ? '15px' : '55px', marginTop: width > 767 && width < 1025 ? '170px' : width > 1024 && width < 1400 ? '173px' : '' }}>
          <ErrorBoundary>
            <StoryDetailPageContent />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          <StoryDetailPageMoreVideos storyDetail={props?.storyDetail} />
        </ErrorBoundary>
        <ErrorBoundary>
          <StoryDetailPageFooterNew isDetailPage={true} changeText={true} homepage={true} />
        </ErrorBoundary>
        <div className='info-hide'>
          <h1>{metaTitle}</h1>
          <h2>{metaDesc}</h2>
        </div>
      </section>
    </>
  );
};

export default StoryDetailPage;

const styleString = `
.detailPageBackgroundImage{
  position: fixed;
  min-height: 100%;
  min-width: 100%;
  z-index:1;
  top: 0;
  width: 200px;
  object-fit: cover;
}

.info-hide{
  width: 0;
  height: 0;
  font-size: 0;
  opacity: 0;
  pointer-events: none;
}
.info-hide h1, .info-hide h2{
  font-size: 0;
  width: 0;
  height: 0;
}
.detailPageMainBackground{
  position: fixed;
    min-height: 100%;
    min-width: 100%;
    object-fit: cover;
    z-index:1;
    top: 0;
}

@media (max-width: 767px) {
  .story-detail-page{
    margin-top: -0.5rem;
  }
}
`;
