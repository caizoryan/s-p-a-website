import { mem, each, mounted } from "../tapri/monke.js";
import { fade_in } from "../utils/transitions.js";
import { easter_egg_click } from "../utils/colorschemes.js";
import { filter_map, filtered_projects, filter_grouped, projects } from "./project/data.js";
import { description_text } from "./project/description.js";
import { refresh, disable_all, clean_project, show_filters } from "./project/utils.js";
import { hdom } from "../tapri/hdom/index.js";
export { filter_map, filtered_projects }

/* ===============================
   Project
   =============================== */

const FilterButton = (f) => {
  const toggle = () => { disable_all(f.type); f.enabled = !f.enabled; refresh(); };

  return hdom(
    ["button.filter-button", {
      onclick: toggle,
      active: () => f.enabled
    }, f.name]
  )
};

const FilterBox = () => {
  const show = show_filters();
  const classes = mem(() => "filter-box " + (show() ? "show" : "hide"));

  const Category = ([category, filter]) => hdom([
    "div",
    ["p", category],
    () => each(filter, FilterButton)
  ])

  return hdom(
    [".filters",
      ["button.filter-box-toggle", { onclick: show.toggle }, "filters"],
      ["div", { class: classes },
        ["button.close", { onclick: show.toggle }, "x"],
        () => each(filter_grouped, Category)
      ]
    ])
};

const Project = ({ image, title, type, sub_type }) => {
  let easteregg = easter_egg_click(title);
  return hdom([
    ".project", { onclick: easteregg },
    [".project__img", ["img", { src: image }]],
    [
      ".project__metadata",
      [".project__title", title],
      [".project__type", `[ ${type.join(" & ")} ]`],
      [".project__sub-type", `[ ${sub_type.join(", ")} ]`]
    ]
  ])
};


export const Projects = (p) => {
  mounted(() => fade_in(".projects"));
  projects(p.map(clean_project));

  return hdom([
    "div",
    FilterBox,
    [".projects__showing", [".empty-div"], [".projects__showing-text", description_text]],
    [".projects", () => each(filtered_projects, Project)]
  ]);
};


