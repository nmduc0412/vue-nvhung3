import BaseAutoLikeService from "./base/base-autolike-service";

class GiftcodeService extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "gift";
    // this.initAPI();
  }

  /**
   * Apply gift
   * @returns
   */
  public async applyGift(param: any, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}`;
    return await this.http.post<any>(url, param, config);
  }
}

export default new GiftcodeService();
