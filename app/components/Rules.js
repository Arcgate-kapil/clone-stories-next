'use client';
import React, { useEffect } from 'react';
import MeriKhaniRules from '../components/HomePage/MeriKhaniRules';
import { SCREEN_NAME } from '../constants/firebaseString';
import { CREATE_PAGE, HOST } from '../constants/localString';
import { fetchBlogRules } from '../lib/features/blogSlice';
import { trackScreen } from '../firebase/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';

const Rules = props => {
  let dispatch = useDispatch();
  const state = useSelector((state) => state.blog);
  const pathname = usePathname();
  let router = useRouter();

  React.useEffect(() => {
    dispatch(fetchBlogRules());
    window.scrollTo(0, 0);
    trackScreen(SCREEN_NAME.rules);
  }, []);

  const handleBackClick = (e) => {
    e.preventDefault();
    router.push(state.isHindi ? '/hindi' : '/');
    // router.back();
  }

  const title = "Create Career or Business Video Story | Grow Your Personal & Professional Brand"
  const subTitle = "Quickly and easily create your own career or business video story. Grow your customers and find new opportunities with the power of a video story."

  useEffect(() => {
    // Update title
    document.title = state.isHindi ? CREATE_PAGE.title_hi : CREATE_PAGE.title;
    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', state.isHindi ? CREATE_PAGE.description_hi : CREATE_PAGE.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = state.isHindi ? CREATE_PAGE.description_hi : CREATE_PAGE.description;
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
    updateOrCreateMeta('og:title', state.isHindi ? CREATE_PAGE.title_hi : CREATE_PAGE.title);
    updateOrCreateMeta('og:description', state.isHindi ? CREATE_PAGE.description_hi : CREATE_PAGE.description);
    updateOrCreateMeta('og:url', HOST + pathname);
    updateOrCreateMeta('og:image', CREATE_PAGE.ogImage);
    updateOrCreateMeta('og:site_name', CREATE_PAGE.siteName);
    // Update Twitter tags
    updateOrCreateMeta('twitter:title', state.isHindi ? CREATE_PAGE.title_hi : CREATE_PAGE.title);
    updateOrCreateMeta('twitter:description', state.isHindi ? CREATE_PAGE.description_hi : CREATE_PAGE.description);
    updateOrCreateMeta('twitter:image', CREATE_PAGE.ogImage);
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
      <div className="waveBtn animate__animated animate__jello" style={{ pointerEvents: 'none' }}>
        <i
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => handleBackClick(e)}
          className={`btnClose icon icon-cancel d-flex align-items-center justify-content-center rounded-circle font-weight-bold`}
        />
        <div
          onClick={(e) => handleBackClick(e)}
          className="closeBtnWave d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgb(191, 64, 228)', cursor: 'pointer', pointerEvents: 'auto' }}
        >
          &nbsp;
        </div>
      </div>
      <MeriKhaniRules {...state} title={title} subTitle={subTitle} />
    </>
  );
};

// const mapStateToProps = state => {
//   return {
//     rules: state.blogs.rules,
//     blogs: state.blogs,
//   };
// };

// const mapDispatchToProps = { fetchBlogRules };

export default Rules;
