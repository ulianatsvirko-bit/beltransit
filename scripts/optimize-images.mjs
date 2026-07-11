import sharp from "sharp";

const images = [
  ["public/tires.png", "public/tires.webp"],
  ["public/karcher.png", "public/karcher.webp"],
  ["public/appliances.png", "public/appliances.webp"],
  ["public/hero-truck.jpg", "public/hero-truck.webp"],
  ["src/assets/beltransit-logo-orange.png", "src/assets/beltransit-logo-orange.webp"],
];

await Promise.all(
  images.map(([source, destination]) =>
    sharp(source).webp({ quality: 82, smartSubsample: true }).toFile(destination),
  ),
);

console.log(`Optimized ${images.length} images.`);
