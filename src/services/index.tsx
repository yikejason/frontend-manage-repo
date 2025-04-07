import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { message } from 'antd';
import { history } from '@/routes/history';
import { clearLocalstorage, getLocalStorage } from '@/utils/util';
// let baseURL = 'http://10.6.15.104:8080/';
import pathEnv from '../../env';
let baseURL = pathEnv;
export let ytoken: string | null;
const instance = axios.create({
  baseURL,
  timeout: 180000,
});
const instanceNoMsg = axios.create({
  baseURL,
  timeout: 60000,
});
const requestFn = (config: AxiosRequestConfig) => {
  let data = config.data;
  if (data && data.orders && data.orders[0]) {
    if (!data.orders[0].column) {
      delete config.data.orders;
    }
  }
  let localToken = getLocalStorage('ytoken');
  if (localToken) {
    ytoken = localToken;
  }

  return config as any;
};
instance.interceptors.request.use((config) => requestFn(config));
instanceNoMsg.interceptors.request.use((config) => requestFn(config));

const responseSuccessFn = (res: AxiosResponse, hide?: boolean) => {
  if (res.headers && res.headers['content-disposition']) {
    let title = res.headers['content-disposition']
      .split(';')[1]
      .split('filename=')[1];
    fileName = decodeURIComponent(title);
  } else {
    fileName = '';
  }
  if (
    (res.data && res.data.code === '00000') ||
    res.data instanceof Blob ||
    res.data instanceof ArrayBuffer
  ) {
    return Promise.resolve(res.data);
  } else {
    if (res.data && (res.data.code === '401' || res.data.code === '402')) {
      clearLocalstorage('ytoken');
      clearLocalstorage('userInfo');
      ytoken = null;
      history.replace('/login');
    }
    !hide && message.error(res.data.msg);
    return Promise.reject(res.data);
  }
};
const responseErrorFn = (rej: any) => {
  if (rej.message?.includes('401')) {
    clearLocalstorage('ytoken');
    clearLocalstorage('userInfo');
    ytoken = null;
    history.replace('/login');
  }
  return Promise.reject(rej);
};

let fileName = '';
instance.interceptors.response.use(
  (res) => responseSuccessFn(res),
  (rej) => {
    if (rej.message?.includes('Network Error')) {
      message.error('网络错误');
    }
    if (rej.message?.includes('timeout') || rej.message?.includes('Timeout')) {
      message.error('请求超时');
    }
    responseErrorFn(rej);
  },
);
instanceNoMsg.interceptors.response.use(
  (res) => responseSuccessFn(res, true),
  (rej) => {
    responseErrorFn(rej);
  },
);
interface ApiProps {
  url: string;
  method?: Method;
  data?: any;
  params?: any;
  responseType?: 'blob' | 'json';
  headers?: { 'Content-Type': string };
}
export interface ResponseProps extends AxiosResponse {
  content?: any;
  code: string | number;
  msg?: string;
}
const api = async ({
  url,
  method = 'GET',
  data,
  params,
  responseType = 'json',
  headers = {
    'Content-Type': 'application/json',
  },
}: ApiProps) => {
  const res: ResponseProps = await instance.request({
    url,
    method,
    data,
    params,
    responseType,
    headers,
  });
  return res;
};

// file download
export const downApi = async ({
  url,
  method = 'GET',
  data,
  params,
  responseType = 'blob',
  headers = {
    'Content-Type': 'application/json',
  },
}: ApiProps) => {
  const res: Blob = await instance.request({
    url,
    method,
    data,
    params,
    responseType,
    headers,
  });
  const r = new FileReader();
  r.onload = function () {
    try {
      const resData = JSON.parse(this.result as string);
      if (resData.code !== '00000') {
        message.error(resData.msg);
        return;
      }
    } catch (error) {
      const blob = new Blob([res]);
      var downloadElement = document.createElement('a');
      var href = window.URL.createObjectURL(blob);
      downloadElement.href = href;
      downloadElement.download = fileName || '文件.xls';
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      window.URL.revokeObjectURL(href);
    }
  };
  r.readAsText(res);
};

// img download
export const downImg = async ({
  url,
  method = 'GET',
  data,
  params,
  responseType = 'blob',
  headers = {
    'Content-Type': 'application/json',
  },
}: ApiProps) => {
  const res: Blob = await instance.request({
    url,
    method,
    data,
    params,
    responseType,
    headers,
  });
  const blob = new Blob([res]);
  return window.URL.createObjectURL(blob);
};

// no error for api
export const apiNoMsg = async ({
  url,
  method = 'GET',
  data,
  params,
  responseType = 'json',
  headers = {
    'Content-Type': 'application/json',
  },
}: ApiProps) => {
  const res: ResponseProps = await instanceNoMsg.request({
    url,
    method,
    data,
    params,
    responseType,
    headers,
  });
  return res;
};
export const baseUrl = baseURL;
export default api;
