import HttpClient from "./http-client";

export default class BaseService {
  protected http = HttpClient.getInstance(); // Instance để sử dụng axios call api
  protected controllerName = ""; // Tên controler BE
  protected baseUrl = ""; // Đường dẫn api
  protected prefixApi = "";

  constructor() {}

  /**
   * Hàm khởi tạo đường dẫn lấy api
   */
  initAPI() {
    if (!this.baseUrl && window) {
      // this.baseUrl =
      //   (window as any)._apis[this.prefixApi] + "/" + this.controllerName;
    }
  }

  /**
   * Lấy tất cả dữ liệu
   */
  async getAll() {
    const url = `${this.baseUrl}/getAll`;
    return await this.http.get(url);
  }

  /**
   * Lấy dữ liệu theo ID
   */
  async getById(id: number){
    const url = `${this.baseUrl}/getById/${id}`;
  };
}
