import { useEffect, useState, useRef } from 'react';

const useReadReceipts = (options) => {
  const containerRef = useRef(null);
  const [isReaded, setIsReaded] = useState(false);
  console.log('isReaded', isReaded);

  const callbackFunction = (entries) => {
    console.log('callbackFunction', entries);
    const [entry] = entries;
    setIsReaded(entry.isIntersecting);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options);
    console.log('observer', observer);
    if (containerRef.current) {
      console.log('containerRef.current', containerRef.current);
      observer.unobserve(containerRef.current);
    }
  }, [containerRef, isReaded]);

  return [containerRef, isReaded];
};

export default useReadReceipts;
