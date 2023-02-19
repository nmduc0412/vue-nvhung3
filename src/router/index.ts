import { createRouter, createWebHistory } from "vue-router";
import Root from "../views/Root.vue";
import { PathURL } from "@/commons/constants/path";
import { RouterName } from "@/commons/constants/router-name";
import { ThemeConfig } from "@/commons/constants/theme-config.js";
import { LocalStorageKey } from "@/commons/constants/localstorage-key";
import { getLocalStorage } from "@/base/functions/localStorageFns";

let listFileLoaded: any[] = [];
let themeName = getLocalStorage(LocalStorageKey.AutoLike_Theme) || "Default";

/**
 * Lấy tên file được load theo theme
 * @param routeName
 * @param themeName
 * @param isLoaded
 * @returns
 */
function getFileName(routeName: string, themeName: string, isLoaded = true) {
  const themeConfig = JSON.parse(JSON.stringify(ThemeConfig));

  //Nếu tốn tại theme theo user thì lấy - ngược lại gán mặc định

  if (!themeName || themeName == "") {
    themeName = themeConfig[0].ThemeName;
  }

  const configTheme = themeConfig.find(
    (item: any) =>
      item.ThemeName.toLocaleLowerCase() === themeName.toLocaleLowerCase()
  );
  let fileName = "";
  if (configTheme) {
    const routes = configTheme.Routers;
    if (routes && routes.length > 0) {
      const route = routes.find((item: any) => item.RouteName === routeName);
      if (route) {
        fileName = route.FileName;
      }
    }
  }
  if (isLoaded) {
    listFileLoaded.push(fileName);
  }
  return fileName;
}

/**
 * Lazyload component trong thư mục layout
 * @param routeName
 * @returns
 */
function lazyLoadLayout(routeName: string) {
  const fileName = getFileName(routeName, themeName);
  if (
    routeName == RouterName.Facebook ||
    routeName == RouterName.Tiktok ||
    routeName == RouterName.Instagram ||
    routeName == RouterName.Lazada ||
    routeName == RouterName.Youtube ||
    routeName == RouterName.Shopee ||
    routeName == RouterName.AutoFarmer
  ) {
    return () => import(`@/layouts/ServicePackage/${fileName}.vue`);
  }
  return () => import(`@/layouts/${routeName}/${fileName}.vue`);
}

/**
 * Lazyload component trong thư mục views
 * @param layout
 * @returns
 */
function lazyLoadView(view: string) {
  return () => import(`@/views/${view}.vue`);
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: RouterName.Root,
      component: Root,
      children: [
        {
          path: "/",
          name: RouterName.Management,
          component: lazyLoadLayout(RouterName.Management),
          redirect: PathURL.Dashboard,
          children: [
            {
              path: PathURL.Dashboard,
              name: RouterName.Dashboard,
              component: lazyLoadLayout(RouterName.Dashboard),
            },
            {
              path: PathURL.Transaction,
              name: RouterName.Transaction,
              component: lazyLoadLayout(RouterName.Transaction),
            },
            {
              path: PathURL.ServicePackage,
              name: RouterName.ServicePackage,
              component: lazyLoadLayout(RouterName.ServicePackage),
            },
            {
              path: PathURL.Profile,
              name: RouterName.Profile,
              component: lazyLoadLayout(RouterName.Profile),
            },
            {
              path: PathURL.Facebook,
              name: RouterName.Facebook,
              component: lazyLoadLayout(RouterName.Facebook),
            },
            {
              path: PathURL.Tiktok,
              name: RouterName.Tiktok,
              component: lazyLoadLayout(RouterName.Tiktok),
            },
            {
              path: PathURL.Instagram,
              name: RouterName.Instagram,
              component: lazyLoadLayout(RouterName.Instagram),
            },
            {
              path: PathURL.Lazada,
              name: RouterName.Lazada,
              component: lazyLoadLayout(RouterName.Lazada),
            },
            {
              path: PathURL.Youtube,
              name: RouterName.Youtube,
              component: lazyLoadLayout(RouterName.Youtube),
            },
            {
              path: PathURL.Shopee,
              name: RouterName.Shopee,
              component: lazyLoadLayout(RouterName.Shopee),
            },
            {
              path: PathURL.AutoFarmer,
              name: RouterName.AutoFarmer,
              component: lazyLoadLayout(RouterName.AutoFarmer),
            },
            {
              path: PathURL.Comments,
              name: RouterName.Comments,
              component: lazyLoadLayout(RouterName.Comments),
            },
            {
              path: PathURL.Agency,
              name: RouterName.Agency,
              component: lazyLoadLayout(RouterName.Agency),
            },
            {
              path: PathURL.Orders,
              name: RouterName.Orders,
              component: lazyLoadLayout(RouterName.Orders),
            },
            {
              path: PathURL.Giftcode,
              name: RouterName.Giftcode,
              component: lazyLoadLayout(RouterName.Giftcode),
            },
            {
              path: PathURL.Download,
              name: RouterName.Download,
              component: lazyLoadLayout(RouterName.Download),
            },
            {
              path: PathURL.DocumentAPI,
              name: RouterName.DocumentAPI,
              component: lazyLoadLayout(RouterName.DocumentAPI),
            },
          ],
        },
      ],
    },
    {
      path: PathURL.Login,
      name: RouterName.Login,
      component: lazyLoadView(RouterName.Login),
    },
    {
      path: PathURL.Logout,
      name: RouterName.Logout,
      component: lazyLoadView(RouterName.Logout),
    },
    {
      path: PathURL.NotFound,
      name: RouterName.NotFound,
      component: lazyLoadView(RouterName.NotFound),
    },
    {
      path: PathURL.Forbidden,
      name: RouterName.Forbidden,
      component: lazyLoadView(RouterName.Forbidden),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const currentTheme = getLocalStorage(LocalStorageKey.AutoLike_Theme);
  var fileName = getFileName(to?.name, currentTheme, false);

  // Đăng nhập
  if (!listFileLoaded.includes(fileName) && from.path == "/login") {
    location.href = location.origin + "/dashboard";
  } else if (
    !listFileLoaded.includes(fileName) &&
    to.path !== "/login" &&
    to.path !== "/logout"
  ) {
    location.reload();
  } else {
    next();
  }
});

export default router;
