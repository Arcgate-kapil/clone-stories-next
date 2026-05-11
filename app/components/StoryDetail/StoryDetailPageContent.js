import React, { useEffect, useState, useRef } from 'react';
import { ORANGE } from '../../constants/colors';
import ReadTranscription from '../common/ReadTranscription';
import { useSelector } from 'react-redux';
import useWindowSize from '../../utils/useWindowSize';
import CustomStyle from '../common/CustomStyle';

const StoryDetailPageContent = props => {
  const state = useSelector((state) => state.blog);
  const {
    fullStory,
    fullStory_hindi,
    storyHeading,
    transcript,
    name
  } = state.blogDetail;
  const { width } = useWindowSize();
  const [canShowMore, setCanShowMore] = useState(false);
  const storyElemRef = useRef();

  useEffect(() => {
    if (!storyElemRef.current || !fullStory) return;
    const storyElem = storyElemRef.current;

    if (canShowMore) {
      storyElem.style.height = '';
      return;
    }

    const applyHeight = () => {
      const firstPara = storyElem.querySelector('p');
      if (!firstPara) return;
      const height = firstPara.offsetTop + firstPara.offsetHeight;
      if (height > 0) storyElem.style.height = `${height}px`;
    };

    // Try immediately, then observe for layout changes
    applyHeight();
    const observer = new ResizeObserver(applyHeight);
    observer.observe(storyElem);

    return () => observer.disconnect();
  }, [state.isHindi, fullStory, canShowMore]);

  // useEffect(() => {
  //   if (!storyElemRef.current || !fullStory) return;

  //   const storyElem = storyElemRef.current;
  //   const firstPara = storyElem.querySelectorAll('p')[0];


  //   if (canShowMore) {
  //     storyElem.style.height = '';
  //   }

  //   else {
  //     setTimeout(() => {
  //       storyElem.style.height = `${firstPara.getBoundingClientRect().bottom - storyElem.getBoundingClientRect().top}px`;
  //     }, 50);
  //   }
  // }, [state.isHindi, fullStory, canShowMore]);

  return (
    <>
      <CustomStyle>{styleString}</CustomStyle>
      <section className={width < 969 ? 'px-0 px-md-4 mt-35' : 'px-0 px-md-4'}>
        <div className='row position-relative articleDetail'>
          <div style={styles.content} className='col-12 text-white'>
            <div
              ref={storyElemRef}
              className={`StoryDetailPageContent-story storyMainDetail ${state.isHindi ? 'new-font-khand' : ''} ` + (canShowMore ? 'StoryDetailPageContent-storyFull' : 'StoryDetailPageContent-storyShort')}
              dangerouslySetInnerHTML={{ __html: state.isHindi ? fullStory_hindi?.replace(/^"+|"+$/g, '') || fullStory?.replace(/^"+|"+$/g, '') : fullStory?.replace(/^"+|"+$/g, '') }}
            />
            {!!fullStory && (
              <button
                className='StoryDetailPageContent-showMoreBtn'
                onClick={() => setCanShowMore(prev => !prev)}
              >
                {'Read' + (canShowMore ? ' less' : ' more')}
              </button>
            )}
          </div>
          {!!transcript && (
            <ReadTranscription
              category='Story'
              transcript={transcript}
              storyHeading={storyHeading}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default StoryDetailPageContent;

const styleString = `
  .StoryDetailPageContent-storyShort {
    overflow: hidden;
    margin-bottom: 0.25em;
    position: relative;
  }

  .storyMainDetail h3 {
    line-height: 34px !important;
    font-size: 22px !important;
  }

  .storyMainDetail h3 {
    line-height: 30px !important;
  }
  
  .storyMainDetail ul {
    font-family: Baskervville;
    margin-bottom: 0;
  }
  .storyMainDetail ul li {
    padding: 7px 0;
  }

  .StoryDetailPageContent-storyFull > :last-child {
    margin-bottom: 0.8em; 
  }

  .StoryDetailPageContent-showMoreBtn {
    font: 15px Alata, sans-serif;
    border: none;
    background: #f9633299;
    border-radius: 4px;
    color: white;
    margin-bottom: 2em;
    padding-bottom: 0.25em;
  }

  .StoryDetailPageContent-showMoreBtn:focus {
    outline: 0;
  }

  @media (max-width: 550px) {
    .StoryDetailPageContent-story > * {
      margin-bottom: 1em !important;
    }
  }
  .mt-35 {
     margin-top: 35px;
  }
`;

const styles = {
  btn: {
    backgroundColor: ORANGE,
    borderRadius: 100,
  },
  caption: {
    fontSize: '2.4vw',
  },
  content: {
    fontSize: 20,
  },
};