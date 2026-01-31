'use client';

import React, { useEffect } from 'react';
import { SCREEN_NAME } from '../constants/firebaseString';
import { trackScreen } from '../firebase/firebase';
import ReactHlsPlayer from '../components/HSL/components/react-hls-player';
import { setHindiView } from '../lib/features/blogSlice';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { UPLOAD_MERI_KAHANI, HOST } from '../constants/localString';
import MeriKhaniPromotion from '../components/UploadMeriKahani/MeriKhaniPromotion';

const UploadMeriKahani = props => {

  const pathname = usePathname();
  const isHindi = useSelector((state) => state.blog.isHindi);
  const dispatch = useDispatch();
  const router = useRouter();

  React.useEffect(() => {
    if (pathname.startsWith('/hindi')) {
      dispatch(setHindiView(true));
    } else {
      dispatch(setHindiView(false));
    }
    trackScreen(SCREEN_NAME.meriKahani)
    //document.getElementsByTagName('body')[0].classList.add('overflow-hidden')
    return () => {
      // document.getElementsByTagName('body')[0].classList.remove('overflow-hidden')
    };
  }, [])

  React.useEffect(() => {
    const handleBeforeUnload = (event) => {
      localStorage.removeItem('searchValue');
    };

    // Add the event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleBackClick = (e) => {
    e.preventDefault();
    router.push(isHindi ? '/hindi' : '/');
  }

  useEffect(() => {
    // Update title
    document.title = isHindi ? UPLOAD_MERI_KAHANI.title_hi : UPLOAD_MERI_KAHANI.title;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', isHindi ? UPLOAD_MERI_KAHANI.description_hi : UPLOAD_MERI_KAHANI.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = isHindi ? UPLOAD_MERI_KAHANI.description_hi : UPLOAD_MERI_KAHANI.description;
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
    updateOrCreateMeta('og:title', isHindi ? UPLOAD_MERI_KAHANI.title_hi : UPLOAD_MERI_KAHANI.title);
    updateOrCreateMeta('og:description', isHindi ? UPLOAD_MERI_KAHANI.description_hi : UPLOAD_MERI_KAHANI.description);
    updateOrCreateMeta('og:url', HOST + pathname);
    updateOrCreateMeta('og:image', UPLOAD_MERI_KAHANI.ogImage);
    updateOrCreateMeta('og:site_name', UPLOAD_MERI_KAHANI.siteName);
    // Update Twitter tags
    updateOrCreateMeta('twitter:title', isHindi ? UPLOAD_MERI_KAHANI.title_hi : UPLOAD_MERI_KAHANI.title);
    updateOrCreateMeta('twitter:description', isHindi ? UPLOAD_MERI_KAHANI.description_hi : UPLOAD_MERI_KAHANI.description);
    updateOrCreateMeta('twitter:image', UPLOAD_MERI_KAHANI.ogImage);
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
  }, []);

  return (
    <>
      <ReactHlsPlayer
        className={`bgVideoPlayerKahani`}
        url="https://cdn.workmob.com/stories_workmob/story_premium_default_bg_video/story_premium_default_bg_video.m3u8"
        poster=''
        id='VideoPlayerComman'
        preload='auto'
        loop={true}
        controls={false}
        autoPlay
        width='100%'
        height='100%'
        muted={true}
        playsInline={true}
      />
      <div className="waveBtn animate__animated animate__jello" style={{ pointerEvents: 'none' }}>
        <i
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => handleBackClick(e)}
          className={`btnClose icon icon-cancel d-flex align-items-center justify-content-center rounded-circle font-weight-bold`}
        />
        <div
          onClick={(e) => handleBackClick(e)}
          className="closeBtnWave d-flex align-items-center justify-content-center"
          style={{ backgroundColor: '#DF625C', cursor: 'pointer', pointerEvents: 'auto' }}
        >
          &nbsp;
        </div>
      </div>
      <div className='kahani_container'>
        <MeriKhaniPromotion />
      </div>
    </>
  );
};


export default UploadMeriKahani;
