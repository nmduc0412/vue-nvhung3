import BaseAutoLikeService from "./base/base-autolike-service";
import type { Agency } from "@/commons/models/agency";

class AgencyService extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "agency";
    this.initAPI();
  }

  /**
   * API đăng ký đại lý
   * @returns
   */
  public async registerAgency(agency: Agency, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}/register`;
    return await this.http.post<Agency>(url, agency, config);
  }

  /**
   * Lấy thông tin đại lý
   * @returns
   */
  public async getAgencyProfile(config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}`;
    return await this.http.get<Agency>(url, config);
  }

  /**
   * Cập nhật thông tin đại lý
   * @returns
   */
  public async updateAgencyProfile(agency: Agency, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}`;
    return await this.http.put<Agency>(url, agency, config);
  }
}

export default new AgencyService();
