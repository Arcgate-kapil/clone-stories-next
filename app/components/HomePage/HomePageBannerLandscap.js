/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ORANGE } from '../../constants/colors';
import CardVideo from '../common/CardVideo';
import ErrorBoundary from '../ErrorBoundry';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getAltImg } from '../../utils';
import { EVENT_TYPE, SCREEN_NAME } from '../../constants/firebaseString';
import { customEvent } from '../../actions/firebase';

const HomePageBannerLandscap = props => {
  const {
    video_landscape_thumb = '',
    video_url_landscape = '',
    storyHeading,
    storySlug,
    job_title,
    full,
    thumb,
    slug,
    videoUrl,
    quote,
    location,
    storyType,
    company_name,
  } = props.blogs.blogs['stories'][0];

  const btnClick = () => {
    customEvent(EVENT_TYPE.readMore, {
      screen_name: SCREEN_NAME.homePage,
      story_slug: slug,
    });
  };

  return (
    <div
      style={{ minHeight: 336, backgroundImage: `url(${full})`, backgroundSize: 'cover' }}
      className='jumbotron bg-trabsparent position-relative mb-0 homeBanner specialPadding'
    >
      <LazyLoadImage
        style={{ opacity: 0, maxHeight: !!quote ? 760 : 600 }}
        visibleByDefault={true}
        effect='blur'
        width='100%'
        wrapperClassName='img-fluid w-100 d-none d-md-block'
        alt={getAltImg(full)}
        src={full}
      />
      <div style={styles.overlay} className='position-absolute h-100 w-100'></div>
      <div
        style={{ top: 0, left: 0, paddingTop: !!quote ? 60 : 0 }}
        className='position-absolute h-100 w-100 d-flex align-items-center'
      >
        <div className='container h-100'>
          <div className='row h-100'>
            <div
              className={`col-12 d-flex flex-column align-items-center justify-content-end h-100`}
            >
              <div
                style={{ marginRight: '18%' }}
                className='animate__animated animate__fadeIn d-flex align-items-end flex-column landscap-video w-100 position-relative'
              >
                <ErrorBoundary>
                  <CardVideo
                    screenName={SCREEN_NAME.homePage}
                    poster={video_landscape_thumb}
                    videoUrl={JSON.parse(JSON.stringify(video_url_landscape))}
                  />
                </ErrorBoundary>
                <div className='text-center animate__animated heading-container'>
                  <h1 className='text-white font-weight-normal mb-0 heading montserrat-regular font-24 text-center'>
                    {storyHeading}
                    <p className='font-20 text-left d-flex align-items-center flex-row flex-wrap justify-content-between mt-3 mb-0'>
                      <span
                        style={{ flex: 1, maxWidth: '100%' }}
                        className='d-flex font-weight-normal justify-content-center align-items-center flex-row flex-wrap'
                      >
                        {!!company_name && (
                          <span className='d-flex align-items-center location pr-3 mb-1'>
                            <i
                              style={{ marginTop: -2, marginLeft: -8 }}
                              className='pr-1 icon icon-company pr-1'
                              
                            />
                            {!!job_title ? `${job_title} at ${company_name}` : company_name}
                          </span>
                        )}
                        <span className='mb-1 location pr-4 '>
                          <Link
                            to={`/voices/${storySlug}`}
                            style={{ zIndex: 1 }}
                            className='font-weight-normal font-20 badge badge-dark rounded p-2 mb-0 position-relative'
                          >
                            {storyType}
                          </Link>
                        </span>
                        {!!location && (
                          <span className='d-flex align-items-center location minus mb-1 font-20'>
                            <i className='icon icon-location pr-1' />
                            {location}
                          </span>
                        )}
                      </span>
                    </p>
                  </h1>
                  {!!quote && (
                    <div style={{ clear: 'both' }} className='position-relative pl-5 pt-4 mx-2'>
                      <blockquote className='h3 baskervville-regular darkGreen position-relative font-40 mb-3 sub-heading text-left'>
                        {quote}
                      </blockquote>
                    </div>
                  )}
                  <Link
                    onClick={btnClick}
                    style={styles.btn}
                    to={`/${slug}`}
                    className='btn btn-lg font-weight-bold text-white'
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageBannerLandscap;

const styles = {
  btn: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 100,
    margin: '0 auto 10px auto',
    border: '2px solid rgba(255,255,255,0.8)',
  },
  overlay: {
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
};
