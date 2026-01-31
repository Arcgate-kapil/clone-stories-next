import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { SCREEN_NAME } from '../constants/firebaseString';
import { trackScreen } from '../actions/firebase';

const NotFoundPage = ({ staticContext = {} }) => {
  staticContext.notFound = true;

  React.useEffect(() => {
    trackScreen(SCREEN_NAME.notFound);
  }, []);

  return (
    <div className='container pt-5 mt-5'>
      <div className='row'>
        <div className='col-12 mt-5'>
          <h1 className='text-white'>Page Not Found!!!</h1>
          <Link className='text-secondary' to='/'>
            Go to home
          </Link>
        </div>
      </div>
      <div className='row'>
        <div className='col-12 mt-5'>
          <Footer />
        </div>
      </div>
    </div>
  );
};

NotFoundPage.propTypes = {
  staticContext: PropTypes.objectOf(PropTypes.any),
};

NotFoundPage.defaultProps = {
  staticContext: {},
};
export default NotFoundPage;
// export default {
//   component: NotFoundPage
// };
