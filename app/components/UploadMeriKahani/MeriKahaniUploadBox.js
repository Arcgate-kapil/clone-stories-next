/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ORANGE } from '../../constants/colors';
import importScript from './aws/importScript';
import { uploadVideoFile } from '../../actions/blog';
import VideoContainer from './VideoContainer';
import useWindowSize from '../../utils/useWindowSize';
import { sentEmail } from '../../actions/firebase';
import { useSelector } from 'react-redux';

let MeriKahaniUploadBox = props => {
  const { width } = useWindowSize();
  const isHindi = useSelector(state => state.blogs.isHindi);

  importScript('https://sdk.amazonaws.com/js/aws-sdk-2.802.0.min.js');

  const [fileName, setFileName] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [error, setError] = React.useState('');
  const [submitBtn, setSubmitBtnLabel] = React.useState('Submit');

  const resetData = () => {
    setName('');
    setError('');
    setPhone('');
    setFileName('');
    setSubmitBtnLabel('Submit');
  };

  const validPhone = inputtxt => {
    // var phoneno = /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))$/;
    // if(inputtxt.match(phoneno)) {
    //   return true;
    // }
    // else {
    //   return false;
    // }

    var phoneno = inputtxt.replace(/[^\w\s]/gi, '');
    if (phoneno.length >= 7) {
      return true;
    } else {
      return false;
    }
  };

  const _handleChange = e => {
    const file = e.target.files[0];

    if (file) {
      if (
        file.size / 1024 / 1024 > 800 ||
        !file.type.match('video') ||
        file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase() != 'mp4'
      ) {
        const error =
          file.size / 1024 / 1024 > 800
            ? `Please upload a video less than 800MB in file size.`
            : `Please upload your video in MP4 file format.`;

        setError(error);

        removeFile();
      } else {
        setFileName(file.name);
        setError('');
      }
    }
  };

  const removeFile = () => {
    setFileName('');
    document.getElementById('upload-btn').value = '';
  };

  const uploadUserData = (s3Bucket, timeStamp, name, phone, videoName, triedToupload = false) => {
    fetch(`https://s3.ap-south-1.amazonaws.com/yourstories.workmob.com/userdata.json`)
      .then(res => res.json())
      .then(data => {
        const source = getQueryStringValue(window.location.href, 'source') || 'NA';
        const finalArr = data;
        const _data = { name, phone, videoName, timeStamp, source };
        if (!!triedToupload) {
          const _index = finalArr.findIndex(e => JSON.stringify(e) === JSON.stringify(_data));
          if (_index > -1) {
            finalArr.splice(_index, 1);
            const _dataNew = { name, phone, videoName: 'Tried to upload', timeStamp, source };
            finalArr.push(_dataNew);
          }
        } else {
          finalArr.push(_data);
        }
        const filePathFile = 'userdata.json';
        const myFile = new Blob([JSON.stringify(finalArr)], { type: 'application/json' });
        s3Bucket
          .upload(
            {
              Key: filePathFile,
              Body: myFile,
              ACL: 'public-read',
            },
            function (err, data) {
              if (!fileName) {
                resetData();
              }
              if (err) {
                return;
              }
            }
          )
          .on('httpUploadProgress', function (progress) {
            if (!fileName) {
              resetData();
              sentEmailToWM('No');
              alert(' Thank you. We will contact you shortly.');
            }
          });
      });
  };

  const getQueryStringValue = (url, key) => {
    return decodeURIComponent(
      url.replace(
        new RegExp(
          '^(?:.*[&\\?]' +
            encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') +
            '(?:\\=([^&]*))?)?.*$',
          'i'
        ),
        '$1'
      )
    );
  };

  const sentEmailToWM = (videoUploaded = 'No') => {
    const source = getQueryStringValue(window.location.href, 'source') || 'NA';
    if (window.location.hostname != '3.6.75.225' && window.location.hostname != 'localhost') {
      sentEmail(name, phone, source, videoUploaded);
    }
  };

  const handleSubmit = e => {
    setSubmitBtnLabel(`Uploading...`);
    e.preventDefault();
    AWS.config.region = 'ap-south-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'ap-south-1:63117ff3-7736-42cb-9844-d10ad4606e59',
    });
    AWS.config.credentials.get(function (err) {
      if (err) alert(err);
    });
    const s3Bucket = new AWS.S3({ params: { Bucket: 'yourstories.workmob.com' } });

    const timeStamp = new Date().getTime();
    let filePath = '';
    if (!!fileName) {
      filePath = timeStamp + '-' + phone + '.' + fileName.split('.').pop();
    }
    const file = document.getElementById('upload-btn').files[0];

    uploadUserData(s3Bucket, timeStamp, name, phone, filePath);

    if (!!fileName) {
      props.uploadVideoFile(filePath, file, isSuccess => {
        var uploaded = isSuccess;
        setSubmitBtnLabel(`${uploaded}% Uploading...`);
        if (uploaded == 100) {
          removeFile();
          sentEmailToWM('Yes');
          resetData();
        }

        if (isSuccess == -1) {
          removeFile();
          resetData();
          sentEmailToWM('No');
          uploadUserData(s3Bucket, timeStamp, name, phone, filePath, 'Tried to upload');
        }
      });
    }
  };

  const toggleMute = () => {};

  const onTelChange = e => {
    const re = /^[0-9-+.() ]*$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setPhone(e.target.value);
    }
  };

  return (
    <div
      style={{ zIndex: 1 }}
      className='position-relative d-flex  justify-content-around flex-md-row flex-column align-items-center first-page-content'
    >
      <div className='mr-md-3'>
        <div className='bg-white p-3 pt-4 my-2 upload-video-box mx-auto w-100'>
          <h3 className='text-center title'>Tell your story, inspire & build your brand</h3>
          <p className='text-center sub-title'>
            Upload your career & life journey video. Or share your contact details and we will help
            create your video.
          </p>
          <form onSubmit={handleSubmit} action='#'>
            <div className='form-group pt-0'>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                id='name'
                type='text'
                className='form-control border-0 border-bottom-1 pl-0'
                maxLength='100'
                placeholder='Name'
                required
              />
            </div>
            <div className='form-group mb-4'>
              <input
                value={phone}
                onChange={e => onTelChange(e)}
                id='phone'
                className='form-control border-0 border-bottom-1 pl-0'
                name='telphone'
                placeholder='Mobile'
                required
              />
            </div>
            <div className='form-group upload pt-md-4 pt-md-3'>
              <div className='position-relative d-flex align-items-center'>
                <input
                  accept='video/mp4'
                  onChange={_handleChange}
                  type='file'
                  className='form-control-file'
                  id='upload-btn'
                />
                <label
                  className='file-label rounded-circle icon icon-plus mb-0'
                  htmlFor='upload-btn'
                ></label>
                <span className='file-chosen font-alata'>Upload your video</span>
              </div>
              {!!fileName && (
                <div className='position-relative d-flex align-items-center'>
                  <label
                    style={{ opacity: 0 }}
                    className='bg-transparent file-label rounded-circle icon icon-plus mb-0'
                  ></label>
                  <p className='file-chosen font-alata file-name position-relative pr-4 mb-0'>
                    {fileName}
                    <span
                      onClick={removeFile}
                      style={{ top: -5, right: -7, cursor: 'pointer' }}
                      className='position-absolute bg-transparent border-0 px-3 font-bold text-danger'
                    >
                      x
                    </span>
                  </p>
                </div>
              )}
              {!!error && (
                <div className='position-relative d-flex align-items-center'>
                  <label className='bg-transparent file-label rounded-circle icon icon-plus mb-0'></label>
                  <p className='file-chosen font-alata file-name position-relative pr-4 mb-0 d-flex text-danger'>
                    <span className='font-bold text-danger pl-1'>*</span>
                    {error}
                  </p>
                </div>
              )}
              <div className='pb-md-0 d-md-block d-none'>&nbsp;</div>
            </div>
            <div className='text-center'>
              <button
                disabled={!validPhone(phone) || !name || submitBtn != 'Submit'}
                // style={{ background: ORANGE, height: 40, width: 136, borderRadius: 100 }}
                type='submit'
                className='btn btn-primary mx-auto border-0 buttonSubmitKahani'
              >
                {submitBtn}
              </button>
            </div>
          </form>
        </div>
        <SeeRule isHindi={isHindi} />
      </div>
      {width > 767 && <VideoSection isMuted={true} toggleMute={toggleMute} />}
      <div style={{ width: 0, height: 0, opacity: 0, fontSize: 0 }}>
        <h1 style={{ width: 0, height: 0, fontSize: 0 }}>
          Tell your Story, Inspire & Build your Brand | Personal & Business Video Brand Story
        </h1>
        <h2 style={{ width: 0, height: 0, fontSize: 0 }}>
          Help people get to know your life experiences, career journey, and the real story behind
          your products and services. Build trust and love for your brand.
        </h2>
      </div>
    </div>
  );
};

const mapStateToProps = null;

const mapDispatchToProps = {
  uploadVideoFile,
};

MeriKahaniUploadBox = connect(mapStateToProps, mapDispatchToProps)(MeriKahaniUploadBox);

export default MeriKahaniUploadBox;

const SeeRule = ({ isHindi }) => (
  <p className='text-white text-center mt-2'>
    {' '}
    <Link
      style={{ textDecoration: 'underline' }}
      className='text-white'
      to={(isHindi ? '/hindi' : '') + `/create`}
    >
      See
    </Link>{' '}
    how to create your video{' '}
  </p>
);

const VideoSection = ({ toggleMute, isMuted }) => (
  <div className={`aboutPageContainer `}>
    <VideoContainer
      processUrl={false}
      componentFrom='storyPage'
      toggleMute={toggleMute}
      isMuted={isMuted}
      isIntroVidMuted={isMuted}
      autoPlay={true}
      thumbUrl={'https://cdn.workmob.com/stories_workmob/images/stories/thumb/udhav-poddar.jpg'}
      videoUrl={'https://cdn.workmob.com/common_web_app_assets/about/about-first-frame.mp4'}
    />
  </div>
);
