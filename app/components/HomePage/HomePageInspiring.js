/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Link } from 'react-router-dom';
import CardInspiring from '../common/CardInspiring';
import ListTitle from '../../components/common/ListTitle';
import { HOME_PAGE } from '../../constants/localString';
import { WHITE } from '../../constants/colors';
import { customEvent } from '../../actions/firebase';
import { SCREEN_NAME, EVENT_TYPE } from '../../constants/firebaseString';

const HomePageInspiring = (props) => {
  const isHindi = props.isHindi;

  const showMoreClick = () => {
    customEvent(EVENT_TYPE.showMore, {
      title: HOME_PAGE.viewMore,
      slug: '/voices',
    });
    // window.scrollTo(0, 0);
  };

  return (
    <div
      style={{ width: '100%', maxWidth: '90%' }}
      className="container-fluid homepage-inspiring-story"
    >
      <div className="row">
        <div className="col-12 col-md-10 m-auto">
          <ListTitle
            title={isHindi ? 'प्रेरक कहानियां' : 'Inspiring Stories '}
            link={`voices`}
          />
        </div>
      </div>
      <div className="row inspring-thumbs">
        {[...props.blogs.blogs['stories']]
          .slice()
          .splice(1, 8)
          .map((story, index) => (
            <CardInspiring
              isHindi={isHindi}
              colSize={3}
              screenName={SCREEN_NAME.homePage}
              story={story}
              key={index}
            />
          ))}
      </div>
      <div className="row">
        <div className="col-12 text-center btnViewMore">
          {/* <Link
            style={styles.btn}
            onClick={showMoreClick}
            to={`${isHindi ? '/hindi' : ''}/voices`}
            className="btn font-weight-bold btn-lg mx-auto my-3 px-5"
          >
            {isHindi ? 'और देखें' : HOME_PAGE.viewMore}
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default HomePageInspiring;

const styles = {
  btn: {
    backgroundImage:
      'url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    backgroundPosition: 'center',
    color: WHITE,
    borderRadius: 100,
  },
};
