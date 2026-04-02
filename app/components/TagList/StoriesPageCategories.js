/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { ORANGE_1, WHITE, GREEN, ORANGE } from '../../constants/colors';
import useWindowSize from '../../utils/useWindowSize';
import CloseBtn from '../common/CloseBtn';

let StoriesPageCategories = props => {
  const {
    categoryId,
    location: { pathname },
    match: {
      params: { id },
    },
    categories = [],
    fetchStoryListing,
    categoryType = 'voices',
  } = props;
  const { width } = useWindowSize();

  const [showDropDownCategory, toggleCategory] = React.useState(false);
  const [dropDownActive, setDropDownActive] = React.useState(false);
  const [arrSize, setInitialArrSize] = React.useState(8);
  const [openDialog, toggleDialog] = React.useState(false);

  const doToggleDropDown = () => {
    toggleCategory(!showDropDownCategory);
    setDropDownActive(true);
  };

  const doToggleDialog = status => {
    toggleDialog(status);
    if (status) {
      document.body.classList.add('overflow-hidden');
      window.history.replaceState({}, {}, '/categories');
    } else {
      document.body.classList.remove('overflow-hidden');
      window.history.replaceState({}, {}, `/${categoryType}`);
    }
  };

  React.useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  React.useEffect(() => {
    if (pathname == '/categories') {
      doToggleDialog(true);
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [pathname]);

  React.useEffect(() => {
    if (width < 768) {
      setInitialArrSize(categories.length);
    } else if (width > 768 && width < 1024) {
      setInitialArrSize(5);
    } else if (width > 1024 && width < 1150) {
      setInitialArrSize(7);
    } else {
      setInitialArrSize(8);
    }
  }, [width, categories]);

  React.useEffect(() => {
    if (!!categories.length) {
      const _index = categories
        .slice()
        .splice(0, arrSize)
        .findIndex(category => category.category == id);
      if (_index > -1 || !id) {
        setDropDownActive(false);
      } else {
        setDropDownActive(true);
      }
    }
  }, [id]);

  const callSubCategoryJSON = category => {
    if (!!showDropDownCategory) {
      doToggleDropDown(false);
    }
    console.log('gdhh', category);
    fetchStoryListing(category);
  };

  return (
    <>
      {!id && (
        <small className='d-block btnViewMore text-center'>
          <div
            style={styles.btn}
            onClick={e => doToggleDialog(true)}
            className='btn font-weight-bold btn-lg mx-auto my-3 px-5'
          >
            {' '}
            Explore more{' '}
          </div>
        </small>
      )}
      <section className='fixed-bottom px-1  px-md-0 py-3 categoryContainer'>
        <div className='category-container py-2 py-md-3 px-md-3  px-2 m-auto'>
          <div className='d-flex align-items-center justify-content-start  justify-content-md-center'>
            {!!categories &&
              !!categories.length &&
              categories.slice().splice(0, arrSize).length &&
              categories
                .slice()
                .splice(0, arrSize)
                .map((category, index) => (
                  <Link
                    onClick={e => callSubCategoryJSON(category.category)}
                    key={index}
                    className={`mr-2 px-3 p-2 ${
                      id == category.category || (!id && category.category == 'top')
                        ? `bg-black text-red`
                        : `text-white`
                    } rounded-pill text-capitalize font-12 text-nowrap`}
                    to={`/${categoryType}${
                      category.category == 'top' ? '' : `/${category.category}`
                    }`}
                  >
                    {category.title}
                  </Link>
                ))}
            {!!categories && !!categories.length && categories.length > arrSize && (
              <div className='position-relative d-none d-md-block'>
                <span
                  onClick={doToggleDropDown}
                  className={`moreBtn cursor-pointer ${
                    dropDownActive ? 'bg-black text-red' : 'text-white'
                  } ${
                    showDropDownCategory ? 'arrow-up downArrow' : ''
                  }  mr-2 p-2 px-3 rounded-pill font-weight-bold text-capitalize font-12 text-nowrap`}
                >
                  More
                  <i
                    style={{ fontSize: 12, transform: 'rotate(90deg)' }}
                    className='icon icon-up-open'
                  />
                </span>
                {!!showDropDownCategory && (
                  <>
                    <CategoryListOption
                      categoryType={categoryType}
                      customClass='position-absolute'
                      id={id}
                      callSubCategoryJSON={callSubCategoryJSON}
                      categories={categories.slice().splice(arrSize, categories.length)}
                    />
                    <div onClick={doToggleDropDown} className='position-fixed overlay-bg'>
                      &nbsp;
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      {openDialog && (
        <>
          <div
            style={{ zIndex: 99999 }}
            className='pt-5 pt-md-0  flex-column fixed-top d-flex overlay-bg d-column white align-items-center justify-content-start explore-more-catogories'
          >
            <h3
              style={{ borderBottom: '2px solid red', background: '#000' }}
              className='w-100 m-0 font-20  p-3 font-weight-bold montserrat-regular text-white text-center category-header'
            >
              Categories
              <CloseBtn goBack={e => doToggleDialog(false)} />
              {/* <span onClick={(e)=>doToggleDialog(false)} className="cursor-pointer"><i className="icon icon-cancel"></i></span> */}
            </h3>
            <CategoryListOption
              categoryType={categoryType}
              id={id}
              callSubCategoryJSON={callSubCategoryJSON}
              categories={categories.slice().splice(1, categories.length)}
              customClass='column-4'
            />
          </div>
          {/* <div style={{zIndex:9999}} onClick={(e)=>doToggleDialog(false)} className="position-fixed white overlay-bg">&nbsp;</div> */}
        </>
      )}
    </>
  );
};

const CategoryListOption = ({
  categoryType,
  categories,
  callSubCategoryJSON,
  id,
  customClass = 'column-3',
}) => (
  <ul className={`rounded py-2 dropDownCategory ${customClass} px-3 flex-wrap text-left`}>
    {categories.map((category, index) => (
      <li key={index}>
        {' '}
        <Link
          onClick={e => callSubCategoryJSON(category.category)}
          className={`font-weight-bold text-capitalize font-12 ${
            id == category.category ? 'text-red' : 'text-white'
          }`}
          to={`/${categoryType}/${category.category}`}
        >
          {category.title}
        </Link>
      </li>
    ))}
  </ul>
);

export default withRouter(StoriesPageCategories);

const styles = {
  text1: {
    fontSize: 80,
    color: ORANGE_1,
    fontFamily: 'Alata',
  },
  text2: {
    fontSize: 80,
    color: WHITE,
    fontFamily: 'Alata',
  },
  text3: {
    fontSize: 80,
    color: GREEN,
    fontFamily: 'Alata',
  },
  caption: {
    lineHeight: 1,
    fontSize: '3.8vw',
  },
  subTitle: {
    opacity: 0.9,
    color: WHITE,
    lineHeight: 1,
    fontSize: '3.4vw',
  },
  divider: {
    width: 50,
    height: 6,
    margin: '45px auto 16px auto',
    backgroundColor: ORANGE,
  },
  overlay: {
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  btn: {
    color: WHITE,
    backgroundColor: ORANGE,
    borderRadius: 100,
  },
};
