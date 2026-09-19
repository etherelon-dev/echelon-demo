/**
 * European cities as they stood around the year 1800.
 *
 * `pop` is an approximate population in thousands (rounded scholarly
 * estimates). Names follow the usage of the period where it differs from today.
 *
 * `outline` is optional. When a city has no outline, lib/map/mapData.ts draws
 * an angular footprint whose area follows its population. To use a surveyed
 * boundary instead, add `outline` as a closed [lon, lat] ring.
 */

export type City = {
  name: string;
  lat: number;
  lon: number;
  pop: number;
  outline?: Array<[number, number]>;
};

type Row = [name: string, lat: number, lon: number, pop: number];

const ROWS: Row[] = [
  // British Isles
  ["London", 51.507, -0.128, 1100],
  ["Dublin", 53.35, -6.26, 165],
  ["Edinburgh", 55.953, -3.189, 83],
  ["Manchester", 53.48, -2.243, 84],
  ["Liverpool", 53.408, -2.992, 80],
  ["Glasgow", 55.864, -4.252, 77],
  ["Cork", 51.898, -8.47, 75],
  ["Birmingham", 52.486, -1.89, 71],
  ["Bristol", 51.454, -2.588, 60],
  ["Leeds", 53.801, -1.549, 53],

  // France
  ["Paris", 48.857, 2.352, 550],
  ["Marseille", 43.296, 5.37, 111],
  ["Lyon", 45.764, 4.836, 110],
  ["Bordeaux", 44.838, -0.579, 92],
  ["Rouen", 49.443, 1.099, 87],
  ["Nantes", 47.218, -1.554, 77],
  ["Lille", 50.629, 3.057, 62],
  ["Toulouse", 43.605, 1.444, 50],
  ["Strasbourg", 48.573, 7.752, 50],

  // Low Countries
  ["Amsterdam", 52.37, 4.895, 217],
  ["Brussels", 50.85, 4.352, 66],
  ["Rotterdam", 51.924, 4.478, 55],
  ["Ghent", 51.054, 3.725, 51],
  ["Antwerp", 51.219, 4.402, 45],
  ["The Hague", 52.078, 4.31, 38],

  // Germany, Austria, Bohemia, Hungary
  ["Vienna", 48.208, 16.374, 247],
  ["Berlin", 52.52, 13.405, 172],
  ["Hamburg", 53.551, 9.994, 130],
  ["Prague", 50.075, 14.438, 75],
  ["Dresden", 51.05, 13.738, 60],
  ["Breslau", 51.108, 17.038, 60],
  ["Buda-Pest", 47.498, 19.04, 54],
  ["Königsberg", 54.71, 20.51, 55],
  ["Cologne", 50.938, 6.96, 43],
  ["Munich", 48.137, 11.575, 40],
  ["Frankfurt", 50.11, 8.682, 40],
  ["Danzig", 54.352, 18.646, 40],
  ["Bremen", 53.079, 8.802, 35],
  ["Leipzig", 51.34, 12.375, 32],
  ["Trieste", 45.649, 13.777, 30],
  ["Pressburg", 48.149, 17.107, 28],
  ["Nuremberg", 49.452, 11.077, 27],

  // Poland, Baltic, Russia
  ["Moscow", 55.756, 37.617, 250],
  ["St. Petersburg", 59.934, 30.336, 220],
  ["Warsaw", 52.23, 21.012, 100],
  ["Lemberg", 49.84, 24.031, 40],
  ["Riga", 56.95, 24.105, 30],
  ["Kraków", 50.065, 19.945, 25],
  ["Vilnius", 54.687, 25.28, 25],
  ["Kiev", 50.45, 30.523, 20],

  // Scandinavia
  ["Copenhagen", 55.676, 12.568, 101],
  ["Stockholm", 59.329, 18.069, 76],
  ["Bergen", 60.391, 5.322, 18],
  ["Gothenburg", 57.709, 11.975, 13],
  ["Christiania", 59.913, 10.752, 9],

  // Iberia
  ["Lisbon", 38.722, -9.139, 180],
  ["Madrid", 40.417, -3.704, 168],
  ["Barcelona", 41.385, 2.173, 115],
  ["Valencia", 39.47, -0.376, 100],
  ["Seville", 37.389, -5.984, 96],
  ["Cádiz", 36.527, -6.289, 71],
  ["Porto", 41.157, -8.629, 60],
  ["Granada", 37.177, -3.599, 50],
  ["Málaga", 36.721, -4.421, 50],
  ["Zaragoza", 41.649, -0.888, 43],

  // Italy
  ["Naples", 40.852, 14.268, 430],
  ["Rome", 41.903, 12.496, 163],
  ["Palermo", 38.116, 13.361, 140],
  ["Venice", 45.44, 12.316, 138],
  ["Milan", 45.464, 9.19, 135],
  ["Genoa", 44.406, 8.946, 90],
  ["Florence", 43.769, 11.256, 80],
  ["Turin", 45.07, 7.687, 78],
  ["Bologna", 44.494, 11.343, 70],
  ["Messina", 38.194, 15.554, 60],
  ["Verona", 45.438, 10.992, 46],
  ["Catania", 37.502, 15.087, 45],
  ["Livorno", 43.548, 10.311, 43],

  // Switzerland
  ["Geneva", 46.204, 6.143, 25],

  // Ottoman Balkans and the Danubian principalities
  ["Constantinople", 41.008, 28.978, 570],
  ["Adrianople", 41.677, 26.556, 100],
  ["Salonica", 40.64, 22.944, 60],
  ["Sarajevo", 43.856, 18.413, 40],
  ["Bucharest", 44.427, 26.104, 30],
  ["Iași", 47.158, 27.587, 30],
  ["Belgrade", 44.787, 20.449, 25],
  ["Sofia", 42.698, 23.322, 20],
  ["Athens", 37.984, 23.728, 10]
];

export const CITIES: City[] = ROWS.map(([name, lat, lon, pop]) => ({
  name,
  lat,
  lon,
  pop
}));
