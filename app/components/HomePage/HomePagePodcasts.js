'use client';
import React, { useEffect } from 'react';
import CardAudio from '../common/CardAudio';
import ListTitle from '../common/ListTitle';
import { SCREEN_NAME } from '../../constants/firebaseString';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomePodcastListing } from '@/app/lib/features/blogSlice';

const HomePagePodcasts = (props) => {
  const [play, setPlay] = React.useState(null);
  const podcastListing = useSelector((state) => state.blog.podcastListingHome);
  const dispatch = useDispatch();

  useEffect(() => {
    function getHomePodcasts(event) {
      dispatch(fetchHomePodcastListing());
    }
    getHomePodcasts()
  }, []);

  const clickBtn = (e, cardId, type) => {
    e.preventDefault();
    const elemAudio = document.getElementsByTagName('audio')[0];
    if (type == 'active' && cardId == play && !!elemAudio && !!elemAudio.paused) {
      document.getElementsByTagName('audio')[0].play();
    } else {
      if (cardId == play) {
        setPlay(null);
      } else {
        setPlay(cardId);
      }
    }
  };

  return (
    <div className="container mb-5">
      <ListTitle title={props.isHindi ? 'सुनिए' : 'Listen'} link="podcasts" handleClick={props?.handleClick} zoom={true}/>
      <div className="row home-pgae-podcastsList">
        {podcastListing
          .slice()
          .splice(0, 3)
          .map((audioStory, index) => (
            <CardAudio
              clickBtn={clickBtn}
              play={play}
              cardId={audioStory.slug}
              screenName={SCREEN_NAME.homePage}
              audioStory={audioStory}
              key={index}
              handleClick={props?.handleClick}
            />
          ))}
      </div>
    </div>
  );
};

export default HomePagePodcasts;
