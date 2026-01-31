import React, { useState } from 'react';
import { ORANGE } from '../../constants/colors';
import { EVENT_TYPE, SCREEN_NAME } from '../../constants/firebaseString';
import { useSelector } from 'react-redux';

const PodcastDetailPageContent = props => {
  const isHindi = useSelector(state => state.blog.isHindi);
  const {
    fullStory,
    workmobUserId,
    name,
    fullStory_hindi,
  } = props.storyDetail;

  const btnClick = () => {
    customEvent(EVENT_TYPE.followMe, {
      name: name,
      workmobUserId: workmobUserId,
      screen_name: SCREEN_NAME.storyDetail,
    });
  };

  return (
    <section className='position-relative my-5'>
      <div className='container'>
        {!!workmobUserId && (
          <div className='text-center mb-3'>
            <a
              onClick={btnClick}
              href={`https://workmob.com/?likeVideo=${workmobUserId}`}
              target='_blank'
              style={styles.btn}
              className='btn py-3 btn-lg font-weight-bold text-white d-inline-flex align-items-center'
            >
              <i style={{ fontSize: 20 }} className='icon icon-heart-filled pr-1' />
              {`Like this story`}
            </a>
          </div>
        )}
        <div className='row position-relative articleDetail'>
          <div style={styles.content} className='col-12 text-white'>
            <div
              className={`mb-3 ${isHindi ? 'newKhands' : ''}`}
              dangerouslySetInnerHTML={{ __html: isHindi ? fullStory_hindi : fullStory }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastDetailPageContent;

const styles = {
  content: {
    fontSize: 20,
  },
  btn: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: ORANGE,
    borderRadius: 100,
  },
};
