export class ExportGrid {
  // Có bật xuất khẩu?
  Enabled?: string;

  // Có cho phép xuất khẩu dòng đang chọn
  AllowExportSelectedData?: boolean;

  constructor(enabled: string, allowExportSelectedData: boolean) {
    this.Enabled = enabled;
    this.AllowExportSelectedData = allowExportSelectedData;
  }
}
