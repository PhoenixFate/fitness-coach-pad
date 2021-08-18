// import Vue from "vue"
import axios from 'axios';
import store from '../store';
import errorCode from '../const/error/errorCode';
import { Notify } from 'vant';
import router from '../router';

axios.defaults.baseURL = process.env.API;

axios.defaults.validateStatus = function(status) {
  return status >= 200 && status <= 500; // 默认的
};

// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true;

// HTTPrequest拦截
axios.interceptors.request.use(
  config => {
    let isToken = (config.headers || {}).isToken;
    //
    // let token = store.getters.access_token
    let token = localStorage.getItem('token');
    if (isToken === false) {
    } else {
      config.headers['token'] = token; // token
    }
    console.log('request config', config);
    return config;
  },
  error => {
    console.log('request error:', error);
    return Promise.reject(error);
  }
);

// HttpResponse拦截
axios.interceptors.response.use(
  res => {
    console.log('response', res);
    const status = Number(res.status) || 200;
    const message = res.data.msg || errorCode[status] || errorCode['default'];

    if (status === 401) {
      //未授权
      Notify({
        message: errorCode[401],
        background: '#ff4444'
      });
      // store.dispatch('FedLogOut').then(() => {
      //   router.push({name: 'login'})
      // })
      router.push('/login');
    }

    if (status !== 200 && status !== 201 && status !== 204) {
      Notify({
        message: message,
        background: '#ff4444'
      });
      // return Promise.reject(new Error(message))
      return Promise.reject(res);
    }
    return res;
  },
  error => {
    console.log('error in response', error);
    return Promise.reject(new Error(error));
  }
);

export default axios;
