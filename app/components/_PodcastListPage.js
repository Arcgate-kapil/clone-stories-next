/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CardPodcast from '../components/common/CardPodcast';
import ListTitle from '../components/common/ListTitle';
import Footer from '../components/Footer';
import { connect } from "react-redux";
import HomePageFooter from '../components/HomePage/HomePageFooter';
import {HOST, PODCAST_LIST, PODCAST_TITLE} from '../constants/localString';
import {SCREEN_NAME} from '../constants/firebaseString';
import { trackScreen } from '../actions/firebase';
import { fetchPodcastListing } from '../actions/blog';
import ErrorBoundary from '../components/ErrorBoundry';

const PodcastListPage = props => {

  const { location, match:{params:{id}}, podcastListing, fetchPodcastListing } = props;

  React.useEffect(()=>{
    trackScreen(SCREEN_NAME.podcastList)
    fetchPodcastListing()
  },[])

  const head = () => {
    return (
      <Helmet key={Math.random()}>
        <title>{PODCAST_LIST.title}</title>
        <meta name="description" itemprop="description" content={PODCAST_LIST.description}></meta>
        {/* OG:  Open Graph / Facebook Tags Start Here */}
          <meta property="og:type" content='website' />
          <meta property="og:url" content={HOST+props.location.pathname} />
          <meta property="og:title" content={PODCAST_LIST.title} />
          <meta property="og:description" content={PODCAST_LIST.description} />
          <meta property="og:image" content={PODCAST_LIST.ogImage} />
          <meta property="og:site_name" content={PODCAST_LIST.siteName} />
        {/* OG:  Open Graph / Facebook Tags End Here */}

        {/* Twitter start here */}
        <meta property="twitter:card" content="summary"/>
        <meta property="twitter:url" content={HOST+props.location.pathname}/>
        <meta property="twitter:title" content={PODCAST_LIST.title}/>
        <meta property="twitter:description" content={PODCAST_LIST.description}  />
        <meta property="twitter:image"content={PODCAST_LIST.ogImage} />
        {/* Twitter ends here */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={HOST+props.location.pathname} />
      </Helmet>
    );
  };

  const renderStoriesList = () => {
    
    if(!podcastListing || !podcastListing.length){
      return null
    }

    return podcastListing.map((podcast, index) => (
      <CardPodcast screenName={SCREEN_NAME.podcastList} podcast = {podcast} key={index} />
    ))
  };

  return (
    <>
      {head()}
      <div className="container mt-5 pt-5 mb-5">
        <div className="row mt-4">
          <div className="col-12">
            <ListTitle title={PODCAST_TITLE} type='small' />
          </div>
          {
            renderStoriesList()
          }
        </div>
      </div>
      <Footer />
      <ErrorBoundary><HomePageFooter /></ErrorBoundary>
    </>
  );
  
};


const mapStateToProps = state => {
  return {
    podcastListing: state.blogs.podcastListing
  };
};

const mapDispatchToProps = {
  fetchPodcastListing
};

export default {
  component: connect(
    mapStateToProps,
    mapDispatchToProps
  )(PodcastListPage),
};



