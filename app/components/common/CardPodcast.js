/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { EVENT_TYPE } from '../../constants/firebaseString';
import { customEvent } from '../../actions/firebase';
import { fetchStoryDetail } from '../../actions/blog';

let CardPodcast = (props) => {
  const { full, slug, storyHeading='', screenName} = props.podcast;

  const cardClick = () => {
    customEvent(
      EVENT_TYPE.podcastCardClick, 
      {
        screen_name:screenName, 
        podcast_slug:slug
      }
    );

    props.fetchStoryDetail(slug)
  }

  return (
    <Link onClick={cardClick} to={`/podcasts/${slug}`} className="col-md-6 mb-5 mt-2 text-decoration-none">
        <iframe 
          width="100%" 
          height="300" 
          scrolling="no" 
          frameBorder="no" 
          allow="autoplay" 
          className="bg-secondary"
          src={`https://w.soundcloud.com/player/?url=${full}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}></iframe>
      
        <div className="w-100 py-3 px-1">
          <p style={styles.caption} className="m-0 font-weight-bold text-white caption">{storyHeading}</p>  
        </div>
    </Link>
  )
};

const mapStateToProps = null

const mapDispatchToProps = {
  fetchStoryDetail
};

CardPodcast = connect(
	mapStateToProps,
	mapDispatchToProps,
)(CardPodcast);

export default CardPodcast;


const styles = {
  caption:{
    fontSize:'1.5vw'
  }
}
