'use client';
import React, { useEffect } from 'react';
import CloseBtn from '../common/CloseBtn';
import CustomStyle from '../common/CustomStyle';
import ErrorBoundary from '../ErrorBoundry';
import HomePageTrending from '../HomePage/HomePageTrending';
import HomePageInsights from '../HomePage/HomePageInsights';
import HomePagePodcasts from '../HomePage/HomePagePodcasts';

function StoriesOverlayCat({ closeOverlay, closeBtnAction, ...props }) {
  
  useEffect(() => {
    const waveBtnList = document.querySelectorAll('.waveBtn');
    const style = document.head.appendChild(document.createElement('style'));

    style.textContent = `
      body {
        overflow: hidden;
      }
    `;

    waveBtnList.forEach(v => {
      const closeBtnWave = v.querySelector('.closeBtnWave');

      if (closeBtnWave.style.backgroundColor !== 'rgb(195, 61, 235)') {
        v.classList.add('bottomCloseBtn');
      }
    });

    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className='categories-optionsOverlay noScrollbar'>
      <CustomStyle>{styleString}</CustomStyle>
      <CloseBtn
        closeModalOnly={true}
        handleClick={closeBtnAction ? closeBtnAction : closeOverlay}
        bgColor='rgb(195, 61, 235)'
      />
      <div className=''>
        <ErrorBoundary>
          <HomePagePodcasts
            handleClick={closeBtnAction ? closeBtnAction : closeOverlay}
            {...props}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <HomePageTrending  handleClick={closeBtnAction ? closeBtnAction : closeOverlay}/>
        </ErrorBoundary>
        <ErrorBoundary>
          <HomePageInsights handleClick={closeBtnAction ? closeBtnAction : closeOverlay} {...props} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default StoriesOverlayCat;

const styleString = `
  .categories-optionsOverlay {
    font-size: 14px;
    padding: 1em 2em 2em;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1031;
    background-color: #000;
    background-image: url('https://cdn.workmob.com/stories_workmob/images/common/blog_bg.webp') !important;
    background-repeat: repeat !important;
    background-size: contain !important;
    background-attachment: fixed !important;
    color: #fff;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  .categories-head {
    font-size: 1em;
    margin-top: 1.25em;
    margin-bottom: 0.6em;
    text-align: center;
  }

  .categories-headTitle {
    font: 2.6em "Montserrat", sans-serif;
    position: relative;
    padding-bottom: 0.2em;
    font-weight: 500;
  }

  .categories-headTitle::after {
    content: '';
    width: 50px;
    height: 6px;
    background: #f96332;
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    margin: 0 auto;
  }

  .categories-headTitle, 
  .categories-headTitle > span {
    color: #e7c822;
    display: block;
  }

  .categories-headLocationPara {
    font: 1.35em "Alata", sans-serif;
    max-width: 900px;
    margin: 0 auto;
  }

  .categories-search {
    font-size: 1.6em;
    width: 100%;
    max-width: 700px;
    padding: 0.25em 1em 0.25em 2em;
    text-align: initial;
    margin: 0 auto;
    background: #373436;
    border-radius: 30px;
    position: relative;
    flex-shrink: 0;
  }
 
  .categories-searchIcon {
    font-size: 0.9em;
    font-weight: 600;
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #6d6d6d;
  }

  .categories-searchIcon::before {
    font-weight: bold;
  }

  .categories-optionsInput {
    font-family: "Alata" san-serif;
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: #fff;
  }

  .categories-gridContainer {
    margin: 1.6em auto 0;
    width: 100%;
    min-height: 0;
    overflow: auto;
  }

  .categories-topRow {
    margin-bottom: 2.5em;
    display: flex;
  }

  .categories-topRow > * {
    flex: 1;
  }

  // .categories-topRow > :nth-child(3)::after {
  //   content: '';
  //   width: 50px;
  //   height: 6px;
  //   background: #f96332;
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   margin: 0.5em auto 0;
  // }

  .categories-topRow.categories-categoryTopRow > :nth-child(3)::after {
    top: 88%;
    margin-top: 0;
  }

  .categories-topRow > .categories-locationLink:not(:last-child) {
    margin-right: 2em;
  }

  .categories-locationGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
    gap: 2em;
    grid-gap: 2em;
  }

  .categories-categoryGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0;
  }

  .categories-locationLink {
    background: #1c1c1c;
    border-radius: 1.1vw;
    position: relative;
  }

  .categories-locationLink::before {
    content: '';
    padding-top: 100%;
    display: block;
  }

  .categories-categoryLink::before {
    content: '';
    display: block;
    padding-top: 74.39%;
  }

  .categories-optionsImage {
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .categories-categoryPlaceholder {
    position: absolute;
    width: 85%;
    height: 78%;
    left: 0;
    right: 0;
    top: 6%;
    background: #1c1c1c;
    border-radius: 12px;
    margin: 0 auto; 
  }

  .bottomCloseBtn {
    display: none;
  }

  @media (max-width: 440px) {
    .categories-locationGrid,
    .categories-categoryGrid {
      grid-template-columns: 1fr 1fr !important;
    }

    .categories-locationGrid {
      gap: 1.4em;
      grid-gap: 1.4em;
    }
  }

  @media (max-width: 600px) {
    .categories-optionsOverlay {
      padding: 1em 1em 2em;
    }
  
    .categories-head {
      font-size: 0.8em;
    }

    .categories-headTitle {
      font-size: 2em
    }

    .categories-headTitle::after {
      width: 30px;
      height: 3px;
    }
  }

  @media(max-width: 950px) {
    .categories-topRow {
      display: none;
    }

    .categories-search {
      font-size: 1.25em;
    }
  }

  @media(max-width: 1140px) {
    .categories-headTitle.categories-categoryTitle {
      font-size: 4.6vw;
      padding-bottom: 0.35em;
    }
  }
`;

const styles = {
  optionLink: {
    borderRadius: '12px',
    position: 'relative',
  },
};
