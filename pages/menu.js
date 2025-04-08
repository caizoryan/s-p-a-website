import { menu_items } from "../script.js";
import { page, cur_page } from "../router.js";
import { each, mem } from "../tapri/monke.js";
import { hdom } from "../tapri/hdom/index.js";

/* ===============================
   Menu
   =============================== */
export const Menu = () => {
  let pages = () => menu_items.map((e) => e.text);

  return [
    ".alt-menu",
    [
      ".alt-menu__button-container",
      () => each(pages, (t) => hdom(MenuButton(t)))
    ],
    [
      ".sub-header",
      [".sub-header__label", "Salankar Pashine & Associates"],
      [".sub-header__empty-black"]

    ],
    [".black"]
  ]
};

/* ===============================
   Label
   =============================== */
const MenuButton = (text) => {
  let click = () => page("/" + text.toLowerCase());
  let is_selected = mem(() => {
    console.log("is", cur_page())
    return cur_page() == text
  });

  return ["div", { onclick: click, current: is_selected }, text]
};
