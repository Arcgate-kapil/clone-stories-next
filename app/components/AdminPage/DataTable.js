import React from 'react';
import importScript from '../UploadMeriKahani/aws/importScript';

import { timeConverter } from '../../utils';

const DataTable = props => {
  importScript('https://sdk.amazonaws.com/js/aws-sdk-2.802.0.min.js');

  const [data, setData] = React.useState(props.userDataTable);
  const [checked, toggleCheck] = React.useState(false);
  const [open, toggleDeleteModal] = React.useState(false);
  
  //   React.useEffect(() => {
  //   if (Array.isArray(props.userDataTable)) {
  //     setData(props.userDataTable);
  //   } else {
  //     setData([]); // Fallback to empty array if props are invalid
  //   }
  // }, [props.userDataTable]);

  //  const onSort = (event, sortKey) => {
  //   if (sortKey === 'actions') {
  //     return; // No sorting for actions
  //   }
  //   let sortedData;
  //   if (sortKey === 'timeStamp') {
  //     sortedData = [...data].sort((a, b) => (new Date(a[sortKey]) < new Date(b[sortKey]) ? 1 : -1));
  //   } else {
  //     sortedData = [...data].sort((a, b) => (a[sortKey] || '').localeCompare(b[sortKey] || ''));
  //   }
  //   setData(sortedData);
  //   toggleCheck(!checked); 
  // };
  
  const onSort = (event, sortKey) => {
    if (sortKey == 'actions') {
    }

    if (sortKey == 'timeStamp') {
      data.sort((a, b) => (new Date(a[sortKey]) < new Date(b[sortKey]) ? 1 : -1));
    } else {
      data.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
    }
    setData(data);
    toggleCheck(!checked);
  };

  //     const deletEntryFromUserJSON = () => {
  //   fetch(`https://s3.ap-south-1.amazonaws.com/yourstories.workmob.com/userdata.json`)
  //     .then(res => res.json())
  //     .then(fetchedData => {
  //       let finalArr = Array.isArray(fetchedData) ? fetchedData : [];
  //       const _index = finalArr.findIndex(e => JSON.stringify(e) === JSON.stringify(open));
  //       if (_index > -1) {
  //         finalArr.splice(_index, 1);
  //       }
  //       const filePathFile = 'userdata.json';
  //       const myFile = new Blob([JSON.stringify(finalArr)], { type: 'application/json' });
  //       AWS.config.region = 'ap-south-1';
  //       AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  //         IdentityPoolId: 'ap-south-1:63117ff3-7736-42cb-9844-d10ad4606e59',
  //       });
  //       AWS.config.credentials.get(function (err) {
  //         if (err) alert(err);
  //       });
  //       const s3Bucket = new AWS.S3({ params: { Bucket: 'yourstories.workmob.com' } });
  //       setData(finalArr);
  //       toggleDeleteModal(false);
  //       s3Bucket.upload(
  //         {
  //           Key: filePathFile,
  //           Body: myFile,
  //           ACL: 'public-read',
  //         },
  //         function (err, data) {
  //           alert('File Deleted Successfully..!!');
  //           if (err) {
  //             alert('Error in Uploading file..!');
  //             return;
  //           }
  //         }
  //       );
  //     })
  //     .catch(err => {
  //       console.error('Error fetching or deleting data:', err);
  //       alert('Error deleting entry.');
  //     });
  // };

  const deletEntryFromUserJSON = () => {
    fetch(`https://s3.ap-south-1.amazonaws.com/yourstories.workmob.com/userdata.json`)
      .then(res => res.json())
      .then(data => {
        let finalArr = data;
        const _index = finalArr.findIndex(e => JSON.stringify(e) === JSON.stringify(open));
        if (_index > -1) {
          finalArr.splice(_index, 1);
        }

        const filePathFile = 'userdata.json';
        const myFile = new Blob([JSON.stringify(finalArr)], { type: 'application/json' });
        AWS.config.region = 'ap-south-1';
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'ap-south-1:63117ff3-7736-42cb-9844-d10ad4606e59',
        });
        AWS.config.credentials.get(function (err) {
          if (err) alert(err);
        });
        const s3Bucket = new AWS.S3({ params: { Bucket: 'yourstories.workmob.com' } });
        setData(finalArr);
        toggleDeleteModal(false);
        s3Bucket.upload(
          {
            Key: filePathFile,
            Body: myFile,
            ACL: 'public-read',
          },
          function (err, data) {
            alert('File Deleted Successfully..!!');
            if (err) {
              alert('Error in Uploading file..!');
              return;
            }
          }
        );
      });
  };

  //  if (!Array.isArray(data)) {
  //   return <p>Loading or invalid data...</p>; // Or a spinner
  // }

  return (
    <>
      <table className='table table-bordered table-dark table-striped '>
        <thead>
          <tr>
            <th className='cursor-pointer' onClick={e => onSort(e, 'name')}>
              Name
            </th>
            <th className='cursor-pointer' onClick={e => onSort(e, 'phone')}>
              Phone
            </th>
            <th className='cursor-pointer' onClick={e => onSort(e, 'videoName')}>
              Video
            </th>
            <th className='cursor-pointer' onClick={e => onSort(e, 'timeStamp')}>
              Date
            </th>
            <th className='cursor-pointer'>Source</th>
            <th className='cursor-pointer' onClick={e => onSort(e, 'actions')}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6">No data available.</td>
            </tr>
          ) : (
            data.map(function (data, index) {
            return (
              <tr key={index} data-item={data.timeStamp}>
                <td data-title='Name'>{data.name || '-'}</td>
                <td data-title='Phone'>{data.phone || '-'}</td>
                <td data-title='Video'>{data.videoName || '-'}</td>
                <td data-title='Date'>{timeConverter(data.timeStamp) || '-'}</td>
                <td data-title='Source'>{data.source || '-'}</td>
                <td className='bg-white' data-title='Action'>
                  {!!data.videoName && data.videoName != 'Tried to upload' && (
                    <>
                      <a
                        className='text-info d-block mb-2 font-weight-bold'
                        target='_blank'
                        href={`https://s3.ap-south-1.amazonaws.com/yourstories.workmob.com/${data.videoName}`}
                      >
                        View
                      </a>
                      {/* <a href={`https://s3.ap-south-1.amazonaws.com/yourstories.workmob.com/${data.videoName}`} target="_blank" download={data.videoName} className="text-success d-block mb-2 font-weight-bold">Download</a> */}
                    </>
                  )}
                  <a
                    onClick={e => toggleDeleteModal(data)}
                    className='text-danger d-block font-weight-bold'
                    href='javascript:void(0)'
                  >
                    Delete
                  </a>
                </td>
              </tr>
            );
          }))}
        </tbody>
      </table>
      {!!open && (
        <div
          style={{ background: 'rgba(0,0,0,0.8)' }}
          className='modal fade show d-block'
          id='exampleModalCenter'
          tabIndex='-1'
          role='dialog'
          ariaLabelledBy='exampleModalCenterTitle'
          ariaHidden='true'
        >
          <div
            className='modal-dialog modal-dialog-centered justify-content-center animate__animated animate__fadeIn animate__faster'
            role='document'
          >
            <div className='modal-content w-75'>
              <div className='modal-body'>
                <p className='font-20'>Are you sure you want to delete ?</p>
              </div>
              <div className='modal-footer'>
                <div className='btn-danger btn' onClick={deletEntryFromUserJSON}>
                  Yes
                </div>{' '}
                <div className='btn-secondary btn' onClick={e => toggleDeleteModal(false)}>
                  No
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataTable;
