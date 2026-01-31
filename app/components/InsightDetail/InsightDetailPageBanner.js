/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { ORANGE } from '../../constants/colors';
import { getAltImg } from '../../utils';

const StoryDetailPageBanner = (props) => {
  // const { storyHeading, full } = props?.storyDetail;
  return (
    <>
      <div className="bg-trabsparent p-0 position-relative mt-3 pt-3 mt-md-5 pt-md-5 mb-4 z-index-1">
        <h1 className="text-white font-weight-bold mb-4 font-50 baskervville-regular heading">
          {props?.storyDetail?.storyHeading}
        </h1>
        <img style={styles.banner} className="img-fluid w-100" src={props?.storyDetail?.full} alt={getAltImg(props?.storyDetail?.full)} />
      </div>
    </>
  );
};

export default StoryDetailPageBanner;

const styles = {
  banner: {
    backgroundColor: ORANGE,
    borderRadius: 20,
    // aspectRatio: '1216 / 561',
  },
  caption: {
    font: '2vw',
  },
};
