// utils/useWindowSize.js

import React from "react";

export default function useWindowSize() {
  //const isSSR = typeof window !== "undefined";
  const [windowSize, setWindowSize] = React.useState({
    width:  0,
    height: 0,
  });

  function changeWindowSize() {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }

  React.useEffect(() => {
    window.addEventListener("resize", changeWindowSize);
    changeWindowSize()
    return () => {
      window.removeEventListener("resize", changeWindowSize);
    };
  }, []);

  return windowSize;
}