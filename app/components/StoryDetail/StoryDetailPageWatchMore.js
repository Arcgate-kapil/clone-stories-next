/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import CardInspiring from '../common/CardInspiring';
import ListTitle from '../../components/common/ListTitle';
import { SCREEN_NAME } from '../../constants/firebaseString';

const StoryDetailPageWatchMore = props => {
  return (
    <>
      <div className='row'>
        <div className='col-12 px-3 px-md-5'>
          <ListTitle title={'Watch more '} type='small' />
        </div>
      </div>
      <div className='row watch-more'>
        {props.watchMoreStories.map((story, index) => (
          <CardInspiring
            isHindi={props.isHindi}
            screenName={SCREEN_NAME.storyDetail}
            story={story}
            key={index}
          />
        ))}
      </div>
    </>
  );
};

export default StoryDetailPageWatchMore;
