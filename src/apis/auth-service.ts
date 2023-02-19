import BaseAutoLikeService from "./base/base-autolike-service";
import type { LoginParam } from "@/commons/models/request-param/login-param";

class AuthService extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "login";
    this.initAPI();
  }

  /**
   * API đăng nhập
   * @returns
   */
  public async login(loginParam: any, config: any = null) {
    const url = `${this.baseUrl}/connect/token`;
    return await this.http.post<any>(url, loginParam, config);
  }

  /**
   * API đăng xuất
   * @returns
   */
  public async logout() {
    const url = `${this.baseUrl}/${this.prefixApi}/logout`;
    return await this.http.post<LoginParam>(url, {});
  }

  /**
   * Cập nhật thông tin user
   * @returns
   */
  public async updateUserInfo(userInfo: any) {
    const url = `${this.baseUrl}/${this.prefixApi}/update-info`;
    return await this.http.post<{}>(url, userInfo);
  }

  /**
   * Cập nhật mật khẩu
   * @returns
   */
  public async changePassword(passwordInfo: any) {
    const url = `${this.baseUrl}/${this.prefixApi}/change-password`;
    return await this.http.post<{}>(url, passwordInfo);
  }

  /**
   * API đăng nhập V2
   * @returns
   */
  public async loginV2(loginParam: LoginParam) {
    const url = `${this.baseUrl}/connect/token`;
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    return await this.http.post<LoginParam>(url, loginParam, config);
  }
}

export default new AuthService();
