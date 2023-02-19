import BaseService from "@/base/apis/base-service";

export default class BaseAutoLikeService extends BaseService {
  constructor() {
    super();
    this.prefixApi = "";
    this.controllerName = "";
    this.baseUrl = window?.config?.API_URL ? window?.config?.API_URL : "";
    this.initAPI();
    console.log(this.baseUrl);
  }
}
