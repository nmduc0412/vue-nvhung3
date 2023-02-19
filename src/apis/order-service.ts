import BaseAutoLikeService from "./base/base-autolike-service";

class OrderService extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "order";
  }

  /**
   * API lấy danh sách order
   * @returns
   */
  public async getPaging(config: any) {
    // const url = `${this.baseUrl}/${this.prefixApi}/orders?application=${param.Application}&status=${param.Status}&skipCount=${param.SkipCount}&maxResultCount=${param.MaxResultCount}`;
    const url = `${this.baseUrl}/${this.prefixApi}/orders`;
    return await this.http.get<any>(url, config);
  }

  /**
   * API đặt hàng
   * @returns
   */
  public async order(param: any, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}`;
    return await this.http.post<any>(url, param, config);
  }

  /**
   * API hủy đơn hàng
   * @returns
   */
  public async cancelOrder(id: string, data: any = null, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}/${id}/cancel`;
    return await this.http.post<any>(url, data, config);
  }
}

export default new OrderService();
