'use client';
import React, { useState } from 'react';
import CardAudio from '../common/CardAudio';
import SocialShare from '../common/SocialShare';
import { COMMON_HASHTAG } from '../../constants/localString';
import { SCREEN_NAME } from '../../constants/firebaseString';

const PodcastDetailPageBanner = (props) => {
  const { storyHeading, slug, date, metaTitle, metaDesc } = props.storyDetail;
  const [play, playAudio] = React.useState(null);

  const clickBtn = (e, cardId, type) => {
    const elemAudio = document.getElementsByTagName('audio')[0];
    if (type == 'active' && cardId == play && !!elemAudio && !!elemAudio.paused) {
      document.getElementsByTagName('audio')[0].play();
    } else {
      if (cardId == play) {
        playAudio(false);
      } else {
        playAudio(cardId);
      }
    }
  };

  React.useEffect(() => {
    playAudio(slug);
  }, []);

  return (
    <>
      <div className="container">
        <div className="bg-trabsparent p-0 position-relative mt-5 pt-5 mb-4 row podcast-audio-detail">
          <CardAudio
            colSize={8}
            cardId={slug}
            screenName={SCREEN_NAME.podcastDetail}
            audioStory={props.storyDetail}
            play={play}
          />
        </div>
      </div>
      <div className="podcast-audio-detail-btn text-center position-relative">
        <SocialShare
          shareFrom="podcast"
          emailText={metaTitle}
          storyHeading={storyHeading}
          twitterTitle={COMMON_HASHTAG.common}
          emailSub="Listen to this inspiring story"
          fbTitle={COMMON_HASHTAG.inspiringStories}
        />
        <p style={{ marginBottom: -20 }} className="text-white text-right px-3 mx-3">
          {date}
        </p>
        <span
          id="detailAudioBtn"
          onClick={(e) => clickBtn(e, slug, !!play ? 'active' : 'inactive')}
          className="audioPlay large"
        >
          <i
            id={`audio-play-pause-${!!play ? 'active' : 'inactive'}`}
            className={`icon icon-${!!play ? 'pause-1' : 'play'}`}
          ></i>
        </span>
        <div style={{ width: 0, height: 0, fontSize: 0, opacity: 0, pointerEvents: 'none' }}>
        <h1 style={{ width: 0, height: 0, fontSize: 0 }}>{metaTitle}</h1>
        <h2 style={{ width: 0, height: 0, fontSize: 0 }}>{metaDesc}</h2>
      </div>
      </div>
    </>
  );
};

export default PodcastDetailPageBanner;
