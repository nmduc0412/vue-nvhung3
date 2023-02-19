import BaseAutoLikeService from "./base/base-autolike-service";
import type { Transaction } from "@/commons/models/transaction";
class PaymentService extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "";
    this.initAPI();
  }

  /**
   * API lấy danh sách tất cả phương thức thanh toán
   * @returns
   */
  public async getAllPaymentMethod(config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/payment-methods`;
    return await this.http.get<{}>(url, config);
  }

  /**
   * API deposit
   * @returns
   */
  public async paymentDeposit(param: any, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/payment/deposit`;
    return await this.http.post<any>(url, param, config);
  }
}

export default new PaymentService();
