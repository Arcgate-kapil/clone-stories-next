'use client';

import React, { useEffect, useRef } from 'react';

function ReactHlsPlayer({
  autoplay = false,
  controls = true,
  hlsConfig = {},
  videoProps = {},
  poster = '',
  startVideo = () => {},
  id = 'storyVideo',
  style = {},
  width = '100%',
  className,
  url,
  type,
  ...props
}) {
  const playerRef = useRef(null);

  // 🎯 Load HLS dynamically (performance optimized)
  useEffect(() => {
    if (!url) return;

    const video = playerRef.current;
    if (!video) return;

    let hls;

    const loadHls = async () => {
      const Hls = (await import('hls.js')).default;

      if (Hls.isSupported()) {
        hls = new Hls(
          type === 'MOREVIDEOS'
            ? { debug: false, maxBufferLength: 1, ...hlsConfig }
            : { debug: false, ...hlsConfig }
        );

        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          if (autoplay) {
            video.play().catch(() => {});
          }
          startVideo();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('canplay', () => {
          if (autoplay) video.play().catch(() => {});
        });
      }
    };

    loadHls();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [url, autoplay, type]);

  // 🎯 Auto pause/play based on visibility (better than scroll event)
  useEffect(() => {
    if (type !== 'MOREVIDEOS') return;

    const video = playerRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [type]);

  return (
    <video
      id={id}
      ref={playerRef}
      className={className}
      style={style}
      controls={controls}
      width={width}
      poster={poster}
      playsInline
      {...videoProps}
      {...props}
    />
  );
}

export default ReactHlsPlayer;