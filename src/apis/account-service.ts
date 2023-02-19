import BaseAutoLikeService from "./base/base-autolike-service";
import type { RegisterParam } from "@/commons/models/request-param/register-param";

class AccountService extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "account";
    this.initAPI();
  }

  /**
   * API đăng ký tài khoản
   * @returns
   */
  public async registerUser(registerParam: RegisterParam, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}/register`;
    return await this.http.post<RegisterParam>(url, registerParam, config);
  }
}

export default new AccountService();
