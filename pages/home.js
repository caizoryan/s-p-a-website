import { mem, mounted, sig } from "../tapri/monke.js";
import { hdom } from "../tapri/hdom/index.js";
import { data } from "../data/data.js";
import { page } from "../router.js";
import { fade_in } from "../utils/transitions.js";

window.addEventListener("resize", () => width(window.innerWidth))
const width = sig(window.innerWidth);

const found = data.projects.find((e) => e.title.toLowerCase().includes("mukewar"))
const index = mem(() => width() > 800 ? 0 : 1);
const img = mem(() => found.images[index()].image.original.url)

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
	let main_image = new Image()
	main_image.src = img()

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
	let images = mem(() => [img, img])
	let offset = sig(0)

	// setInterval(() => {
	// 	if(offset() == 0) offset(-100)
	// 	else offset(0)
	// }, 4000)

  return hdom([".home",
    [".home__landing",
		 [".home__slider", {style: mem(() =>`transform: translateX(${offset()}vw)`)},
				...images().map((img, i) => ["img", {loading: "lazy", src: img }],)
			],
      [".home__shadow"]],
    [".home__work",
      [".home__subtitle", "Featured Projects"],
      [".home__categories", categories.map(Category)]
    ]

  ])
}
