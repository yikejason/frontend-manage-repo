import dayjs from 'dayjs';

export const setLocalStorage = (key: string, data: string | object) => {
  if (data === null) return;
  if (typeof data === 'object') {
    window.localStorage.setItem(key, JSON.stringify(data));
  } else {
    window.localStorage.setItem(key, data);
  }
};

export const getLocalStorage = (key: string) => {
  return window.localStorage.getItem(key);
};

export const clearLocalstorage = (key: string) => {
  window.localStorage.removeItem(key);
};

export const formatData = (data?: any, time?: boolean) => {
  if (data) {
    return time
      ? dayjs(data).format('YYYY-MM-DD HH:mm:ss')
      : dayjs(data).format('YYYY-MM-DD');
  } else {
    return undefined;
  }
};
