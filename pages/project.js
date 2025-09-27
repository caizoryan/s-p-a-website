import { mem, each, mounted, sig, eff_on } from "../tapri/monke.js";
import { fade_out,fade_in, fade_in_stagger, fade_out_stagger } from "../utils/transitions.js";
import { easter_egg_click } from "../utils/colorschemes.js";
import { filter_map, filtered_projects, filter_grouped, projects } from "./project/data.js";
import { description_text } from "./project/description.js";
import { refresh, disable_all, clean_project, show_filters } from "./project/utils.js";
import { hdom } from "../tapri/hdom/index.js";
export { filter_map, filtered_projects }

/* ===============================
	 ____            _           _   
	|  _ \ _ __ ___ (_) ___  ___| |_ 
	| |_) | '__/ _ \| |/ _ \/ __| __|
	|  __/| | | (_) | |  __/ (__| |_ 
	|_|   |_|  \___// |\___|\___|\__|
								|__/               
	 =============================== */
const selected = sig(false)
const selectedimage = sig(false)

const delay = (fn, ms = 500) => setTimeout(fn, ms)

let showing = sig("false")
let imagefull = sig("false")

// TODO: This mechanism is ghich pich, create an abstraction for it later
// and maybe I'll find a nice way of generalizable way of doing this...
eff_on(showing, () => {
	if(showing() == "false"){
		delay(() => selected(false))
	}
	else {
		fade_in_stagger('.project-page__img', 1800, 250, 800)
	}
})

const FilterButton = (f) => {
	const toggle = () => {
		let was = f.enabled
		disable_all(f.type);
		f.enabled = !was;
		refresh();
	};

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

const Project = ({ image, title, type, sub_type, images }) => {

	let click = () => {
		selected({ image, title, type, sub_type, images })
		showing("true")
	}

	return hdom([
		".project", { onclick: click },
		[".project__img", ["img", { src: image }]],
		[
			".project__metadata",
			[".project__title", title],
			[".project__type", `[ ${type.join(" & ")} ]`],
			[".project__sub-type", `[ ${sub_type.join(", ")} ]`]
		]
	])
};

const ImageFull = () => {
	let loaded = sig(false)

	eff_on(selectedimage, () => {
		if (selectedimage() == 'false') loaded(false)
		let src = selectedimage()
		let image = new Image()
		image.src = src
		image.onload = () => {
			if (selectedimage() == src) loaded(true)
		}
	})

	return hdom(["div.full.centered",
		["button.close", { onclick: () => imagefull("false") }, "x"],
			// add blinking
		mem(() => selectedimage() == 'false'
				? hdom(['p.loading', 'loading'])
				: hdom(["img.image-full", {src: selectedimage, style: mem(() => `opacity: ${loaded() ? 1 : .1}`)}]))
	])
}

let keylisteners = []
document.addEventListener("keydown", (e) => {
	keylisteners.forEach((fn) => fn(e))
})

const ProjectPage = () => {
	let title = mem(() => selected().title)
	let images = mem(() => selected().images)
	let index = sig(0)
	let active = false
	eff_on(imagefull, () => {
		if (imagefull() == 'false') selectedimage('false')
		if (showfullimage() == "false") {
			active = false
			selectedimage('false')}
	})

	let showfullimage = (i) => () => {
		active=true;
		index(i)
		// TODO: rename this
		imagefull("true")
	}

	eff_on(index, () => {
		if (!images() || index() == -1) return
		let img = window.innerWidth > 800 ? images()[index()].image.original.url : images()[index()].image.display.url
		selectedimage(img)
	})

	keylisteners.push((e) => {
		if (active && e.key == "ArrowLeft") {
			selectedimage('false')
			index() == 0 ? index(images().length - 1) : index(index() - 1)
		}

		if (active && e.key == "ArrowRight"){
			selectedimage('false')
			if (!images()) index(0)
			index() == images().length - 1 ? index(0) : index(index() + 1)
		}
	})

	mounted(() => {
		
			// document.querySelectorAll("img").forEach(function (img) {
			// 		if (img.complete) {return;}
			// 		img.style.visibility = "hidden";        
			// 		let loader = document.createElement("div");
			// 		loader.classList.add("loader");        
			// 		img.before(loader); 

			// 		img.onload = function() {
			// 			loader.remove();
			// 			img.style.visibility = "visible";
			// 		};            
			// });
	})

	return hdom(["div.full",
		[".project-page__img-container",
			[".project__title", title],
			[".empty", ""],
			[".empty", ""],
			() => each(images, (src, i) =>
				hdom(["img.project-page__img",
							{ src: src.image.display.url, onclick: showfullimage(i)}
						 ]))],

		["button.close", { onclick: () => {
			index(-1);
			fade_out_stagger('.project-page__img', 500, 50)
			setTimeout(() => showing("false") ,500)
		} }, "x"],
		[".project-page", { activated: imagefull }, ImageFull],
	])
}

export const Projects = (p) => {
	mounted(() =>
		{
			// document.querySelectorAll("img").forEach(function (img) {
			// 		if (img.complete) {return;}
			// 		img.style.visibility = "hidden";        
			// 		let loader = document.createElement("div");
			// 		loader.classList.add("loader");        
			// 		img.before(loader); 

			// 		img.onload = function() {
			// 			loader.remove();
			// 			loader.style.display = "none"
			// 			img.style.visibility = "visible";
			// 		};            
			// });
			fade_in(".projects", 400)
			fade_in_stagger(".project", 600, 250)
		}
	);
	projects(p.map(clean_project));

	return hdom([
		"div", FilterBox,
		[".projects__showing",
			[".empty-div"],
			[".projects__showing-text", description_text]],
		[".projects", () => each(filtered_projects, Project)],
		[".project-page", { activated: showing }, ProjectPage],
	]);
};


