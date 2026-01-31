// import React, {useEffect, useState} from 'react';
// import { Helmet } from 'react-helmet';

// export default function CustomStyle({ children }) {
//   const [isFirstRender, setIsFirstRender] = useState(true);

//   useEffect(() => {
//     setIsFirstRender(false);
//   }, []);

//   return (
//     <>
//       {/* <Helmet> */}
//         <style>{children}</style>
//       {/* </Helmet> */}
//       {isFirstRender && <style suppressHydrationWarning>{children}</style>}
//     </>
//   );
// }

import React, { useEffect } from 'react';

export default function CustomStyle({ children }) {
  useEffect(() => {
    // Create a <style> element
    const styleElement = document.createElement('style');
    styleElement.textContent = children;

    // Append it to the <head>
    document.head.appendChild(styleElement);

    // Cleanup: Remove the style element when the component unmounts
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [children]); // Re-run if children (styles) change

  // No need to render anything in the JSX, as we're appending to head
  return null;
}
