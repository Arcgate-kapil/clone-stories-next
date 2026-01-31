'use client';
import React, { useEffect, useState } from 'react';
import { WHITE, ORANGE } from '../../constants/colors';
import { useSelector } from 'react-redux';
import CustomStyle from '../common/CustomStyle';
import { usePathname } from 'next/navigation';

const TagListBanner = props => {
  const isHindi = useSelector(state => state.blog.isHindi);
  const {
    trendingTags,
    storySlug,
    storyListing,
    storySearch,
    onStorySearchChange,
    isTagsHome,
    singleCardData,
    pageTitle,
    pageDescription,
  } = props;
  const [tagline, setTagline] = useState('');
  const [englishTitle, setEnglishTitle] = useState('');
  const [tagColor, setTagColor] = useState('');
  const [heading, setHeading] = useState(storySlug);
  const [trendingTag, setTrendingTag] = useState({});
  const pathname = usePathname();
  const parts = pathname.split('/');
  const {
    whatsapp,
    facebook,
    instagarm,
    youtube,
    twitter,
    linkedin,
    website,
    workmobUserName,
  } = trendingTag;

  useEffect(() => {
    function tagsToSlugs(tagsString) {
      return tagsString.split(',').map(v => v.trim().toLowerCase().replace(/ /g, '-'));
    }

    const tagsHindi = storyListing[0]?.tags_hindi;

    if (isHindi && tagsHindi) {
      setHeading(
        tagsToSlugs(tagsHindi)[tagsToSlugs(storyListing[0].tags).findIndex(v => v === storySlug)]
      );
    } else {
      setHeading(storySlug);
    }
  }, [storyListing, isHindi]);

  useEffect(() => {
    const style = document.head.appendChild(document.createElement('style'));

    if (trendingTags.length && storySlug) {
      for (let tag of trendingTags) {
        if (tag.tag_name.replace(/ /g, '-').toLowerCase() === storySlug.toLowerCase()) {
          setTrendingTag(tag);
          setTagColor(tag.tag_name_color);
          if (isHindi) {
            setHeading(tag.tag_name_hindi);
            setTagline(tag.tagline_hindi);
          } else {
            setEnglishTitle(props.storySlug);
            setHeading(props.storySlug);
            setTagline(tag.tagline);
          }

          style.textContent = `
            html, body {
              background-image: url(${tag.background_img}) !important;
              background-size: cover !important;
            }
          `;
        }
      }
    }

    return () => document.head.removeChild(style);
  }, [trendingTags, isHindi]);

  const viewPath =
    pathname === '/tags/' ||
    pathname === '/tags' ||
    pathname === '/hindi/tags/' ||
    pathname === '/hindi/tags';

  return (
    <div
      className={`${
        !!props.isiFrameView ? 'd-none' : 'd-block'
      } ${parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'tags' && parts[3] != undefined  || parts[0] == '' && parts[1] == 'tags' && parts[2] != undefined ? 'mt-0' : 'mt-md-5' } pt-md-5 pb-md-3 mb-md-3 bg-transparent p-0 position-relative storyListing tagListBanner`}
    >
      <CustomStyle>{styleString}</CustomStyle>
      <div
        style={{ top: 0, left: 0 }}
        className='w-100 d-flex align-items-center position-relative'
      >
        <div className='container'>
          {singleCardData && singleCardData.logo.length > 0 ? (
            <div className='TagListBanner-image-div-mobile'>
              <img src={singleCardData.logo} />
            </div>
          ) : null}

          {parts[0] == '' && parts[1] == 'hindi' && parts[2] == 'tags' && parts[3] != undefined || parts[0] == '' && parts[1] == 'tags' && parts[2] != undefined ? null : <div className='row d-flex align-items-center justify-content-between'>
            <div className='col-12'>
              <h1 className='taglist-container'>
                <span className='TaglistBanner-title'>
                  <span className='TagListPage-tagName'>
                    {pathname === '/tags/' ||
                    pathname === '/tags' ||
                    pathname === '/hindi/tags/' ||
                    pathname === '/hindi/tags' ? (
                      'Featured Tags'
                    ) : (
                      <>
                        {singleCardData && singleCardData.org_key === '1'
                          ? isHindi
                            ? 'मिलिए '
                            : 'Meet '
                          : 'Watch & learn from motivational '}{' '}
                        <span className='text-capitalize'>
                          {singleCardData && singleCardData.org_key === '1'
                            ? heading?.replace(/-/g, ' ')
                            : props.storySlug?.replace(/-/g, ' ')}
                        </span>{' '}
                        {singleCardData && singleCardData.org_key === '1'
                          ? isHindi
                            ? 'के कर्मयोगियो से'
                            : 'Team'
                          : ' stories'}
                      </>
                    )}
                  </span>
                </span>
              </h1>
              {!!heading && tagline.length > 0 && (
                <p className='TagListBanner-tagline'>{tagline}</p>
              )}
            </div>
          </div>}
          {singleCardData && singleCardData.logo.length > 0 ? (
            <div className='TagListBanner-image-div'>
              <img src={singleCardData.logo} />
            </div>
          ) : null}

          {!isTagsHome && (
            <>
              <div className='TagListBanner-searchBar search-box'>
                <div className='input-group my-3 input-group-lg'>
                  <input
                    value={storySearch}
                    onChange={event => onStorySearchChange(event.target.value)}
                    placeholder='Search by name'
                    type='text'
                    className='form-control mx-auto'
                  />
                  <i className='icon icon-icon-search-new'></i>
                </div>
              </div>
              {(whatsapp || facebook || instagarm || youtube || twitter || linkedin || website) && (
                <div className='TagListBanner-socialLinks'>
                  <span style={styles.socialLinksLabel}>Connect with us</span>
                  <div style={styles.iconsContainer}>
                    <a
                      className='mx-2 mx-md-3'
                      target='_blank'
                      href={`https://wa.me/${
                        whatsapp || 919001985566
                      }?text=I want to connect with @${workmobUserName}`}
                      style={styles.iconLink}
                    >
                      <svg width='48' height='48' viewBox='0 0 48 48' style={styles.iconSvg}>
                        <path
                          d='M11.61,44.575a23.825,23.825,0,0,0,12.306,3.408A24.123,24.123,0,0,0,48,23.992a23.992,23.992,0,1,0-44.575,12.4L0,48ZM2.829,23.992a21.079,21.079,0,1,1,9.744,17.873l-.541-.345L4.159,43.842l2.323-7.874-.345-.54A21.176,21.176,0,0,1,2.829,23.992Zm0,0'
                          transform='translate(0 -0.001)'
                          fill='#fff'
                        />
                        <path
                          d='M121.461,103.719a21.526,21.526,0,0,0,17.265,17.265c2.836.54,7,.622,9.033-1.413l1.134-1.134a3.031,3.031,0,0,0,0-4.287l-4.535-4.535a3.032,3.032,0,0,0-4.287,0l-1.134,1.134a2.017,2.017,0,0,1-2.7.008l-4.523-4.713-.02-.021a1.781,1.781,0,0,1,0-2.516l1.134-1.134a3.029,3.029,0,0,0,0-4.287l-4.535-4.535a3.035,3.035,0,0,0-4.287,0l-1.134,1.134h0c-1.623,1.624-2.165,5.085-1.413,9.034Zm3.432-7.014c1.19-1.163,1.127-1.185,1.258-1.185a.175.175,0,0,1,.124.051c4.779,4.8,4.587,4.522,4.587,4.66a.172.172,0,0,1-.051.124l-1.134,1.134a4.632,4.632,0,0,0-.011,6.543l4.526,4.716.021.021a4.87,4.87,0,0,0,6.744,0l1.134-1.134a.176.176,0,0,1,.248,0c4.779,4.8,4.587,4.522,4.587,4.659a.171.171,0,0,1-.051.124l-1.134,1.134c-.777.777-3.252,1.242-6.48.627a18.671,18.671,0,0,1-14.994-14.994c-.615-3.228-.15-5.7.627-6.48Zm0,0'
                          transform='translate(-110.025 -84.172)'
                          fill='#fff'
                        />
                      </svg>
                    </a>
                    {facebook && (
                      <a
                        className='mx-2 mx-md-3'
                        href={facebook}
                        target='_blank'
                        style={styles.iconLink}
                      >
                        <img
                          style={styles.iconSvg}
                          src='https://cdn.workmob.com/stories_workmob/images/common/facebook.svg'
                          alt='facebook icon'
                        />
                      </a>
                    )}
                    {instagarm && (
                      <a
                        className='mx-2 mx-md-3'
                        href={instagarm}
                        target='_blank'
                        style={styles.iconLink}
                      >
                        <img
                          style={styles.iconSvg}
                          src='https://cdn.workmob.com/stories_workmob/images/common/instagram.svg'
                          alt='instagram icon'
                        />
                      </a>
                    )}
                    {youtube && (
                      <a
                        className='mx-2 mx-md-3'
                        href={youtube}
                        target='_blank'
                        style={styles.iconLink}
                      >
                        <img
                          style={styles.iconSvg}
                          src='https://cdn.workmob.com/stories_workmob/images/common/youtube.svg'
                          alt='youtube icon'
                        />
                      </a>
                    )}
                    {twitter && (
                      <a
                        className='mx-2 mx-md-3'
                        href={twitter}
                        target='_blank'
                        style={styles.iconLink}
                      >
                        <img
                          style={styles.iconSvg}
                          src='https://cdn.workmob.com/stories_workmob/images/common/twitter.svg'
                          alt='twitter icon'
                        />
                      </a>
                    )}
                    {linkedin && (
                      <a
                        className='mx-2 mx-md-3'
                        href={linkedin}
                        target='_blank'
                        style={styles.iconLink}
                      >
                        <img
                          width="100%"
                          height="auto"
                          style={styles.iconSvg}
                          src='https://cdn.workmob.com/stories_workmob/images/common/linkedin.svg'
                          alt='linkedin icon'
                        />
                      </a>
                    )}
                  </div>
                  {website && (
                    <a href={website} style={styles.visitWebsite} target='_blank'>
                      Visit website
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div style={{ width: 0, height: 0, fontSize: 0, opacity: 0, pointerEvents: 'none' }}>
        <h1 style={{ width: 0, height: 0, fontSize: 0 }}>{pageTitle}</h1>
        <h2 style={{ width: 0, height: 0, fontSize: 0 }}>{pageDescription}</h2>
      </div>
    </div>
  );
};

export default TagListBanner;

const styleString = `
  .taglist-container {
    font: 3.8em/1 'Montserrat', sans-serif;
    color: #fff;
    text-align: center;
    position: relative;
    margin-bottom: 0.38em;

  }

  .taglist-container::after {
    content: '';
    width: 50px;
    height: 6px;
    background: #f96332;
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    margin: 0.21em auto 0;
  }

  .TaglistBanner-title {
    font-size: inherit;
    position: relative;
    color: #e7c822;
  }

  .TagListBanner-searchBar {
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
  }

  .TagListBanner-tagline {
    text-align: center;
    font-size: 2.3em;
    font-weight: bold;
    color: #fff;
    margin: 0.25em auto;
    font-family:'Alata';
    width:90%;
    font-weight:400;
    line-height:3rem;
  }

  .TagListBanner-image-div{
    position:absolute;
    max-width:100px;
    bottom:12%;
    transform:translateX(90%)
  }

  .TagListBanner-image-div img{
    width:100%
  }

  .TagListBanner-tagline:first-letter {
    text-transform: uppercase;
  }

  .TagListBanner-socialLinks {
    color: #fff;
    margin: 1em 0 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .TagListBanner-image-div-mobile{
    display: block;
    width: 100%;
    max-width: 100px;
    margin: 1rem auto 0rem;
  }

  .TagListBanner-image-div-mobile img{
    width: 100%;
  }

  @media(max-width: 1200px) {
    .TagListBanner-image-div{
      display:none
    }
    .taglist-container {
      margin-top: 0.4em;
    }
  }

  @media(min-width: 1200px) {
    .TagListBanner-image-div-mobile{
      display:none
    }
  }


  @media(max-width: 770px) {
    .TagListBanner-tagline {
      font-size: 1em;
      line-height:1.5em;
      margin:1em auto;
    }

    .taglist-container {
      font-size: 1.5em;
      margin-top: 0.5em;
    }
    
    .taglist-container::after {
      width: 30px;
      height: 3px;
    }

    .TagListBanner-socialLinks {
      font-size: 0.5em;
    }
  }
`;

const styles = {
  subTitle: {
    textTransform: 'uppercase',
    color: WHITE,
    lineHeight: 1,
    font: '3.4vw Alata, sans-serif',
  },
  divider: {
    width: 50,
    height: 6,
    margin: '0 auto',
    backgroundColor: ORANGE,
  },
  overlay: {
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  socialLinksLabel: {
    fontSize: '1.3em',
    fontWeight: 'bold',
    color: '#dbdbdb',
    whiteSpace: 'nowrap',
    marginRight: '1.5em',
  },
  iconsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  iconSvg: {
    width: '2.5em',
    height: '2.5em',
  },
  visitWebsite: {
    fontSize: '1.2em',
    color: 'inherit',
    padding: '0.25em 0.8em',
    borderRadius: '30px',
    background:
      'center/100% 100% url(https://cdn.workmob.com/stories_workmob/images/promotional/button-bg.png)',
    lineHeight: '1.7',
    whiteSpace: 'nowrap',
    marginLeft: '1.8em',
  },
};
