'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  XIcon,
  LinkedinShareButton,
  EmailShareButton,
  LinkedinIcon,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import { usePathname } from 'next/navigation';
import { HOST } from '../../constants/localString';
import { PURPLE } from '../../constants/colors';
import { EVENT_TYPE } from '../../constants/firebaseString';
import { customEvent } from '@/app/firebase/firebase';
import useWindowSize from '../../utils/useWindowSize';

const SocialShare = (props) => {
  const {
    storyHeading,
    fbTitle = '',
    emailText,
    emailSub,
    twitterTitle = '',
    customClass = '',
    customStyle = {},
    embedLink,
    copyLink,
  } = props;

  const pathname = usePathname();
  const shareUrl = HOST + pathname;
  const { width } = useWindowSize();
  const [showEmbedPopup, setShowEmbedPopup] = useState(false);
  const hiddenInputRef = useRef();
  const embedInputRef = useRef();

  const copyHref = () => {
    const input = hiddenInputRef.current;
    input.value = copyLink || window.decodeURIComponent(window.location.href);
    input.hidden = false;
    input.select();
    input.focus();
    document.execCommand('copy');
    input.hidden = true;
    input.value = '';
    shareArticle('copy');
  };

  const shareArticle = (type) => {
    customEvent(EVENT_TYPE.socialShare, {
      shareType: type,
      slug: pathname.replace('/', ''),
    });
  };

  const iconSize = 30;

  function copyToClipBoard(input) {
    input.focus();
    input.select();
    document.execCommand('copy');
  }

  useEffect(() => {
    if (showEmbedPopup) {
      const embedInput = embedInputRef.current;
      embedInput.style.height = embedInput.scrollHeight + 'px';
    }
  }, [showEmbedPopup]);

  return (
    <div className={`mb-0 mt-2 social-share z-index-1 ${customClass}`} style={customStyle}>
      <div className="">
        <ul className="navbar-nav flex-md-column flex-row justify-content-center">
          <li
            onClick={(e) => shareArticle('facebook')}
            className="nav-item pr-3 pb-2 cstm-tooltip fb"
            data-tooltip-position="left"
            data-tooltip="Share on Facebook"
          >
            <FacebookShareButton hashtag={fbTitle} url={embedLink}>
              <FacebookIcon size={iconSize} round />
            </FacebookShareButton>
          </li>
          <li
            onClick={(e) => shareArticle('whatsapp')}
            className="nav-item pr-3 pb-2 cstm-tooltip whatsapp"
            data-tooltip-position="left"
            data-tooltip="Share on Whatsapp"
          >
            <WhatsappShareButton url={embedLink} title={storyHeading} separator={' : '}>
              <WhatsappIcon size={iconSize} round />
            </WhatsappShareButton>
          </li>
          <li
            onClick={(e) => shareArticle('linkedIn')}
            className="nav-item pr-3 pb-2 cstm-tooltip linkedin"
            data-tooltip-position="left"
            data-tooltip="Share on Linkedin"
          >
            <LinkedinShareButton title={storyHeading} url={embedLink}>
              <LinkedinIcon size={iconSize} round />
            </LinkedinShareButton>
          </li>
          <li
            onClick={(e) => shareArticle('twitter')}
            className="nav-item pr-3 pb-2 cstm-tooltip twitter"
            data-tooltip-position="left"
            data-tooltip="Share on Twitter"
          >
            <TwitterShareButton title={`${twitterTitle}`} url={embedLink}>
              {/* <TwitterIcon size={iconSize} round /> */}
              <XIcon size={iconSize} round />
            </TwitterShareButton>
          </li>
          <li
            onClick={(e) => shareArticle('email')}
            className="nav-item pr-3 pb-2 cstm-tooltip email"
            data-tooltip-position="left"
            data-tooltip="Email"
          >
            <EmailShareButton
              url={` - ${copyLink}`}
              subject={emailSub}
              body={`${emailText}`}
            >
              <EmailIcon size={iconSize} round />
            </EmailShareButton>
          </li>
          <li
            className="nav-item pr-0 pb-2 cstm-tooltip copy"
            data-tooltip-position="left"
            data-tooltip="Copy"
          >
            <button
              id="copy"
              onClick={copyHref}
              className="rounded-circle d-flex align-items-center justify-content-center border-0"
              style={{ width: iconSize, height: iconSize, background: PURPLE }}
            >
              <img
                width={width < 768 ? 20 : 12}
                src="https://cdn.workmob.com/stories_workmob/images/common/link.svg"
              />
              <input type="text" ref={hiddenInputRef} hidden />
            </button>
          </li>
          {embedLink && (
            <li
              className="cstm-tooltip detailPageEmbed"
              data-tooltip-position="left"
              data-tooltip="Embed"
            >
              <button
                onClick={() => setShowEmbedPopup(true)}
                className="rounded-circle border-0 d-flex align-items-center justify-content-center"
                style={{ width: iconSize, height: iconSize, background: '#5b5a5a' }}
              >
                <svg viewBox="0 0 576 512" fill="white">
                  <path d="M186.8 68.16C180.3 62.25 170.1 62.66 164.2 69.25l-159.1 176c-5.547 6.094-5.547 15.41 0 21.5l159.1 176C167.3 446.3 171.7 448 176 448c3.844 0 7.703-1.375 10.77-4.156c6.531-5.938 7.016-16.06 1.078-22.59L37.63 256l150.2-165.3C193.8 84.22 193.3 74.09 186.8 68.16zM571.8 245.3l-159.1-176c-5.953-6.594-16.06-7-22.61-1.094c-6.531 5.938-7.016 16.06-1.078 22.59L538.4 256l-150.2 165.3c-5.937 6.531-5.453 16.66 1.078 22.59C392.3 446.6 396.2 448 399.1 448c4.344 0 8.687-1.75 11.84-5.25l159.1-176C577.4 260.7 577.4 251.3 571.8 245.3z" />
                </svg>
              </button>
            </li>
          )}
        </ul>
      </div>
      {showEmbedPopup && (
        <div style={styles.embedLinkContainer}>
          <div style={styles.embedLinkPopup}>
            <i
              className="icon-cancel"
              style={styles.iconCancel}
              onClick={() => setShowEmbedPopup(false)}
            ></i>
            <textarea
              ref={embedInputRef}
              readOnly
              defaultValue={`<iframe src="${embedLink}" allowfullscreen frameborder="0" width="775" height="450"></iframe>`}
              style={styles.embedLinkText}
            />
            <button
              style={styles.copyButton}
              onClick={() => copyToClipBoard(embedInputRef.current)}
            >
              COPY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialShare;

const styles = {
  embedLinkContainer: {
    background: 'rgba(0, 0, 0, 0.93)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    zIndex: '11',
    cursor: 'auto',
  },
  embedLinkPopup: {
    width: '375px',
    maxWidth: 'calc(100% - 2em)',
    padding: '1em',
    background: '#1c1c1c',
    borderRadius: '0.8em',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  embedLinkText: {
    font: '1.15em monospace',
    width: '100%',
    height: 'auto',
    padding: '0.5em 1em',
    marginBottom: '1em',
    color: '#dddddd',
    background: '#3f3f3f',
    border: '0',
    borderRadius: '0.5em',
    resize: 'none',
  },
  copyButton: {
    fontWeight: 'bold',
    width: 'max-content',
    padding: '0.5em 1em',
    border: '0',
    borderRadius: '0.5em',
    color: '#dddddd',
    background: '#3f3f3f',
    margin: '0 auto',
  },
  iconCancel: {
    fontSize: '1.8em',
    width: '1em',
    height: '1em',
    padding: '0.6em',
    position: 'absolute',
    top: '0',
    right: '0',
    transform: 'translate(25%, -25%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    background: 'rgb(195, 61, 235)',
    cursor: 'pointer',
  },
};
