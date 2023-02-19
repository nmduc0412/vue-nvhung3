import BaseAutoLikeService from "./base/base-autolike-service";
import type { LoginParam } from "@/commons/models/request-param/login-param";
import type { Settings } from "@/commons/models/settings";

class AuthService extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "Profile";
  }

  /**
   * Lấy thông tin User
   * @returns
   */
  public async getUserInfo(config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}`;
    return await this.http.get<LoginParam>(url, config);
  }

  /**
   * Cập nhật thông tin user
   * @returns
   */
  public async updateUserInfo(userInfo: any, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}`;
    return await this.http.put<any>(url, userInfo, config);
  }

  /**
   * Cập nhật mật khẩu
   * @returns
   */
  public async changePassword(passwordInfo: any, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}/change-password`;
    return await this.http.put<any>(url, passwordInfo, config);
  }
}

export default new AuthService();
