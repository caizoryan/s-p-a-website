import { mounted } from "../tapri/monke.js";
import { hdom } from "../tapri/hdom/index.js";
import { fade_in, fade_in_stagger } from "../utils/transitions.js";

const PressBox = (press) => {
  let { title, image } = press;
  title = title.replace(/_/g, " ").split(".")[0];
  //const press_title = (t) => x("div.press__title")(t);
  const press_image = (i) => ["img", { src: i }];
  const press_image_box = (i) => ["div.press__image", press_image(i)];
  const large = (p) => p.large.url;

  mounted(() => {
		fade_in_stagger(".press__box", 400, 150)
	});
  return [".press__box", press_image_box(large(image))]
};

	let description = "Salankar Pashine & Associates, based in Nagpur, specialises in offering architectural and interior design services across a diverse range of projects, including residential, mixed-use, educational, medical, commercial, and industrial ventures. Established in 1999 and led by Principal Architects Anurag and Pallavi Pashine";

export const Press = (p) => hdom(
  [".press",
		[".description",
			["div"],
			[".text", description]
		],
    [".press-container",

      p.map(PressBox)
    ]]);
