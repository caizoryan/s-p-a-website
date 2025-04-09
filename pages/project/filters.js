const filter = (arr, fn) => [...arr].filter(fn)

const type = (tag) => (p) => p.type.includes(tag)
const sub_type = (tag) => (p) => p.sub_type.includes(tag)

const architecture = (arr) => filter(arr, type("architecture"))
const interior = (arr) => filter(arr, type("interior"));
const hospital = (arr) => filter(arr, sub_type("hospital"));
const hospitality = (arr) => filter(arr, sub_type("hospitality"));
const residential = (arr) => filter(arr, sub_type("residential"));
const commercial = (arr) => filter(arr, sub_type("commercial"));
const office = (arr) => filter(arr, sub_type("office"));


export let filter_map_data = [
  {
    name: "architecture",
    filter: architecture,
    enabled: false,
    type: "type"
  },

  {
    name: "interior",
    filter: interior,
    type: "type",
    enabled: false
  },

  {
    name: "hospital",
    filter: hospital,
    type: "sub_type",
    enabled: false
  },

  {
    name: "hospitality",
    filter: hospitality,
    type: "sub_type",
    enabled: false,
  },

  {
    name: "residential",
    filter: residential,
    type: "sub_type",
    enabled: false,
  },

  {
    name: "commercial",
    filter: commercial,
    type: "sub_type",
    enabled: false,
  },

  {
    name: "office",
    filter: office,
    type: "sub_type",
    enabled: false,
  }
]

export let sqft = (arr) => [...arr].sort((a, b) => b.sqft - a.sqft);
