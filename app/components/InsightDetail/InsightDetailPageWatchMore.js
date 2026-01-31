/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ListTitle from '../../components/common/ListTitle';
import CardInsight from '../common/CardInsight';
import {SCREEN_NAME} from '../../constants/firebaseString';


const StoryDetailPageWatchMore = (props) => {
  return (
    <>
      <ListTitle title={'Read more '}  type='small' />
      <div className="row">
        {
          props.watchMoreStories.map((insight, index)=>(
            <CardInsight screenName={SCREEN_NAME.insightDetail} insight={insight} key={index} />
          ))
        }
      </div>
    </>
  )
};

export default StoryDetailPageWatchMore;

