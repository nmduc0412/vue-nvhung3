import BaseAutoLikeService from "./base/base-autolike-service";
import type { Comment } from "@/commons/models/comment";

class CommentService extends BaseAutoLikeService {
  constructor() {
    super();
    this.prefixApi = "api";
    this.controllerName = "comment";
    // this.initAPI();
  }

  /**
   * API thêm comment
   * @returns
   */
  public async create(comment: Comment, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}`;
    return await this.http.post<Comment>(url, comment, config);
  }

  /**
   * Lấy danh sách comment
   * @returns
   */
  public async getPaging(config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/comments`;
    return await this.http.get<any>(url, config);
  }

  /**
   * Update comment
   * @returns
   */
  public async update(id: string, comment: any, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}/${id}`;
    return await this.http.put<Comment>(url, comment, config);
  }

  /**
   * Xoá comment
   * @returns
   */
  public async delete(id: string, config: any = null) {
    const url = `${this.baseUrl}/${this.prefixApi}/${this.controllerName}/${id}`;
    return await this.http.delete<Comment>(url, config);
  }
}

export default new CommentService();
