import BaseAutoLikeService from "@/apis/base/base-autolike-service";

class TransactionService extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "payments";
  }

  /**
   * API lấy danh sách giao dịch
   * @returns
   */
  public async getPaging(param: any, config: any = null) {
    if (!param) {
      return null;
    }
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}?SkipCount=${param.SkipCount}&MaxResultCount=${param.MaxResultCount}`;
    return await this.http.get<any>(url, config);
  }
}

export default new TransactionService();
