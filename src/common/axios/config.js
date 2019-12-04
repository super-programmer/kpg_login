/* eslint-disable no-param-reassign */
import axios from "axios";
axios.defaults.baseURL = "https://api.kpg123.com";
axios.defaults.headers.post["Content-Type"] = "application/json";

const Axios = axios.create({
  timeout: 10000,
  responseType: "json",
  withCredentials: true
});

Axios.interceptors.request.use(
  config => {
    if (
      window.localStorage.accessToken &&
      window.localStorage.accessToken != "null" &&
      !config.headers["No-Need-Token"]
    ) {
      const $accessToken = window.localStorage.accessToken;
      config.headers.Authorization = `Bearer ${$accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

Axios.interceptors.response.use(
  res => res.data,
  error => {
    return Promise.reject(error);
  }
);

export default Axios;
