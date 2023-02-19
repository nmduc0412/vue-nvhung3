import { PathURL } from "@/commons/constants/path";
import { RouterName } from "@/commons/constants/router-name";
// Danh sách ứng dụng
export const ListApplication = [
  {
    ID: 0,
    Name: "Facebook",
    Router: RouterName.Facebook,
    Path: PathURL.Facebook,
    Active: true,
  },
  {
    ID: 1,
    Name: "Tiktok",
    Router: RouterName.Tiktok,
    Path: PathURL.Tiktok,
    Active: false,
  },
  {
    ID: 2,
    Name: "Instagram",
    Router: RouterName.Instagram,
    Path: PathURL.Instagram,
    Active: false,
  },
  {
    ID: 3,
    Name: "Shopee",
    Router: RouterName.Shopee,
    Path: PathURL.Shopee,
    Active: false,
  },
  {
    ID: 4,
    Name: "Lazada",
    Router: RouterName.Lazada,
    Path: PathURL.Lazada,
    Active: false,
  },
  {
    ID: 5,
    Name: "Youtube",
    Router: RouterName.Youtube,
    Path: PathURL.Youtube,
    Active: false,
  },
];
