/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { ORANGE } from '../../constants/colors';
import CardVideo from '../common/CardVideo';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getAltImg } from '../../utils';
import { SCREEN_NAME } from '../../constants/firebaseString';
import ErrorBoundary from '../ErrorBoundry';
import SocialShare from '../common/SocialShare';
import { COMMON_HASHTAG } from '../../constants/localString';

const StoryDetailPageBannerLandscap = (props) => {
  let {
    slug,
    video_landscape_thumb,
    video_url_landscape,
    storyHeading,
    job_title_hindi,
    storySlug,
    storyHeading_hindi,
    job_title,
    full,
    videoUrl,
    thumb,
    quote,
    quote_hindi,
    industry_hindi,
    workmobUserId,
    name,
    name_hindi,
    location,
    location_hindi,
    date,
    date_hindi,
    metaDesc,
    company_name,
    company_name_hindi,
    isSmall = false,
    storyType,
  } = props.storyDetail;
  let btnLabel = `Like this story`;
  let atLabel = `at`;

  if (props.isHindi) {
    storyHeading = storyHeading_hindi;
    name = name_hindi;
    location = location_hindi;
    company_name = company_name_hindi;
    quote = quote_hindi;
    storyType = industry_hindi;
    date = date_hindi;
    job_title = job_title_hindi;
    btnLabel = `लाइक करे`;
    atLabel = `एट `;
  }

  return (
    <>
      <div
        style={{ minHeight: 336, backgroundImage: `url(${full})`, backgroundSize: 'cover' }}
        className="jumbotron bg-trabsparent position-relative mb-3 detailPage specialPadding"
      >
        <LazyLoadImage
          style={{ opacity: 0, maxHeight: !!quote ? 760 : 600 }}
          visibleByDefault={true}
          effect="blur"
          width="100%"
          wrapperClassName="img-fluid w-100 d-none d-md-block"
          alt={getAltImg(full)}
          src={full}
        />
        <div style={styles.overlay} className="position-absolute h-100 w-100"></div>
        <div
          style={{ top: 0, left: 0, paddingTop: !!quote ? 60 : 0 }}
          className="position-absolute h-100 w-100 d-flex align-items-center"
        >
          <div className="container h-100">
            <div className="row h-100">
              <div
                className={`col-12 d-flex  flex-column align-items-center justify-content-end h-100`}
              >
                <div
                  style={{ marginRight: '18%' }}
                  className="animate__animated animate__fadeIn d-flex align-items-end flex-column landscap-video w-100 position-relative"
                >
                  <ErrorBoundary>
                    <CardVideo
                      screenName={SCREEN_NAME.homePage}
                      poster={video_landscape_thumb}
                      videoUrl={JSON.parse(JSON.stringify(video_url_landscape))}
                    />
                  </ErrorBoundary>
                  <div className="py-10 text-center animate__animated heading-container">
                    <h1 className="text-white font-weight-normal mb-0 heading montserrat-regular font-24 text-center">
                      {storyHeading}
                      <p className="font-20 text-left d-flex align-items-center flex-row flex-wrap justify-content-between mt-3 mb-0">
                        <span
                          style={{ flex: 1, maxWidth: '100%' }}
                          className="d-flex font-weight-normal justify-content-center align-items-center flex-row flex-wrap"
                        >
                          {!!company_name && (
                            <span className="d-inline-block align-items-center locationmb-1 pr-4 text-center">
                              <i
                                style={{ marginTop: -2, marginLeft: -8 }} 
                                className="icon icon-company pr-1"
                              />
                              {!!job_title ? `${job_title} at ${company_name}` : company_name}
                            </span>
                          )}
                          <span className="mb-1 location pr-4 ">
                            <small
                              style={{ zIndex: 1 }}
                              className="font-weight-normal font-20 badge badge-dark rounded p-2 mb-0 position-relative"
                            >
                              {storyType}
                            </small>
                          </span>
                          {!!location && (
                            <span className="d-flex align-items-center location minus mb-1 font-20">
                              <i className="icon icon-location pr-1 font-20" />
                              {location}
                            </span>
                          )}
                        </span>
                      </p>
                    </h1>
                    {!!quote && (
                      <div style={{ clear: 'both' }} className="position-relative pl-5 pt-4 ml-2">
                        <blockquote className="h3 baskervville-regular darkGreen position-relative font-40 mb-0 sub-heading text-left">
                          {quote}
                        </blockquote>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SocialShare
          shareFrom="story"
          emailText={metaDesc}
          storyHeading={storyHeading}
          emailSub="Watch this inspiring video"
          fbTitle={COMMON_HASHTAG.inspiringStories}
          twitterTitle={`${storyHeading}. Watch an inspiring story. ${COMMON_HASHTAG.common}`}
        />
        <div className="position-absolute date-content">
          <p className="text-white pr-3 mb-0">{date}</p>
        </div>
      </div>
    </>
  );
};

export default StoryDetailPageBannerLandscap;

const styles = {
  btn: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: ORANGE,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  caption: {
    fontSize: '2.4vw',
  },
  overlay: {
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
};
