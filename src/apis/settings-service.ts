import type { Settings } from "@/commons/models/settings";
import BaseAutoLikeService from "./base/base-autolike-service";

class SettingsService extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "settings";
    this.initAPI();
  }

  /**
   * Lấy danh sách theme
   * @returns
   */
  public async getAllTheme(config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}/themes`;
    return await this.http.get<any>(url, config);
  }

  /**
   * Update theme
   * @returns
   */
  public async updateTheme(setting: Settings) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}/themes`;
    return await this.http.post<any>(url, setting);
  }
}

export default new SettingsService();
