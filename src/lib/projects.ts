import lounge from "@/assets/project-lounge.jpg";
import kitchen from "@/assets/project-kitchen.jpg";
import bedroom from "@/assets/project-bedroom.jpg";
import bath from "@/assets/project-bath.jpg";
import dining from "@/assets/project-dining.jpg";
import office from "@/assets/project-office.jpg";

export type Project = {
  slug: string;
  title: string;
  location: string;
  style: string;
  space: string;
  year: string;
  image: string;
  gallery: string[];
  palette: { name: string; hex: string }[];
  materials: string[];
  challenge: string;
  solution: string;
  narrative: string;
};

export const projects: Project[] = [
  {
    slug: "westcliff-residence",
    title: "Westcliff Residence",
    location: "Johannesburg",
    style: "Warm Contemporary",
    space: "Full Home",
    year: "2024",
    image: lounge,
    gallery: [lounge, dining, kitchen, bath],
    palette: [
      { name: "Bone", hex: "#faf8f5" },
      { name: "Travertine", hex: "#e8dcc7" },
      { name: "Clay", hex: "#a78564" },
      { name: "Espresso", hex: "#3b2a1e" },
    ],
    materials: ["Honed travertine", "Bleached oak", "Belgian linen", "Brushed brass"],
    challenge:
      "A young family relocating from Cape Town inherited a cavernous Westcliff home that felt grand but unlived in.",
    solution:
      "We softened the architecture with layered textiles, low-slung custom seating and an entirely new lighting plan that flatters the home from sunrise into the evening.",
    narrative:
      "Every room was reimagined around how the family actually moves through the day — slow mornings in the kitchen, long lunches around an oak refectory table, quiet evenings under sculpted brass.",
  },
  {
    slug: "menlo-park-kitchen",
    title: "Menlo Park Kitchen",
    location: "Pretoria",
    style: "Modern Heritage",
    space: "Kitchen",
    year: "2024",
    image: kitchen,
    gallery: [kitchen, dining, lounge],
    palette: [
      { name: "Cream", hex: "#f5f0e6" },
      { name: "Marble", hex: "#e3dccd" },
      { name: "Brass", hex: "#b08a4a" },
      { name: "Walnut", hex: "#4a342a" },
    ],
    materials: ["Calacatta marble", "Shaker cabinetry", "Unlacquered brass", "Reclaimed oak"],
    challenge: "A heritage Menlo Park home with a kitchen that had been awkwardly extended in the nineties.",
    solution:
      "We restored the original proportions, introduced bespoke cabinetry to ceiling height and anchored the room with a single, monolithic marble island.",
    narrative:
      "The new kitchen reads as if it has always belonged — warm, generous, and quietly luxurious.",
  },
  {
    slug: "saxonwold-suite",
    title: "Saxonwold Primary Suite",
    location: "Johannesburg",
    style: "Quiet Minimalism",
    space: "Bedroom",
    year: "2024",
    image: bedroom,
    gallery: [bedroom, bath, lounge],
    palette: [
      { name: "Linen", hex: "#efe8db" },
      { name: "Mushroom", hex: "#b8a890" },
      { name: "Oak", hex: "#8c6a48" },
      { name: "Ink", hex: "#2a241e" },
    ],
    materials: ["Stonewashed linen", "Solid oak", "Limewash plaster", "Wool boucle"],
    challenge:
      "A primary suite that felt closer to a guest room than a true sanctuary for its owners.",
    solution:
      "A custom oak headboard wall, layered linens in undyed tones and a wardrobe that disappears into the architecture.",
    narrative:
      "The result is a room with almost nothing in it, and everything you need.",
  },
  {
    slug: "hyde-park-bath",
    title: "Hyde Park Bathing Room",
    location: "Johannesburg",
    style: "Sculptural Calm",
    space: "Bathroom",
    year: "2023",
    image: bath,
    gallery: [bath, bedroom, lounge],
    palette: [
      { name: "Sand", hex: "#e8d6bc" },
      { name: "Clay", hex: "#c8a07e" },
      { name: "Brass", hex: "#a87a3a" },
      { name: "Bronze", hex: "#5a3e28" },
    ],
    materials: ["Solid stone bathtub", "Tadelakt walls", "Aged brass tapware", "Travertine floors"],
    challenge: "A cramped en-suite with no natural light and a tired late-90s palette.",
    solution:
      "We carved out a single, generous bathing room — one tub, one shower, one washbasin — and finished every surface in stone and plaster.",
    narrative: "It now feels less like a bathroom and more like a small private hammam.",
  },
  {
    slug: "brooklyn-dining",
    title: "Brooklyn Dining Room",
    location: "Pretoria",
    style: "Considered Classic",
    space: "Dining Room",
    year: "2023",
    image: dining,
    gallery: [dining, lounge, kitchen],
    palette: [
      { name: "Bone", hex: "#f3ecdf" },
      { name: "Taupe", hex: "#a89478" },
      { name: "Oak", hex: "#6e4f34" },
      { name: "Charcoal", hex: "#2c2620" },
    ],
    materials: ["Solid oak table", "Boucle dining chairs", "Linen drapery", "Sculptural pendant"],
    challenge: "Clients who entertain every weekend wanted a dining room that could seat ten without feeling formal.",
    solution:
      "A long oak refectory table, soft boucle chairs and floor-to-ceiling linen drapery soften the formal proportions.",
    narrative: "Long lunches, longer dinners — the room invites both.",
  },
  {
    slug: "rosebank-study",
    title: "Rosebank Study",
    location: "Johannesburg",
    style: "Modernist Library",
    space: "Home Office",
    year: "2023",
    image: office,
    gallery: [office, lounge, dining],
    palette: [
      { name: "Cream", hex: "#f1ead9" },
      { name: "Oak", hex: "#9a7448" },
      { name: "Cognac", hex: "#7a3e22" },
      { name: "Brass", hex: "#a8803a" },
    ],
    materials: ["Floor-to-ceiling oak joinery", "Cognac leather", "Hand-knotted wool rug", "Brass task lighting"],
    challenge: "Two professionals working from home needed a single shared study that didn't feel corporate.",
    solution: "We treated the room as a library — walls of warm oak, a single sculptural desk and rich, tactile leather.",
    narrative: "It reads as a place to think slowly.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
