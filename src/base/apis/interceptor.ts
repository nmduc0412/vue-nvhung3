import axios from "axios";
import { LocalStorageKey } from "../shared/constants/localstorage-key.js";
import router from "@/router";
import { getLocalStorage } from "../functions/localStorageFns.js";

/**
 * Lấy token từ localstorage
 * @returns
 */
function getToken() {
  return getLocalStorage(LocalStorageKey.Token);
}

/**
 * Áp dụng interceptors cho axios
 * Dùng để bắt request và response của api
 */
function interceptors() {
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      if (!config) return;

      // Lấy dữ liệu của headers
      // Thêm token vào headers
      let headers = config.headers || {};
      let token = getToken();
      if (token) {
        headers["Authorization"] = token;
      }

      // ContentType
      headers["Content-Type"] = ApplicationJson;
      headers["Response-Type"] = "json";
      headers["Access-Control-Allow-Origin"] = "*";
      // headers["Connection"] = "keep-alive";
      // headers["Accept-Encoding"] = "gzip, deflate, br";

      config.headers = headers;

      return config;
    },
    function error(error: any) {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      // Xử lý token hết hạn
      if (response?.status == 401) {
        router.push("/login");
        return Promise.resolve(response);
      } else if (response?.status == 403) {
        location.href = "/403";
      } else if (response?.status == 404) {
        return Promise.reject(response);
      } else {
        const data = response.data;
        return Promise.resolve(data);
      }
      return response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      const response = error?.response;
      if (response.status == 401) {
        router.push("/login");
        return Promise.resolve(error);
      } else if (response.status == 403) {
        location.href = "/403";
      } else if (response.status == 404) {
        return Promise.reject(error);
      }
      return Promise.resolve(response.data);
    }
  );
}

export default interceptors;

export const ApplicationJson = "application/json";
export const FormUrlEncode = "application/x-www-form-urlencoded";
export const FormMultiPart = "multipart/form-data";
