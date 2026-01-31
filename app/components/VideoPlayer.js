"use client";

import { useEffect, useRef, forwardRef  } from "react";
import Hls from "hls.js";

const VideoPlayer = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const videoSrc = props?.src;

  useEffect(() => {
    const videoElement = ref?.current || videoRef.current;
    
    if (ref == null) {
    if (!videoRef.current) return;

    // If browser supports HLS natively (Safari, iOS)
    if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = videoSrc;
    } 
    // Otherwise use hls.js
    else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(videoRef.current);
      return () => hls.destroy();
    } 
    else {
      console.error("This browser does not support HLS");
    }
  } else {
    if (!ref.current) return;

    // If browser supports HLS natively (Safari, iOS)
    if (ref.current.canPlayType("application/vnd.apple.mpegurl")) {
      ref.current.src = videoSrc;
    } 
    // Otherwise use hls.js
    else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(ref.current);
      return () => hls.destroy();
    } 
    else {
      console.error("This browser does not support HLS");
    }
  }
  }, [videoSrc]);

  return (
    <video
      ref={ref == null ? videoRef : ref}
      controls={false}
      poster={props?.poster}
      autoPlay
      muted
      playsInline={true}
      loop={true}
      preload="auto"
      className={props?.className}
    />
  );
})

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
