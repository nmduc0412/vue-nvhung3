import format from "date-fns/format";

export function formatDate(date: any, stringFormat: string = "dd/MM/yyyy") {
  if (!date) {
    return "";
  }

  return format(new Date(date), stringFormat);
}

export function formatDateTime(
  date: any,
  stringFormat: string = "dd/MM/yyyy HH:mm:ss"
) {
  if (!date) {
    return "";
  }

  return format(new Date(date), stringFormat);
}
