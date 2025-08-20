import { mounted } from "../tapri/monke.js";
import { hdom } from "../tapri/hdom/index.js";
import { fade_in } from "../utils/transitions.js";
import { data } from "./about/data.js";

export let About = () => {
	mounted(() => {
		fade_in(".column", 800)
		fade_in(".main", 500)
		fade_in(".consultants", 400)
		fade_in(".description", 300)
	});

	let description = "Salankar Pashine & Associates, based in Nagpur, specialises in offering architectural and interior design services across a diverse range of projects, including residential, mixed-use, educational, medical, commercial, and industrial ventures. Established in 1999 and led by Principal Architects Anurag and Pallavi Pashine";

	let consultant = n => [
		".consultant",
		[".img-container", ["img", { src: "./people/" + n.filename }]],
		["p.name", n.people],
		["p.bottom", n.name]
	]

	return hdom([
		".about",
		[".description",
			["div"],
			[".text", description]
		],
		[".team",
			[".main",
				["h1", "Principal Architects"],
				["img", { src: "./people/anurag_pallavi.png" }],
				[".about__subhead", "Anurag & Pallavi Pashine"]
			],

			["div",
				[".about__subhead", "Anurag"],
				...data.anurag.split("\n").map((e) => ["p", e]),

				[".about__subhead", "Pallavi"],
				...data.pallavi.split("\n").map((e) => ["p", e]),
			]],

		[".column",
			[".consultants",
				["h1", "Consultants"],
				[".consultants-container",
					data.consultants.map(consultant)]
			],

			// ["div",
			//   [".about__subhead", "Contact"],
			//   data.contact.map(c => ["p", c])
			// ],
			// ["div",
			//   [".about__subhead", "Communications"],
			//   data.communications.map(c => ["p", ["a", { href: c.href }, c.name]])
			// ]
		],
		[".column",
			["div",
				["h1", "Clients"],
				// data.clients.map(c => ["p", c])
			 data.logos.map(c => ["img.logo", {src: "./logos/" + c + ".png"}])
			]
		]


	])

};
