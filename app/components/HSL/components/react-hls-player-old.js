import React, { useEffect } from 'react';
import Hls from 'hls.js';

function ReactHlsPlayer({
  autoplay = false,
  controls = true,
  hlsConfig = {},
  videoProps = {},
  poster = '',
  startVideo = () => {},
  id = 'storyVideo',
  playerRef = React.createRef(),
  style = {},
  width = '100%',
  // height = 'auto',
  className,
  url,
  ...props
}) {
  useEffect(() => {
    let video;

    if (className) {
      video = document.querySelector(`.${className}`);
    } else {
      video = document.getElementById('storyVideo');
    }

    if (!!video) {
      if (Hls.isSupported()) {
        var hls = new Hls(
          props.type === 'MOREVIDEOS' ? {
          debug: true,
          maxBufferLength: 1,
        } : {
          debug: true,
        }
        );
        hls.loadSource(`${url}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          //video.muted = true;
          if (props.autoPlay) {
            video.play();     
          }
          startVideo();
        });
      }
      // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
      // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
      // This is using the built-in support of the plain video element, without using hls.js.
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('canplay', function () {
          video.play();
        });
      }
    }
  }, [url, poster]);

//   const checkCurrentTime = () => {
//     let video;
//     if (className) {
//       video = document.querySelector(`.${className}`);
//     } else {
//       video = document.getElementById('storyVideo');
//     }

//     if (video && !document.fullscreenElement) {
//         const currentTime = Math.round(video?.currentTime);
        
//         if (currentTime >= 9 && currentTime < 9) {
//           video.pause(); 
//           props?.setLayoverPlayButton(true);
//         }
//     }
// };

// useEffect(() => {
//   if (props?.bufferTime) {
//     const interval = setInterval(checkCurrentTime, 10000); 

//     return () => clearInterval(interval); 
//   }
// }, [props?.bufferTime]);

  useEffect(() => {
    if (props.type === 'MOREVIDEOS') {
      const player = playerRef.current;

      const checkVisibility = () => {
        if (
          player.getBoundingClientRect().top < 380 &&
          player.getBoundingClientRect().bottom > 30
        ) {
          if (player.paused) {
            // player.play();
          }
        } else {
          player.pause();
        }
      };

      document.addEventListener('scroll', checkVisibility);

      return () => document.removeEventListener('scroll', checkVisibility);
    }
  }, []);

  return (
    <video
      id={id}
      rel='hslVideo'
      className={className}
      style={style}
      ref={playerRef}
      controls={controls}
      width={width}
      // height={height}
      poster={poster}
      {...videoProps}
      {...props}
    ></video>
  );
}

export default ReactHlsPlayer;
