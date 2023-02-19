/**
 * Response phân trang
 */
export interface PagingResponse {

  // Tổng số bản ghi
  totalCount: number;
  
  // Danh sách dữ liệu
  items: Array<any>;
}
