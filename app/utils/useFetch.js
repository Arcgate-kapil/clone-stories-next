import { useEffect, useRef, useState } from 'react';

export function useFetch(url, options = {}) {
  const [jsonData, setJsonData] = useState();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    makeRequest();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  async function makeRequest() {
    const response = await fetch(url, options);
    const data = await response.json();

    if (isMountedRef.current) {
      setJsonData(data);
    }
  }

  return jsonData;
}
