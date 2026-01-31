'use client';
import React from 'react';
import CardInsight from '../common/CardInsight';
import ListTitle from '../common/ListTitle';
import { SCREEN_NAME } from '../../constants/firebaseString';

const HomePageInsights = props => {
  
  return (
    <div className='container'>
      <ListTitle title={props.isHindi ? 'लेख' : 'Insights'} link='insights' handleClick={props?.handleClick} zoom={true}/>
      <div className='row'>
        {props.insightListing
          .slice()
          .splice(0, 2)
          .map((insight, index) => (
            <CardInsight screenName={SCREEN_NAME.homePage} insight={insight} key={index} handleClick={props?.handleClick} />
          ))}
      </div>
    </div>
  );
};

export default HomePageInsights;
