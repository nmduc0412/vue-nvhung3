import BaseAutoLikeService from "./base/base-autolike-service";

class ServicePackageSV extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "services";
  }

  /**
   * API lấy danh sách gói dịch vụ
   * @returns
   */
  public async getAllService() {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}`;
    return await this.http.get<any>(url);
  }
  /**
   * API lấy danh sách gói dịch vụ theo ứng dụng
   * @returns
   */
  public async getServiceByApp(status: number, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}/${status}`;
    return await this.http.get<any>(url, config);
  }
}

export default new ServicePackageSV();
