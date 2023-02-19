import BaseAutoLikeService from "./base/base-autolike-service";
import type { Transaction } from "@/commons/models/transaction";
class TransactionsService extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "promotions";
    this.initAPI();
  }

  /**
   * API lấy danh sách tất cả khuyến mãi
   * @returns
   */
  public async getAllPromotion(config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}`;
    return await this.http.get<{}>(url, config);
  }
}

export default new TransactionsService();
