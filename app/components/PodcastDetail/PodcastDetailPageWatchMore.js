import React from 'react';
import ListTitle from '../../components/common/ListTitle';
import CardAudio from '../common/CardAudio';
import { SCREEN_NAME } from '../../constants/firebaseString';

const StoryDetailPageWatchMore = (props) => {
  return (
    <>
      <ListTitle title={'Listen more '} type="small" />
      <div className="row">
        {props.watchMoreStories.map((audioStory, index) => (
          <CardAudio
            colSize={4}
            cardId={audioStory.slug}
            screenName={SCREEN_NAME.podcastDetail}
            audioStory={audioStory}
            key={index}
          />
        ))}
      </div>
    </>
  );
};

export default StoryDetailPageWatchMore;
