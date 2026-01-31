import React, { useState } from 'react';

const AudioPlayer = (props) => {
  React.useEffect(() => {
    //alert(props.src)
    // Possible improvements:
    // - Change timeline and volume slider into input sliders, reskinned
    // - Change into Vue or React component
    // - Be able to grab a custom title instead of "Music Song"
    // - Hover over sliders to see preview of timestamp/volume change

    const audioPlayer = document.querySelector('.audio-player');

    let audio = document.getElementById('audio');
    //credit for song: Adrian kreativaweb@gmail.com
    audioPlayer.querySelector('.controls .toggle-play').click();
    console.dir(audio);

    audio.addEventListener(
      'loadeddata',
      () => {
        //alert(props.src)
        audioPlayer.querySelector('.time .length').textContent = getTimeCodeFromNum(audio.duration);
        audio.volume = 0.75;
        playBtn.click();
      },
      false
    );

    //click on timeline to skip around
    const timeline = audioPlayer.querySelector('.timeline');
    timeline.addEventListener(
      'click',
      (e) => {
        const timelineWidth = window.getComputedStyle(timeline).width;
        const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
        audio.currentTime = timeToSeek;
      },
      false
    );

    //click volume slider to change volume
    // const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
    // volumeSlider.addEventListener('click', e => {
    //     const sliderWidth = window.getComputedStyle(volumeSlider).width;
    //     const newVolume = e.offsetX / parseInt(sliderWidth);
    //     audio.volume = newVolume;
    //     audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
    // }, false)

    //check audio percentage and update time accordingly
    setInterval(() => {
      const progressBar = audioPlayer.querySelector('.progress');
      progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
      if (!!audio.duration) {
        audioPlayer.querySelector('.time .length').textContent = getTimeCodeFromNum(
          audio.duration - audio.currentTime || audio.duration
        );
      }
    }, 500);

    //toggle between playing and pausing on button click
    const playBtn = audioPlayer.querySelector('.controls .toggle-play');
    playBtn.addEventListener(
      'click',
      () => {
        if (audio.paused) {
          playBtn.classList.remove('play');
          playBtn.classList.add('pause');
          audio.play();
        } else {
          playBtn.classList.remove('pause');
          playBtn.classList.add('play');
          audio.pause();
        }
      },
      false
    );

    audioPlayer.querySelector('.volume-button').addEventListener('click', () => {
      const volumeEl = document.querySelector('#volumIcon');
      audio.muted = !audio.muted;
      if (audio.muted) {
        volumeEl.classList.remove('icon-unmute');
        volumeEl.classList.add('icon-mute');
      } else {
        volumeEl.classList.add('icon-unmute');
        volumeEl.classList.remove('icon-mute');
      }
    });

    //turn 128 seconds into 2:08
    function getTimeCodeFromNum(num) {
      let seconds = parseInt(num);
      let minutes = parseInt(seconds / 60);
      seconds -= minutes * 60;
      const hours = parseInt(minutes / 60);
      minutes -= hours * 60;

      if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
      return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    }
  }, [props.src]);

  return (
    <div className="audio-player">
      <audio
        id="audio"
        controls={false}
        style={{ position: 'absolute', left: -999999999, opacity: 0, zIndex: -1 }}
      >
        <source src={props.src} type="audio/mp3" />
      </audio>
      <div className="controls d-flex flex-column ">
        <div className="play-container text-center">
          <div className="toggle-play d-inline-block audioPlay mb-3 ">
            <i style={{ display: 'none' }} className="icon icon-play"></i>
            <i className="icon icon-pause-1"></i>
          </div>
        </div>
        <div className="timeline">
          <div className="time position-relative d-flex flex-row align-items-center justify-content-between">
            <div className="current">0:00</div>
            <div className="progress position-absolute">
              <span className="progress-circle position-absolute"></span>
            </div>
            <div className="length"></div>
          </div>
        </div>
        <div className="volume-container">
          <div id="originalVolumBtn" className="volume-button">
            <div className="volume icono-volumeMedium"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
