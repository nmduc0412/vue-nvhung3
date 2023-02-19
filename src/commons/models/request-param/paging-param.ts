/**
 * interface phân trang
 */
export interface PagingParam {
  // Bỏ qua bao nhiêu bản ghi
  SkipCount: number;
  // Lấy bao nhiêu bản ghi
  MaxResultCount: number;
}

/**
 * class phân trang
 */
export class PagingParam {
  // Bỏ qua bao nhiêu bản ghi
  SkipCount: number;
  // Lấy bao nhiêu bản ghi
  MaxResultCount: number;
  // Khởi tạo
  constructor(skipCount: number = 0, maxResultCount: number = 25) {
    this.SkipCount = skipCount;
    this.MaxResultCount = maxResultCount;
  }
}
