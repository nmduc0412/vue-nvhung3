import axios from "axios";
import type { ServiceResponse } from "../models/service-response";
import interceptors from "./interceptor";

/**
 * Class xử lý gọi api sử dụng thư viện axios
 */
export default class HttpClient {
  private static instance: HttpClient;

  private constructor() {
    this.interceptor();
  }
  public static getInstance() {
    if (!this.instance) {
      this.instance = new HttpClient();
    }
    return this.instance;
  }

  interceptor() {
    interceptors();
  }

  /**
   * Gọi api sử dụng phương thức `get`
   * @param url đường dẫn gọi api
   */
  get<T>(url: string, config: any = null) {
    return axios.get(url, config) as Promise<ServiceResponse<T>>;
  }

  /**
   * Gọi api sử dụng phương thức `post`
   * @param url đường dẫn gọi api
   * @param data dữ liệu truyền lên
   * @returns
   */
  post<T>(url: string, data: any = null, config: any = null) {
    return axios.post(url, data, config) as Promise<ServiceResponse<T>>;
  }

  /**
   * Gọi api sử dụng phương thức `update`
   * @param url đường dẫn gọi api
   * @param data dữ liệu truyền lên
   * @returns
   */
  put<T>(url: string, data: any = null, config: any = null) {
    return axios.put(url, data, config) as Promise<ServiceResponse<T>>;
  }

  /**
   * Gọi api sử dụng phương thức `delete`
   * @param url đường dẫn gọi api
   * @param config dữ liệu truyền lên
   * @returns
   */
  delete<T>(url: string, config: any = null) {
    return axios.delete(url, config) as Promise<ServiceResponse<T>>;
  }
}
