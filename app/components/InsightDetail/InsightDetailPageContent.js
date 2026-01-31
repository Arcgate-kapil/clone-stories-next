/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import SocialShare from '../common/SocialShare';
import ReadTranscription from '../common/ReadTranscription';
import {COMMON_HASHTAG} from '../../constants/localString'


const StoryDetailPageContent = (props) => {
  // const {date, fullStory, transcript, metaTitle, storyHeading, metaDesc, storyType} = props?.storyDetail;
  return (
    <>
      <div className="row position-relative articleDetail z-index-1">
        <div style={styles.content} className="col-12 text-white">
          <div className="mb-3" dangerouslySetInnerHTML={{ __html:props?.storyDetail?.fullStory}} />
        </div>
        {
          !!props?.storyDetail?.transcript &&
          <ReadTranscription category='Insight' transcript={props?.storyDetail?.transcript} storyHeading = {props?.storyDetail?.storyHeading} />
        }
        <div className="col-12">
          <p className="text-white">{props?.storyDetail?.date}</p>
        </div>
      </div>
      <SocialShare 
        shareFrom='insight' 
        emailText = {props?.storyDetail?.metaTitle} 
        emailSub = 'Interesting Read'
        storyHeading = {props?.storyDetail?.storyHeading} 
        fbTitle={COMMON_HASHTAG.professionalNetworking}
        twitterTitle={`${COMMON_HASHTAG.professionalNetworking} #Workplace${props?.storyDetail?.storyType}`}
      />
       <div style={{ width: 0, height: 0, fontSize: 0, opacity: 0, pointerEvents: 'none' }}>
        <h1 style={{ width: 0, height: 0, fontSize: 0 }}>{props?.storyDetail?.metaTitle}</h1>
        <h2 style={{ width: 0, height: 0, fontSize: 0 }}>{props?.storyDetail?.metaDesc}</h2>
      </div>
    </>
  )
};

export default StoryDetailPageContent;

const styles =  {
  content:{
    fontSize:20
  }
}

