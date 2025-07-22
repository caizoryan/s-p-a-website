let force = "&force=true";
let host = "http://localhost:3000/api/";
// let host = "https://api.are.na/v2/";

let main_vertical = await fetch(host + "channels/main-page-v?per=100" + force)
  .then((res) => res.json())
  .then((res) => res.contents);

let main_horizontal = await fetch(host + "channels/main-page-h?per=100" + force)
  .then((res) => res.json())
  .then((res) => res.contents);

let projects_fetch = await fetch(host + "channels/projects-9gn8-7a04c4?per=100" + force)
  .then((res) => res.json())
  .then((res) => res.contents);

console.log(projects_fetch.title);
let projects = [];

for (let i = 0; i < projects_fetch.length; i++) {
  await get_channel(projects_fetch[i].id).then((res) => {
    console.log(res.title);
    projects.push(res);
  });
}

let press_fetch = await fetch(host + "channels/press-x28lxexyowi?per=100")
  .then((res) => res.json())
  .then((res) => res.contents);
console.log(press_fetch.title);

let press = [];

for (let i = 0; i < press_fetch.length; i++) {
  await get_channel(press_fetch[i].id).then((res) => {
    console.log(res.title);
    press.push(res);
  });
}

const data = {
  projects: format_projects(projects),
  press: format_press(press),
	main_vertical,
	main_horizontal
};

//
await Bun.write(
  "data.js",
  "export const data = " + JSON.stringify(data, null, 2) + ";",
);
//

function format_projects(projects) {
  let p = projects.map((p) => {
    let title = p.title;
    let id = p.id;

    let completed = p.contents.find((x) => x.title == "completed")?.content;

    let type = p.contents
      .filter((x) => x.title == "type")
      .map((x) => x.content);

    let sqft = p.contents.find((x) => x.title == "sqft")?.content;

    let sub_type = p.contents
      .filter((x) => x.title == "sub_type")
      ?.map((x) => x.content);

    let images = p.contents
      .filter((x) => x.class == "Image")
      .map((i) => ({
        title: i.title,
        image: i.image,
      }));

    return { title, type, id, images, sub_type, completed, sqft };
  });

  return p;
}

function format_press(press) {
  return press.map((p) => {
    let category = p.title;
    let id = p.id;

    let images = p.contents
      .filter((x) => x.class == "Image")
      .map((i) => ({
        title: i.title,
        image: i.image,
      }));

    return { id, category, images };
  });
}

// -------------------------
// UTILS
async function get_channel(id) {
  let project = await fetch(host + "channels/" + id + "?per=100").then((res) => res.json());

  console.log(project.title);
  return project;
}
