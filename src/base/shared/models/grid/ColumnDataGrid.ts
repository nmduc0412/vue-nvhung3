import type { ButtonsCellGrid } from "./ButtonsCellGrid";

export class ColumnDataGrid {
  // width colums
  Width = "";

  // Class custome for colums
  CssClass = "";

  // Data type value
  DataType = "";

  // Format cell
  Format = "";

  // Caption colums
  Caption = "";

  // Field display value
  DataField = "";

  // Alignment cell
  Alignment = "";

  Fixed = false;

  FixedPosition = "Left";

  // button or emty
  Type = "";

  CellTemplate = ""; // custom or sting empty

  constructor(
    caption: string,
    dataField: string,
    width = "150px",
    cellTemplate = "",
    alignment = "left",
    fixed = false,
    fixedPosition = "left",
    cssClass = "",
    dataType = "",
    format = "",
  ) {
    this.Width = width;
    this.CssClass = cssClass;
    this.DataType = dataType;
    this.Format = format;
    this.Caption = caption;
    this.DataField = dataField;
    this.Alignment = alignment;
    this.Fixed = fixed;
    this.FixedPosition = fixedPosition;
    this.CellTemplate = cellTemplate;
  }
}
