/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import {ORANGE} from '../../constants/colors';
import TranscriptionModal from './TranscriptionModal';


const ReadTranscription = (props) => {
  const { transcript, storyHeading='', category='' } = props;
  const [showTranscription, toggleTranscription] = React.useState(false);

  return (
    <div className="col-12">
      <p className="mb-3"><button onClick={toggleTranscription} className="bg-transparent border-0 p-0" data-toggle="modal"  style={styles.linkText}>READ TRANSCRIPTION</button></p>
      {
        showTranscription &&
        <TranscriptionModal category = {category} toggleTranscription={toggleTranscription} transcript={transcript} storyHeading = {storyHeading} />
      }
    </div>
  )
};

export default ReadTranscription;

const styles = {
  linkText: {
    boxShadow:'none',
    outline:'none',
    color:ORANGE
  },
}
