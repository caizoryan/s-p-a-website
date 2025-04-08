import { mounted } from "../tapri/monke.js";
import { hdom } from "../tapri/hdom/index.js";
import { fade_in } from "../utils/transitions.js";

const PressBox = (press) => {
  let { title, image } = press;
  title = title.replace(/_/g, " ").split(".")[0];
  //const press_title = (t) => x("div.press__title")(t);
  const press_image = (i) => ["img", { src: i }];
  const press_image_box = (i) => ["div.press__image", press_image(i)];
  const large = (p) => p.large.url;

  mounted(() => fade_in(".press__box"));
  return [".press__box", press_image_box(large(image))]
};

export const Press = (p) => hdom(
  [".press",
    [".press-container",
      p.map(PressBox)
    ]]);
