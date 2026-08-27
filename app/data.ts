export type MovieCard = {
  title: string;
  year: number;
  votes: number;
  rating: number;
  posterUrl: string;
};

export type RepresentativeCase = {
  title: string;
  gap: number;
  direction: "official" | "audience";
  officialPhrases: string[];
  audiencePhrases: string[];
};

export type CountryDatum = {
  code: string;
  name: string;
  flag: string;
  flagUrl: string;
  latitude: number;
  longitude: number;
  movies: number;
  reviews: number;
  officialValence: number;
  audienceValence: number;
  adjustedGap: number;
  ci: [number, number];
  keywords: string[];
  cases: RepresentativeCase[];
  topMovies: MovieCard[];
};

/**
 * Resolves public assets relative to the deployed site.  GitHub Pages serves
 * project sites below a repository path, so root-relative URLs would otherwise
 * point to the account homepage instead of this application.
 */
export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export const globalFinding = {
  movies: 209,
  reviews: 4680,
  countries: 6,
  meanGap: 0.0889414042,
  ci: [0.0619380405, 0.1159447679] as [number, number],
  pValue: 6.062509748614264e-10,
  countryWaldP: 0.5592242769,
};

export const countries: CountryDatum[] = [
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    flagUrl: assetUrl("/flags/us.png"),
    latitude: 39.5,
    longitude: -98.35,
    movies: 40,
    reviews: 1288,
    officialValence: -0.129203903,
    audienceValence: 0.117876201,
    adjustedGap: 0.122985445,
    ci: [0.065107112, 0.180863778],
    keywords: ["mysterious stranger", "honeymoon", "freak weather", "war journalist", "mother Ronnie"],
    cases: [
      {
        title: "Safelight",
        gap: -0.292694332,
        direction: "official",
        officialPhrases: ["photograph lighthouses", "trip photograph", "girl discover"],
        audiencePhrases: ["cast", "cinderella streets", "solitude"],
      },
      {
        title: "I Can Only Imagine",
        gap: 0.58130732,
        direction: "audience",
        officialPhrases: ["band mercyme", "inspires write", "dad inspires"],
        audiencePhrases: ["perseverance forgiveness", "story perseverance", "perseverance"],
      },
    ],
    topMovies: [
      { title: "Moonrise Kingdom", year: 2012, votes: 6406, rating: 7.678, posterUrl: assetUrl("/posters/moonrise-kingdom.jpg") },
      { title: "Gerald's Game", year: 2017, votes: 3971, rating: 6.393, posterUrl: assetUrl("/posters/geralds-game.jpg") },
      { title: "LOL", year: 2012, votes: 2752, rating: 6.098, posterUrl: assetUrl("/posters/lol.jpg") },
    ],
  },
  {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    flagUrl: assetUrl("/flags/br.png"),
    latitude: -14.235,
    longitude: -51.925,
    movies: 29,
    reviews: 480,
    officialValence: -0.073921776,
    audienceValence: 0.117978493,
    adjustedGap: 0.09565404,
    ci: [0.017051203, 0.174256876],
    keywords: ["biography", "spiritual medium", "lonely beach", "carefree clowns", "surfer adopted"],
    cases: [
      {
        title: "Chico Xavier",
        gap: -0.314627303,
        direction: "official",
        officialPhrases: ["biography spiritual", "spiritual medium", "medium author"],
        audiencePhrases: ["lived brazil", "man lived", "certanly perfect"],
      },
      {
        title: "Just Another Christmas",
        gap: 0.574715332,
        direction: "audience",
        officialPhrases: ["wakes year", "doomed waking", "blacks wakes"],
        audiencePhrases: ["refund lost", "refund", "want refund"],
      },
    ],
    topMovies: [
      { title: "Elite Squad: The Enemy Within", year: 2010, votes: 2077, rating: 7.85, posterUrl: assetUrl("/posters/elite-squad-enemy-within.jpg") },
      { title: "The Way He Looks", year: 2014, votes: 997, rating: 7.925, posterUrl: assetUrl("/posters/the-way-he-looks.jpg") },
      { title: "The Second Mother", year: 2015, votes: 788, rating: 8.018, posterUrl: assetUrl("/posters/the-second-mother.jpg") },
    ],
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    flagUrl: assetUrl("/flags/de.png"),
    latitude: 51.1657,
    longitude: 10.4515,
    movies: 40,
    reviews: 613,
    officialValence: -0.054172318,
    audienceValence: 0.044785686,
    adjustedGap: 0.051346455,
    ci: [-0.006468128, 0.109161037],
    keywords: ["German siblings", "old witches", "girl kidnapped", "haunted nightmares", "mysterious Greider"],
    cases: [
      {
        title: "Free Fall",
        gap: -0.472962537,
        direction: "official",
        officialPhrases: ["police baby", "baby way", "fellow policeman"],
        audiencePhrases: ["breath sequel", "discovery romance", "identity & sexuality"],
      },
      {
        title: "The Little Witch",
        gap: 0.480249955,
        direction: "audience",
        officialPhrases: ["witches old", "coven witches", "annual coven"],
        audiencePhrases: ["magic dreamlike", "dreamlike images", "perspective witches"],
      },
    ],
    topMovies: [
      { title: "Sapphire Blue", year: 2014, votes: 1030, rating: 7.1, posterUrl: assetUrl("/posters/sapphire-blue.jpg") },
      { title: "3096 Days", year: 2013, votes: 1009, rating: 7.392, posterUrl: assetUrl("/posters/3096-days.jpg") },
      { title: "The Dark Valley", year: 2014, votes: 429, rating: 7.035, posterUrl: assetUrl("/posters/the-dark-valley.jpg") },
    ],
  },
  {
    code: "EG",
    name: "Egypt",
    flag: "🇪🇬",
    flagUrl: assetUrl("/flags/eg.png"),
    latitude: 26.8206,
    longitude: 30.8025,
    movies: 20,
    reviews: 370,
    officialValence: -0.066511523,
    audienceValence: 0.203642204,
    adjustedGap: 0.130716163,
    ci: [0.023787505, 0.237644821],
    keywords: ["gang pirates", "Cairo democracy", "Samir", "century events", "leper colony"],
    cases: [
      {
        title: "The Passage",
        gap: -0.39075329,
        direction: "official",
        officialPhrases: ["soldiers lead", "heroic battles", "journey heroic"],
        audiencePhrases: ["entertaining series", "great canceled", "dark knight"],
      },
      {
        title: "Diamond Dust",
        gap: 0.653814316,
        direction: "audience",
        officialPhrases: ["mysterious murder", "pharmacist lives", "murder occurs"],
        audiencePhrases: ["underrated", "read novel", "novel masterpiece"],
      },
    ],
    topMovies: [
      { title: "The Square", year: 2013, votes: 164, rating: 7.64, posterUrl: assetUrl("/posters/the-square.jpg") },
      { title: "The Blue Elephant", year: 2014, votes: 107, rating: 7.019, posterUrl: assetUrl("/posters/the-blue-elephant.jpg") },
      { title: "Clash", year: 2016, votes: 102, rating: 7.451, posterUrl: assetUrl("/posters/clash.jpg") },
    ],
  },
  {
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    flagUrl: assetUrl("/flags/cn.png"),
    latitude: 35.8617,
    longitude: 104.1954,
    movies: 40,
    reviews: 666,
    officialValence: -0.078266018,
    audienceValence: 0.097313035,
    adjustedGap: 0.088388281,
    ci: [0.032601327, 0.144175236],
    keywords: ["Shanghai gangsters", "tomb raiders", "anthology", "buried twins", "women volleyball"],
    cases: [
      {
        title: "Under the Hawthorn Tree",
        gap: -0.329845265,
        direction: "official",
        officialPhrases: ["winger schoolgirl", "daughter right", "young soldier"],
        audiencePhrases: ["moved feel", "read book", "quietly moved"],
      },
      {
        title: "Somewhere Only We Know",
        gap: 0.656813504,
        direction: "audience",
        officialPhrases: ["chinese man", "young chinese", "loving grandmother"],
        audiencePhrases: ["getting china", "bridegroom weddings", "liked storyline"],
      },
    ],
    topMovies: [
      { title: "The Wild Goose Lake", year: 2019, votes: 378, rating: 6.644, posterUrl: assetUrl("/posters/wild-goose-lake.jpg") },
      { title: "Ash Is Purest White", year: 2018, votes: 360, rating: 6.871, posterUrl: assetUrl("/posters/ash-is-purest-white.jpg") },
      { title: "The Eight Hundred", year: 2020, votes: 344, rating: 7.048, posterUrl: assetUrl("/posters/the-eight-hundred.jpg") },
    ],
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    flagUrl: assetUrl("/flags/au.png"),
    latitude: -25.2744,
    longitude: 133.7751,
    movies: 40,
    reviews: 1263,
    officialValence: -0.006351986,
    audienceValence: 0.127263968,
    adjustedGap: 0.067291396,
    ci: [0.000256289, 0.134326503],
    keywords: ["female jockey", "father Steven", "student soccer", "tribal war", "farmer brothers"],
    cases: [
      {
        title: "Adoration",
        gap: -0.451800193,
        direction: "official",
        officialPhrases: ["grown neighbors", "lifelong friends", "developed friendship"],
        audiencePhrases: ["controversial taboo", "taboo subject", "foursome extremely"],
      },
      {
        title: "Storm Boy",
        gap: 0.666166864,
        direction: "audience",
        officialPhrases: ["reclusive father", "percival life", "pelican mr"],
        audiencePhrases: ["boring visuals", "excellent cast", "old formula"],
      },
    ],
    topMovies: [
      { title: "Hacksaw Ridge", year: 2016, votes: 15056, rating: 8.193, posterUrl: assetUrl("/posters/hacksaw-ridge.jpg") },
      { title: "Cargo", year: 2017, votes: 1879, rating: 6.399, posterUrl: assetUrl("/posters/cargo.jpg") },
      { title: "Escape from Pretoria", year: 2020, votes: 1513, rating: 7.162, posterUrl: assetUrl("/posters/escape-from-pretoria.jpg") },
    ],
  },
];

type SignalStop = { value: number; color: readonly [number, number, number] };

const signalStops: readonly SignalStop[] = [
  { value: -1, color: [39, 76, 224] },
  { value: -0.5, color: [44, 179, 255] },
  { value: 0, color: [91, 229, 206] },
  { value: 0.5, color: [255, 188, 57] },
  { value: 1, color: [255, 77, 43] },
];

function hexChannel(value: number) {
  return Math.round(value).toString(16).padStart(2, "0");
}

export function audienceSignal(value: number) {
  const clamped = Math.max(-1, Math.min(1, value));
  let lower = signalStops[0];
  let upper = signalStops[signalStops.length - 1];
  for (let index = 0; index < signalStops.length - 1; index += 1) {
    if (clamped >= signalStops[index].value && clamped <= signalStops[index + 1].value) {
      lower = signalStops[index];
      upper = signalStops[index + 1];
      break;
    }
  }
  const mix = (clamped - lower.value) / Math.max(upper.value - lower.value, 0.0001);
  const rgb = lower.color.map((channel, index) => channel + (upper.color[index] - channel) * mix);
  return {
    color: `#${rgb.map(hexChannel).join("")}`,
    intensity: 0.78 + Math.abs(clamped) * 0.9,
  };
}

export function valenceColor(value: number) {
  return audienceSignal(value).color;
}
