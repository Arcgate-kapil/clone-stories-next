import React, { Component, useRef } from 'react';
import ReactHlsPlayer from '../HSL';
import useWindowSize from '../../utils/useWindowSize';
import CardVideo from '../common/CardVideo';

const VideoContainer = ({ videoUrl, thumbUrl, toggleMute, isMuted, styles }) => {
  const [autoPlay, setAutoPlay] = React.useState(false);
  const [isVideoMute, toggleVideoVoice] = React.useState(false);
  const { width } = useWindowSize();
  const playerRef = useRef()

  React.useEffect(() => {
    // setTimeout(()=>{
    //     const media = document.getElementById('video');
    //     if(!!media) {
    //         media.muted = true; // without this line it's not working although I have "muted" in HTML
    //         media.play();
    //     }
    // },500)
    // let isVideoMutes = sessionStorage.getItem('isVideoMute')
    // isVideoMutes = !!isVideoMutes && isVideoMutes == 'false'  ? false : true;
    // const _elem = document.getElementById('merikahani');
    // if(!!_elem) {
    //     _elem.muted = true
    //     sessionStorage.setItem('isVideoMute', isVideoMutes)
    // }
    // toggleVideoVoice(isVideoMutes);
  }, []);

  const volumClick = () => {
    toggleVideoVoice(!isVideoMute);
    const _elem = document.getElementById('merikahani');
    if (!!_elem) {
      _elem.muted = isVideoMute;
      sessionStorage.setItem('isVideoMute', !isVideoMute);
    }
  };

  function togglePlay() {
    const player = playerRef.current;

    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  }

  return (
    <div className='sharePageVideoContainer'>
    <CardVideo
      poster={
        width > 767
          ? 'https://cdn.workmob.com/stories_workmob/images/common/merikahani.jpg'
          : 'https://cdn.workmob.com/stories_workmob/images/common/merikahani_mobile.jpg'
      }
      videoUrl={
        width > 767
          ? `https://cdn.workmob.com/stories_workmob/merikahani-award-web/merikahani-award-web.m3u8`
          : `https://cdn.workmob.com/stories_workmob/merikahani-award-mobile/merikahani-award-mobile.m3u8`
      }
      shareClassName={'shareClassName'}
      togglePlay={togglePlay}
      playerRef={playerRef}
    />
    </div>
  );

  // return(
  //     <>
  //     <ReactHlsPlayer
  //         url={
  //             width > 767
  //             ?
  //             `https://workmob-v3.s3.ap-south-1.amazonaws.com/stories_workmob/merikahani-award-web/merikahani-award-web.m3u8`
  //             :
  //             `https://workmob-v3.s3.ap-south-1.amazonaws.com/stories_workmob/merikahani-award-mobile/merikahani-award-mobile.m3u8`
  //         }
  //         preload='auto'
  //         style={{background:'BLACK', outline:'none', marginLeft:0, marginTop:0}}
  //         loop = {true}
  //         width="100%"
  //         height="521px"
  //         muted={!isVideoMute}
  //         poster={'https://workmob-v3.s3.ap-south-1.amazonaws.com/stories_workmob/images/common/merikahani.jpg'}
  //     />
  //     <div id='btnMute' rel='btnMute' onClick={volumClick} className='mutem3u8Btn'>
  //       {
  //         isVideoMute
  //         ?
  //         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className="rh5v-Volume_icon" fill="#fff"><path d="M14.016 3.234C18.047 4.125 21 7.734 21 12s-2.953 7.875-6.984 8.766v-2.063c2.906-.844 4.969-3.516 4.969-6.703s-2.063-5.859-4.969-6.703V3.234zM16.5 12a4.451 4.451 0 0 1-2.484 4.031V7.968c1.5.75 2.484 2.25 2.484 4.031zM3 9h3.984L12 3.984v16.031l-5.016-5.016H3v-6z"></path></svg>
  //         :
  //         <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" className="rh5v-Volume_icon" fill="#fff"><path d="M12 3.984v4.219L9.891 6.094zM4.266 3L21 19.734 19.734 21l-2.063-2.063c-1.078.844-2.297 1.5-3.656 1.828v-2.063c.844-.234 1.594-.656 2.25-1.172l-4.266-4.266v6.75l-5.016-5.016H2.999v-6h4.734L2.999 4.264zm14.718 9c0-3.188-2.063-5.859-4.969-6.703V3.234c4.031.891 6.984 4.5 6.984 8.766a8.87 8.87 0 0 1-1.031 4.172l-1.5-1.547A6.901 6.901 0 0 0 18.984 12zM16.5 12c0 .234 0 .422-.047.609l-2.438-2.438V7.968c1.5.75 2.484 2.25 2.484 4.031z"></path></svg>
  //       }
  //       {
  //         <p className="position-absolute muteText">{`Tap to ${!isVideoMute?'unmute':'mute'}`}</p>
  //       }
  //     </div>
  //     </>
  // )
};

export default VideoContainer;
