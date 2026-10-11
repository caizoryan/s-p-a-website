// Downloads Are.na channel data via the v3 API and writes it to data.js
//
// v3 requires a token for channel reads. Create a personal access token at
// https://are.na/settings/personal-access-tokens and run:
//   ARENA_TOKEN=your_token bun run downloader.js
const host = "https://api.are.na/v3/";

const token = process.env.ARENA_TOKEN;
const headers = token ? { Authorization: `Bearer ${token}` } : {};

// per=100 keeps the old single-page behaviour; position_asc preserves the
// channel's manual order (v3 otherwise defaults to position_desc).
const query = "?per=100&sort=position_asc";

const get = async (path) => {
  const res = await fetch(host + path, { headers });
  if (!res.ok) {
    const hint =
      res.status === 401 ? " — set ARENA_TOKEN to a valid Are.na token" : "";
    throw new Error(`${res.status} ${res.statusText} for ${path}${hint}`);
  }
  return res.json();
};

// v3 splits a channel's metadata and its contents into separate endpoints.
const get_contents = (id) =>
  get(`channels/${id}/contents${query}`).then((res) => res.data);

async function get_channel(channel) {
  const contents = await get_contents(channel.id);
  console.log(channel.title);
  return { ...channel, contents };
}

const main_vertical = (await get_contents("main-page-v")).map(to_v2_block);
const main_horizontal = (await get_contents("main-page-h")).map(to_v2_block);

const projects_fetch = await get_contents("projects-9gn8-7a04c4");
const projects = [];

for (let i = 0; i < projects_fetch.length; i++) {
  projects.push(await get_channel(projects_fetch[i]));
}

const press_fetch = await get_contents("press-x28lxexyowi");
const press = [];

for (let i = 0; i < press_fetch.length; i++) {
  press.push(await get_channel(press_fetch[i]));
}

const data = {
  projects: format_projects(projects),
  press: format_press(press),
  main_vertical,
  main_horizontal,
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

    let completed = p.contents.find((x) => x.title == "completed")?.content
      ?.plain;

    let type = p.contents
      .filter((x) => x.title == "type")
      .map((x) => x.content?.plain);

    let sqft = p.contents.find((x) => x.title == "sqft")?.content?.plain;

    let sub_type = p.contents
      .filter((x) => x.title == "sub_type")
      .map((x) => x.content?.plain);

    let images = p.contents
      .filter((x) => x.type == "Image")
      .map((i) => ({
        title: i.title,
        image: to_v2_image(i),
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
      .filter((x) => x.type == "Image")
      .map((i) => ({
        title: i.title,
        image: to_v2_image(i),
      }));

    return { id, category, images };
  });
}

// -------------------------
// UTILS
//
// The rest of the site still reads the v2 shapes this script used to emit, so
// translate v3 data back into them:
//   - blocks use `type` instead of `class`
//   - text content is a MarkdownContent object ({ markdown, html, plain }) and
//     the site expects the plain string
//   - images expose { small, medium, large, square } with a `src` URL plus the
//     original at `image.src`, while the site reads image.thumb.url,
//     image.display.url, image.large.url, image.original.url and image.square.url
function to_v2_image(block) {
  const img = block.image;
  if (!img) return null;

  return {
    id: block.id,
    filename: img.filename,
    content_type: img.content_type,
    large: { url: img.large?.src },
    original: { url: img.src },
    display: { url: img.medium?.src },
    thumb: { url: img.small?.src },
    square: { url: img.square?.src },
  };
}

function to_v2_block(block) {
  return block.image ? { ...block, image: to_v2_image(block) } : block;
}
