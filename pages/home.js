import { mem, mounted, sig } from "../tapri/monke.js";
import { hdom } from "../tapri/hdom/index.js";
import { data } from "../data/data.js";
import { page } from "../router.js";
import { fade_in } from "../utils/transitions.js";

window.addEventListener("resize", () => width(window.innerWidth))
const width = sig(window.innerWidth);

const loaded = sig(false)
const found = mem(() => width() > 800
									? data.main_horizontal.map((e) => e.image)
									: data.main_vertical.map((e) => e.image))

let random_index = () => Math.floor(Math.random() * data.projects.length);
let alt_img = mem(() => data.projects[random_index()].images[0].image.original.url);

// turn the above into an array of objects with name and link
let categories = [
  { name: "Architecture", link: "f=architecture" },
  { name: "Interior Design", link: "f=interior" },
  { name: "Residential", link: "f=residential" },
  { name: "Commercial", link: "f=commercial" },
  { name: "Hospitality", link: "f=hospitality" },
  { name: "Hospital", link: "f=hospital" },
  { name: "Office", link: "f=office" }
]

const Category = ({ name, link }) => {
  let click = () => {
    page("/work?" + link)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  };;
  return [".home__category", { onclick: click }, name]
}

export const Home = () => {
  mounted(() => {
			fade_in(".home__work", 1000)
			fade_in(".home__landing", 1600)
			fade_in(".home__shadow", 1800)

			document.querySelectorAll("img").forEach(function (img) {
					if (img.complete) {return;}
					img.style.visibility = "hidden";        
					let loader = document.createElement("div");
					loader.classList.add("loader");        
					img.before(loader); 

					img.onload = function() {
							loader.remove();
							img.style.visibility = "visible";
					};            
			});
	});

	// translates...
	let images = mem(() => [...found().map(e => e.original.url)])
	let offset = sig(0)

	setInterval(() => {
		if(offset() == (found().length - 1) * -100) offset(0)
		else offset(offset() - 100)
	}, 5000)

	let style = () => `
		transition: ${offset() == 0 ? 0 : 1200}ms ease-in-out;
		transform: translateX(${offset()}vw); 
	`

  return hdom([".home",
    [".home__landing",
		 [".home__slider", {style: mem(style)},
				...images().map((img, i) => ["img", {src: img }],)
			],
      [".home__shadow"]],
    [".home__work",
      [".home__subtitle", "Featured Projects"],
      [".home__categories", categories.map(Category)]
    ]

  ])
}
