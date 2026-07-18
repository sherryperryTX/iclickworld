// Community/market SEO landing pages. Each entry becomes a static route at
// /communities/[slug] with live MLS counts pulled from Trestle by `name`.
// Counties are limited to Sherry Perry's real service area.

export type Community = {
  slug: string;
  name: string;
  county: string;
  zips: string[];
  intro: string; // unique 2–3 sentence blurb (SEO — no duplicate content)
  nearby: string[]; // slugs
};

export const COMMUNITIES: Community[] = [
  {
    slug: "college-station",
    name: "College Station",
    county: "Brazos",
    zips: ["77840", "77845"],
    intro:
      "Home to Texas A&M University, College Station pairs a fast-growing job market with family neighborhoods, new construction, and strong long-term property values. Buyers here range from first-time owners and A&M families to investors chasing steady rental demand.",
    nearby: ["bryan", "navasota", "caldwell"],
  },
  {
    slug: "bryan",
    name: "Bryan",
    county: "Brazos",
    zips: ["77801", "77802", "77803", "77807", "77808"],
    intro:
      "Bryan blends historic Downtown charm with established neighborhoods and more attainable price points than its sister city. It's a favorite for buyers who want Brazos County access, character homes, and room to grow.",
    nearby: ["college-station", "hearne", "caldwell"],
  },
  {
    slug: "brenham",
    name: "Brenham",
    county: "Washington",
    zips: ["77833", "77834"],
    intro:
      "Known for its rolling countryside, historic square, and small-town quality of life, Brenham draws buyers looking for acreage, weekend places, and primary homes between Houston and Austin. Land and residential inventory both move here.",
    nearby: ["navasota", "caldwell", "college-station"],
  },
  {
    slug: "navasota",
    name: "Navasota",
    county: "Grimes",
    zips: ["77868"],
    intro:
      "Navasota offers a genuine Texas small-town feel with quick access to Bryan–College Station and Houston. Buyers find affordable homesites, acreage, and residential properties across Grimes County.",
    nearby: ["college-station", "brenham", "bryan"],
  },
  {
    slug: "caldwell",
    name: "Caldwell",
    county: "Burleson",
    zips: ["77836"],
    intro:
      "The 'Kolache Capital of Texas,' Caldwell is a Burleson County hub for buyers who want land, rural homes, and an easy commute to the Brazos Valley. Acreage and residential listings are the mainstay here.",
    nearby: ["bryan", "college-station", "brenham"],
  },
  {
    slug: "madisonville",
    name: "Madisonville",
    county: "Madison",
    zips: ["77864"],
    intro:
      "Sitting at the crossroads of I-45, Madisonville is a strategic pick for buyers who want country living within reach of Houston, Bryan–College Station, and Dallas. Ranch land and single-family homes lead the market.",
    nearby: ["bryan", "centerville", "navasota"],
  },
  {
    slug: "hearne",
    name: "Hearne",
    county: "Robertson",
    zips: ["77859"],
    intro:
      "Hearne is an affordable Robertson County option for buyers seeking value, first homes, and investment properties north of Bryan. Its location keeps it convenient to the Brazos Valley and Central Texas.",
    nearby: ["calvert", "franklin", "bryan"],
  },
  {
    slug: "calvert",
    name: "Calvert",
    county: "Robertson",
    zips: ["77837"],
    intro:
      "Historic Calvert is prized for its Victorian architecture, antique district, and small-town character. Buyers here look for character homes, restoration projects, and affordable Robertson County acreage.",
    nearby: ["hearne", "franklin", "bryan"],
  },
  {
    slug: "franklin",
    name: "Franklin",
    county: "Robertson",
    zips: ["77856"],
    intro:
      "Franklin is a quiet Robertson County seat known for its top-rated schools and rural pace, making it a draw for families wanting land and new homes within commuting distance of Bryan–College Station.",
    nearby: ["hearne", "calvert", "bryan"],
  },
  {
    slug: "centerville",
    name: "Centerville",
    county: "Leon",
    zips: ["75833"],
    intro:
      "Centerville offers wide-open Leon County land and a genuine rural lifestyle right off I-45 between Houston and Dallas. It's a strong market for ranch tracts, recreational land, and country homes.",
    nearby: ["madisonville", "buffalo", "bryan"],
  },
  {
    slug: "buffalo",
    name: "Buffalo",
    county: "Leon",
    zips: ["75831"],
    intro:
      "Buffalo is a Leon County community popular for acreage, hunting land, and affordable country homes with easy interstate access. Buyers value the space and the price-per-acre compared to metro Texas.",
    nearby: ["centerville", "madisonville", "bryan"],
  },
];

export function getCommunity(slug: string): Community | undefined {
  return COMMUNITIES.find((c) => c.slug === slug);
}

export function communityBySlug(slug: string) {
  return getCommunity(slug);
}
