'use client';
import React, { useEffect, useState } from 'react';
import useWindowSize from '../utils/useWindowSize';
import { fetchUserDataTable } from '../lib/features/blogSlice';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from './AdminPage/DataTable';
import { useRouter } from 'next/navigation';

const AdminPage = props => {
  const [username, setUserName] = useState('harishji');
  const [password, setPasswordName] = useState('Arcgate1!');
  const [auth, setAuthentication] = useState(true);
  const [loading, setLoading] = useState(true);
  const state = useSelector((state) => state.blog);
  const { width } = useWindowSize();
  let dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setAuthentication(localStorage.getItem('token'));
    if (!!localStorage.getItem('token')) {
      dispatch(fetchUserDataTable(callback => {
        setLoading(false);
      }));
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (username == 'harishji' && password == 'Arcgate1!') {
      localStorage.setItem('token', '123456');
      dispatch(fetchUserDataTable(callback => {
        setAuthentication(true);
      }));
    } else {
      setAuthentication(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthentication(false);
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    router.push(state.isHindi ? '/hindi' : '/');
    // router.back();
  }

  if (loading) {
    return (
      <div className={'admin-page d-flex align-items-center justify-content-center'}>
        <div
          className='spinner-border text-success '
          style={{ width: '5rem', height: '5rem' }}
          role='status'
        >
          <span className='sr-only'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="waveBtn animate__animated animate__jello" style={{ pointerEvents: 'none' }}>
        <i
          style={{ pointerEvents: 'auto' }}
          onClick={(e) => handleBackClick(e)}
          className={`btnClose icon icon-cancel d-flex align-items-center justify-content-center rounded-circle font-weight-bold`}
        />
        <div
          onClick={(e) => handleBackClick(e)}
          className="closeBtnWave d-flex align-items-center justify-content-center"
          style={{ backgroundColor: '#DF625C', cursor: 'pointer', pointerEvents: 'auto' }}
        >
          &nbsp;
        </div>
      </div>
      {!auth ? (
        <section className='admin-page position-relative'>
          <div style={styles.logo_container}>
            <img
              width="172px"
              height="auto"
              src='https://cdn.workmob.com/stories_workmob/images/common/logo.png'
              alt='logo'
            />
          </div>
          <div className='container'>
            <form onSubmit={handleSubmit} className='mt-5'>
              <div className='row'>
                <div className='col-md-6 mx-auto' style={styles.mt_100}>
                  <div className='form-group mb-4'>
                    <label className='text-white' htmlFor='username'>
                      Username
                    </label>
                    <input
                      onChange={e => setUserName(e.target.value)}
                      className='form-control'
                      id='username'
                      placeholder='Enter username'
                    />
                  </div>
                  <div className='form-group mb-4'>
                    <label className='text-white' htmlFor='password'>
                      Password
                    </label>
                    <input
                      onChange={e => setPasswordName(e.target.value)}
                      type='password'
                      className='form-control'
                      id='password'
                      placeholder='Password'
                    />
                  </div>
                  <button type='submit' className='btn btn-primary mt-4'>
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      ) : (
        <section className='admin-page bg-none h-100'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12 mx-auto'>
                <p onClick={logout} className='text-white cursor-pointer'>
                  Logout
                </p>
                <DataTable userDataTable={state.userDataTable} />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AdminPage;

const styles = {
  logo_container: {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    top: '14px',
    left: 0,
    right: 0,
  },
  mt_100: {
    marginTop: '100px',
  }
};
