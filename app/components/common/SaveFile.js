import React, { useEffect, useState } from 'react'

export const SaveList = ({list}) => {
  // set up local state for generating the download link
  const [downloadLink, setDownloadLink] = useState('')

  // function for generating file and set download link
  const makeTextFile = () => {
    // This creates the file. 
    // In my case, I have an array, and each item in 
    // the array should be on a new line, which is why
    // I use .join('\n') here.
    const x = {
        "applinks": {
          "apps": [],
          "details": [
            {
              "appID": "KLSX4BW5VE.com.workmob",
              "paths": [ "*" ]
            }
          ]
        }
      }
    const data = new Blob([JSON.stringify(x)], { type: 'text/json' })

    // this part avoids memory leaks
    if (downloadLink !== '') window.URL.revokeObjectURL(downloadLink)

    // update the download link state
    setDownloadLink(window.URL.createObjectURL(data))
    document.getElementById('a').href = window.URL.createObjectURL(data)
    document.getElementById('a').click()
  }

  // Call the function if list changes
  useEffect(() => {
    makeTextFile()
  }, [list])

  return (
    <a

        id="a"
        style={{opacity:0}}
      // this attribute sets the filename
      download='apple-app-site-association'
      // link to the download URL
      href={downloadLink}
    >
      download
    </a>
  )
}

export default {
    component: SaveList
};