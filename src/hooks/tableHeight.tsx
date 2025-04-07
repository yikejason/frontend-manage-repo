import { useEffect, useState } from 'react';
const useTableHeight = () => {
  const [height, setHeight] = useState(document.body.clientHeight - 255);
  useEffect(() => {
    window.addEventListener('resize', setHeightFn);
    return () => {
      window.removeEventListener('resize', setHeightFn);
    };
  }, []);
  const setHeightFn = () => {
    setHeight(document.body.clientHeight - 255);
  };
  return height;
};
export default useTableHeight;
