import {
  render,
  mem,
} from "./tapri/monke.js";
import { page_init, cur_page } from "./router.js";
import { data } from "./data/data.js";
import { Projects } from "./pages/project.js";
import { About } from "./pages/about.js";
import { Press } from "./pages/press.js";
import { Menu } from "./pages/menu.js";
import { Home } from "./pages/home.js";
import { hdom } from "./tapri/hdom/index.js";

page_init();

export let menu_items = [
  { text: "Home", render: () => Home },
  { text: "Work", render: () => Projects(data.projects) },
  { text: "Press", render: () => Press(data.press[0].images) },
  { text: "About", render: About },
];


let CurrentPage = () => mem(() => {
  // check if from menu items page has a renderer based on cur page
  let page = menu_items.find((e) => e.text == cur_page());
  console.log(page)
  return page.render;
});

/* ===============================
   Final Page Put Together
   =============================== */

// let extra = mem(() => cur_page() == "home" ? "padding: 0px 0px;" : "");
let extra = mem(() =>
  cur_page().toLowerCase() === "home"
    ? "padding: 0px 0px;"
    : ""
);

let contacts = [
  "0712 224 0000",
  "archspangp@gmail.com",
];
let communications = [
  { href: "https://www.facebook.com/anuragpallavi", name: "Facebook" },
  {
    href: "https://https://www.instagram.com/salankarpashine_designs",
    name: "Instagram"
  },
];

let footer = () => {
	return [".footer",
					[".footer-section", ...contacts.map((c) => ["p", c])],
					[".footer-section", ...communications.map((c) => ["a", {href: c.href},["p", c.name]])]
				 ]
}

const Mother = () => hdom([
  ".mother",
  { style: extra },
  hdom(Menu()),
  CurrentPage(),
	hdom(footer())
])

render(Mother, document.body);
