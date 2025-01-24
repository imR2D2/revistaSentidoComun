import { getVars } from "@utils/global";
import { MENUS_PRIVILEGES } from "@data/constants";

export const getValidToken = () => {
  return getVars("token", "") ?? false;
};

const getAllAccessMenus = () => {
  return getVars("menus").flatMap((item) => {
    const menuAndSubmenus = [item];
    if (item.submenus.length > 0) menuAndSubmenus.push(...item.submenus);

    return menuAndSubmenus.map((menu) => {
      delete menu.submenus;
      return menu;
    });
  });
};

export const checkMenuAccess = () => {
  if (!getValidToken()) return false;
  if (!getVars("menus")) return false;

  const pathname = window.location.pathname;
  const found = getAllAccessMenus().find((item) => item.route === pathname);
  if (!found) return false;
  return found.permissions.read === 1;
};

export const checkMenuAction = (action) => {
  if (!getValidToken()) return false;
  if (!getVars("menus")) return false;
  if (!MENUS_PRIVILEGES.includes(action)) return false;

  const pathname = window.location.pathname;
  const found = getAllAccessMenus().find((item) => item.route === pathname);
  if (!found) return false;
  return found.permissions[action] === 1;
};

export const checkMenuActionId = (action, id) => {
  if (!getValidToken()) return false;
  if (!getVars("menus")) return false;
  if (!MENUS_PRIVILEGES.includes(action)) return false;

  const pathname = id ?? window.location.pathname;
  const found = getAllAccessMenus().find((item) => (id ? item.id === id : item.route === pathname));
  if (!found) return false;
  return found.permissions[action] === 1;
};
