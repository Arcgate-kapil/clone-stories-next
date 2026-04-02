'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WHITE } from '../../constants/colors';
import { EVENT_TYPE } from '../../constants/firebaseString';
import { customEvent } from '@/app/firebase/firebase';
import ReactHlsPlayer from '../HSL/components/react-hls-player';
import { useRouter, usePathname } from 'next/navigation';
import CustomStyle from '../common/CustomStyle';

const MeriKhaniRules = (props) => {
  const router = useRouter();
  const pathname = usePathname();
  const isHindi = pathname.startsWith('/hindi');
  const [categoryUrls, setCategoryUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState('');
  const [lang, setLang] = useState(isHindi ? 'hindi' : 'english');
  const [questionList, setQuestionList] = useState({});
  const [categoriesData, setCategoriesData] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);
  const isMobile = useRef();
  const [play, setPlay] = useState(false);
  const playStateRef = useRef(play);
  const playerRefShare = useRef();
  const [videoStartText, setVideoStartText] = useState('Start');

  useEffect(() => {
    isMobile.current = window.innerWidth < 768;
  }, []);

  function togglePlay() {
    if (play) {
      setVideoStartText('Start');
      playerRefShare.current.pause();
    } else {
      setVideoStartText('Pause');
      playerRefShare.current.play();
    }
    setPlay(!play);
    playStateRef.current = !play;
  }

  const handleVideoChange = (type) => {
    setPlay(false);
    if (type === 'prev') {
      setVideoStartText('Start');
      if (videoIndex > 0) {
        setVideoIndex((prev) => prev - 1);
      }
    } else {
      setVideoStartText('Start');
      if (videoIndex < questionList.length - 1) {
        setVideoIndex((prev) => prev + 1);
      }
    }
  };

  const handleEnded = () => {
    setPlay(false);
    setVideoStartText('Replay');
  };

  const toggleLang = () => {
    if (lang === 'english') {
      router.replace('/hindi' + pathname);
      setLang('hindi');
    } else {
      router.replace(pathname.replace('/hindi', ''));
      setLang('english');
    }
  };

  const contactUsClick = () => {
    customEvent(EVENT_TYPE.shareYourStory, {
      section: 'rules',
    });
  };

  const categoriesChange = (i) => {
    setCategoryIndex(i);
    setVideoIndex(0);
    setPlay(false);
    playStateRef.current = false;
    playerRefShare.current.pause();
    setVideoStartText('Start');
  };

  async function getData(url) {
    const response = await fetch(url);
    return response.json();
  }

  useEffect(() => {
    if (videoUrls.length > 0) {
      setCurrentVideo(videoUrls[0]);
    }
  }, [videoUrls]);

  useEffect(() => {
    if (categoryUrls.length > 0) {
      getData(categoryUrls[categoryIndex]).then((data) => {
        setQuestionList(data);
        setVideoUrls(data.map((v) => v.video_url_hindi));
      });
    }
  }, [categoryIndex, categoryUrls]);

  useEffect(() => {
    getData('https://r5dojmizdd.execute-api.ap-south-1.amazonaws.com/prod/questions-story-type').then(
      (data) => {
        setCategoryUrls(data?.data?.map((v) => v.questions_url));
        setCategoriesData(data?.data);
      }
    );
  }, []);

  const categoriesElem = (
    <div style={styles.categories} className="categoriesClassBottom">
      {categoriesData.map((category, i) => (
        <div style={{ flexShrink: '0' }} key={i}>
          <button
            type="button"
            style={i === categoryIndex ? styles.selectedCategory : styles.category}
            onClick={() => categoriesChange(i)}
          >
            {category.post_type.replace(/-/g, ' ').replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase())}
          </button>
          {i === categoryIndex && <div style={styles.triangle}></div>}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <CustomStyle>{styleString}</CustomStyle>
      <div
        onClick={toggleLang}
        className="rounded-circle ml-2 hindi-button hindi-button-hindi d-md-flex"
        style={styles.langButtonHiEng}
        role="button"
      >
        {lang === 'english' ? 'हिन्दी' : 'Eng'}
      </div>
      <div className="rulesContainer" style={{ padding: '0' }}>
        <div
          style={{
            display: 'flex',
          }}
        >
          <div style={styles.rightContent}>
            <div style={{ marginTop: '2.5rem' }}>
              <h2 className="categories-headTitle categories-categoryTitle mt-5 mb-5 d-block text-center">
                <span className="d-block">Below is a list of suggested questions</span>
                <span className="d-block">that you should cover in your video</span>
              </h2>
              <div className="mainVideoCon mt-3 mt-md-0">
                <div className="childVideoCont">
                  {questionList.length > 0 && (
                    <div className="rulesVideoContainer">
                      <img
                        src="https://cdn.workmob.com/intro_workmob/story-questions/frame.png"
                        className="mobile-container d-none d-md-block"
                      />
                      <img
                        src="https://cdn.workmob.com/stories_workmob/images/common/phone-frame.png"
                        className="mobile-container d-block d-md-none"
                      />
                      <ReactHlsPlayer
                        className={`rulesPageVideo`}
                        style={{ borderRadius: '1.5vw' }}
                        url={
                          isMobile?.current
                            ? lang === 'english'
                              ? questionList[videoIndex]?.video_url_eng
                              : questionList[videoIndex]?.video_url_hindi
                            : lang === 'english'
                              ? questionList[videoIndex]?.video_url_landscape_eng
                              : questionList[videoIndex]?.video_url_landscape_hindi
                        }
                        poster={
                          isMobile?.current
                            ? lang === 'english'
                              ? questionList[videoIndex]?.mob_thumb_eng
                              : questionList[videoIndex]?.mob_thumb_hindi
                            : lang === 'english'
                              ? questionList[videoIndex]?.thumb_url_landscape_eng
                              : questionList[videoIndex]?.thumb_url_landscape_hindi
                        }
                        controls={false}
                        autoPlay={false}
                        preload="none"
                        playerRef={playerRefShare}
                        onClick={togglePlay}
                        onEnded={handleEnded}
                        playsInline={true}
                        loop={false}
                      />
                      <div role="button" className="hindi-button counting">
                        {videoIndex + 1}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {questionList.length > 0 && (
                <div className="buttonsRulesBottom">
                  {videoIndex > 0 ? (
                    <button onClick={() => handleVideoChange('prev')} className="btn-prev">
                      <i className="icon icon-left-open prev" /> Previous
                    </button>
                  ) : (
                    <div className="hideButton">Previous</div>
                  )}
                  <button onClick={togglePlay}>{videoStartText}</button>
                  {videoIndex < questionList?.length - 1 ? (
                    <button onClick={() => handleVideoChange('next')} className="btn-next">
                      Next
                      <i className="icon icon-right-arrow next" />
                    </button>
                  ) : (
                    <div className="hideButton">Next</div>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginTop: 'auto' }}>
              {categoriesData?.length > 0 && categoriesElem}
            </div>
          </div>
        </div>
        <div style={styles.infohide}>
          <h1 style={styles.infohide}>{props.title}</h1>
          <h2 style={styles.infohide}>{props.subTitle}</h2>
        </div>
      </div>
    </>
  );
};

export default MeriKhaniRules;

const styleString = `
.hideButton{
  width:160px;
  opacity:0
}
.mainVideoCon{
  position:relative;
  padding-top: 41%;
  background:black;
  width: 72%;
  margin: auto;
  border-radius: 12% !important; 
}
.childVideoCont{
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
}
.rulesVideoContainer{
  position:relative;
  width: 100%;
  margin: auto;
  height: 100%;
}
.rulesPageVideo{
  position: relative;
  border-radius: 12% !important; 
  height: 100%;
  padding:0px 5px;
}
.mobile-container{
  position: absolute;
  top: -8px;
  z-index: 1;
  width: 100%;
}
.hindi-button{
    top: 20%;
    position: absolute;
    left: 0;
    transform: translate(0, 20%);
    background-image: url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png);
    background-size: 99% 100%;
    border-radius: 2rem;
}
.hindi-button-left{
  left:15%;
}
.parichay-logo{
  position: relative;
  text-align: center;
}
.parichay-logo img{
  width: 23%;
}
.buttonsRulesBottom{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding-top: 1rem;
  width: 65%;
  margin: auto;
}

.counting{
    right: 5%;
    left: auto;
    top: 3%;
    font-size: 2rem;
    width: 50px;
    height: 50px;
}

.buttonsRulesBottom button{
    position : relative;
    font: bold 1.2rem Alata, sans-serif;
    color: white;
    text-decoration: none;
    background: url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png) center center / 100% 100%;
    border-radius: 50px;
    padding: 0.6rem 0;
    width: 160px; 
    align-self: center;
    white-space: nowrap;
    border: none;
    outline: none;
}

.buttonsRulesBottom .next{
  position: absolute;
  top: 8px;
  right: 35px;
}
.buttonsRulesBottom .prev{ 
  position: absolute;
  top: 8px;
  left: 30px;
}
.btn-next{
  padding: 0.6rem 0px 0.6rem 0px !important;
}
.btn-prev{
  padding: 0.6rem 0px 0.6rem 14px !important;
}

@media (min-width: 2500px) {
  .childVideoCont{
    width:100%;
  }
}

@media (max-width: 767px) {
  .categoriesClassBottom{
    margin:0px auto 10px !important
  }
  .rulesPageVideo{
    padding:5px;
    object-fit:cover;
    border-radius:6%!important;
  }
.mainVideoCon{
width:100%;
padding-top:172%
}
  .buttonsRulesBottom, .rulesVideoContainer{
    width: 97%;
    margin-bottom: 1rem;
  }
  .buttonsRulesBottom button{
    width: 100px
  }
  .hideButton{
    width:100px;
  }
  .buttonsRulesBottom .next{
    right: 10px;
  }
  .buttonsRulesBottom .prev{
    left: 4px;
  }
  .hindi-button{
    top: 7px !important;
  }
  .hindi-button-hindi{
    left:7px !important
  }
  .hindi-button-left{
    left:10px
  }
  .parichay-logo img{
    width: 50%;
    padding-top: 0.5rem;
  }
  .counting{
    top: 2%;
    width: 35px;
    height: 35px;
    font-size: 1.7rem;
  }
  .mobile-container{
    top: -4px;
  }
}
.categories-categoryTitle {
    font: 3em "Montserrat", sans-serif;
    color: #e7c822;
    position: relative;
    font-weight: 500;
}
.categories-headTitle::after {
  content: '';
  width: 72px;
  height: 6px;
  background: #f96332;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -15px;
  margin: 0 auto;
}
`;

const styles = {
  infohide: {
    width: 0,
    height: 0,
    fontSize: 0,
    opacity: 0,
    pointerEvents: 0,
  },
  langButtonHiEng: {
    top: '10px',
    position: 'absolute',
    left: '10%',
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    backgroundSize: '99% 100%',
  },
  rulesContainer: {
    padding: 0,
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  // leftContent: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   padding: '1em',
  // },
  rightContent: {
    minWidth: '0',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: '1em',
    margin: '0 auto',
    width: '100%',
  },
  questionList: {
    overflow: 'auto',
    scrollbarWidth: 'none',
    marginBottom: '1.5em',
    marginTop: '1.5em',
    maxWidth: '1100px',
  },
  videoContainer: {
    width: '324px',
    height: '634px',
    position: 'relative',
    borderRadius: '48px',
    overflow: 'hidden',
    flexShrink: '0',
    margin: 'auto 0',
  },
  // mobileFrame: {
  //   width: '100%',
  //   height: '100%',
  //   position: 'absolute',
  //   zIndex: '1',
  //   pointerEvents: 'none',
  // },
  video: {
    transform: 'scale(0.97)',
    height: '100%',
  },
  btn: {
    font: 'normal 16px Alata, sans-serif',
    color: WHITE,
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    backgroundPosition: 'center',
    borderRadius: 100,
    display: 'block',
    marginLeft: 'auto',
    padding: '0.3em 0.8em 0.4em',
  },
  btnText: {
    cursor: 'pointer',
  },
  shrinkZero: {
    flexShrink: '0',
  },
  lang: {
    font: 'normal 16px Alata, san-serif',
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    backgroundPosition: 'center',
    borderRadius: '30px',
    padding: '0.3em 0.8em 0.4em',
    display: 'block',
    width: '142px',
    textAlign: 'center',
  },
  categories: {
    font: '1.1rem sans-serif',
    // padding: '1em 0.5em 0.4em',
    padding: '0.8em 1em 0',
    margin: '1em auto 0',
    borderRadius: '30px',
    background: 'black',
    boxShadow: '0 1px 3px #858585',
    overflow: 'auto',
    display: 'flex',
    flexShrink: '0',
    maxWidth: 'max-content',
  },
  category: {
    color: '#ffffff',
    background: 'rgb(0, 0, 0, 0.35)',
    padding: '0.3em 0.6em',
    border: '0',
    borderRadius: '30px',
    outline: '0',
    margin: '0 0.5em',
    textTransform: 'capitalize',
    fontFamily: 'Montserrat',
    fontWeight: 500,
  },
  selectedCategory: {
    color: '#df4357',
    background: 'rgb(0, 0, 0)',
    padding: '0.3em 0.6em',
    border: '0',
    borderRadius: '30px',
    outline: '0',
    margin: '0 0.5em',
    textTransform: 'capitalize',
    fontFamily: 'Montserrat',
    fontWeight: 500,
  },
  triangle: {
    width: '0',
    height: '0',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '6px solid #df4357',
    margin: '0.25em auto 0',
  },
};
