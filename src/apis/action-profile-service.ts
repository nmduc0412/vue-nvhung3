import BaseAutoLikeService from "./base/base-autolike-service";

class ActionProfileService extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "Action";
    // this.initAPI();
  }

  /**
   * API lấy danh sách hành động
   * @returns
   */
  public async getActionClone(param: any) {
    if (!param) {
      return null;
    }
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}/all?skipCount=${param["SkipCount"]}&maxResultCount=${param["MaxResultCount"]}`;
    return await this.http.get<any>(url);
  }

  /**
   * API lấy danh sách hành động
   * @returns
   */
  public async deleteActionClone(id: any) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}/delete?action_profile_id=${id}`;
    return await this.http.post<any>(url, {});
  }

  /**
   * API thêm mới hành động
   * @returns
   */
  public async createClone(param: any) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}`;
    return await this.http.post<any>(url, param);
  }
}

export default new ActionProfileService();
