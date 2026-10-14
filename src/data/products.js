const img = (name) => `/images/${name}`;
const make = (o) => ({ colors: [], sizes: [], isNew: false, oldPrice: null, discount: null, ...o, images: o.images || [o.image] });

/**
 * dept → store department (left sidebar on the home page)
 * cat  → "Browse by category" tiles
 */
export const products = [
  make({ id: "havit-hv-g92-gamepad", name: "HAVIT HV-G92 Gamepad", price: 120, oldPrice: 160, discount: 40, rating: 5, reviews: 88, dept: "electronics", cat: "gaming", image: img("gamepad-havit.jpg"), colors: ["#DB4444", "#000000"], description: "Dual-vibration USB gamepad with a comfortable rubberised grip and responsive buttons. Plug and play on PC and PlayStation." }),
  make({ id: "ak-900-wired-keyboard", name: "AK-900 Wired Keyboard", price: 960, oldPrice: 1160, discount: 35, rating: 4, reviews: 75, dept: "electronics", cat: "computers", image: img("keyboard-ak900.jpg"), description: "Full-size mechanical-feel gaming keyboard with rainbow backlight, anti-ghosting keys and a braided cable." }),
  make({ id: "ips-lcd-gaming-monitor", name: "IPS LCD Gaming Monitor", price: 370, oldPrice: 400, discount: 30, rating: 5, reviews: 99, dept: "electronics", cat: "computers", image: img("monitor-ips.jpg"), description: "27-inch curved IPS gaming monitor with a 165Hz refresh rate, 1ms response time and vivid colours." }),
  make({ id: "s-series-comfort-chair", name: "S-Series Comfort Chair", price: 375, oldPrice: 400, discount: 25, rating: 4.5, reviews: 99, dept: "home", cat: "furniture", image: img("chair-s-series.jpg"), description: "Upholstered accent chair with solid-wood legs. Soft, supportive and easy to match with any room." }),
  make({ id: "the-north-coat", name: "The north coat", price: 260, oldPrice: 360, rating: 5, reviews: 65, dept: "womens", cat: "fashion", image: img("coat-north.jpg"), sizes: ["XS", "S", "M", "L", "XL"], description: "Water-resistant hooded parka with deep pockets and a warm lining, built for cold, wet days." }),
  make({ id: "gucci-duffle-bag", name: "Gucci duffle bag", price: 960, oldPrice: 1160, discount: 35, rating: 4.5, reviews: 65, dept: "womens", cat: "fashion", image: img("bag-gucci.jpg"), description: "Signature canvas duffle with leather trim, detachable shoulder strap and a roomy lined interior." }),
  make({ id: "rgb-liquid-cpu-cooler", name: "RGB liquid CPU Cooler", price: 160, oldPrice: 170, rating: 4.5, reviews: 65, dept: "electronics", cat: "computers", image: img("cooler-rgb.jpg"), description: "240mm all-in-one liquid cooler with dual addressable RGB fans and a quiet, high-flow pump." }),
  make({ id: "small-bookself", name: "Small BookSelf", price: 360, rating: 5, reviews: 65, dept: "home", cat: "furniture", image: img("bookshelf-small.jpg"), description: "Compact solid-wood side shelf that slides beside a sofa or bed for books, plants and a morning coffee." }),
  make({ id: "breed-dry-dog-food", name: "Breed Dry Dog Food", price: 100, rating: 3, reviews: 35, dept: "groceries", cat: "pets", image: img("dog-food.jpg"), description: "Complete dry food for adult dogs with real beef, vegetables and added vitamins. 12 lb bag." }),
  make({ id: "canon-eos-dslr-camera", name: "CANON EOS DSLR Camera", price: 360, rating: 4, reviews: 95, dept: "electronics", cat: "camera", image: img("camera-canon.jpg"), description: "24MP DSLR with an 18-55mm lens, built-in Wi-Fi and Full HD video. A great first step into photography." }),
  make({ id: "asus-fhd-gaming-laptop", name: "ASUS FHD Gaming Laptop", price: 700, rating: 5, reviews: 325, dept: "electronics", cat: "computers", image: img("laptop-asus.jpg"), description: "15.6-inch Full HD gaming laptop with a fast processor, dedicated graphics and a backlit keyboard." }),
  make({ id: "curology-product-set", name: "Curology Product Set", price: 500, rating: 4, reviews: 145, dept: "beauty", cat: "beauty", image: img("curology-set.jpg"), description: "A three-step daily skincare set: cleanser, moisturiser and a custom treatment cream." }),
  make({ id: "kids-electric-car", name: "Kids Electric Car", price: 960, rating: 5, reviews: 65, dept: "toys", cat: "toys", isNew: true, image: img("car-kids.jpg"), colors: ["#DB4444", "#000000"], description: "Ride-on electric car with a parental remote, working lights, music and safety belts. Ages 3–8." }),
  make({ id: "jr-zoom-soccer-cleats", name: "Jr. Zoom Soccer Cleats", price: 1160, rating: 5, reviews: 35, dept: "sports", cat: "sports", image: img("cleats-zoom.jpg"), colors: ["#EEE717", "#DB4444"], sizes: ["XS", "S", "M", "L", "XL"], description: "Lightweight youth football boots with a firm-ground sole and a snug, breathable upper." }),
  make({ id: "gp11-shooter-usb-gamepad", name: "GP11 Shooter USB Gamepad", price: 660, rating: 4.5, reviews: 55, dept: "electronics", cat: "gaming", isNew: true, image: img("gamepad-gp11.jpg"), colors: ["#000000", "#DB4444"], description: "Wireless-style USB controller with textured grips, dual triggers and low-latency response." }),
  make({ id: "quilted-satin-jacket", name: "Quilted Satin Jacket", price: 660, rating: 4.5, reviews: 55, dept: "mens", cat: "fashion", image: img("jacket-satin.jpg"), colors: ["#184A48", "#DB4444"], sizes: ["XS", "S", "M", "L", "XL"], description: "A bomber-style satin jacket with a quilted lining, ribbed cuffs and a bright orange inner lining." }),
  make({
    id: "havic-hv-g-92-gamepad",
    name: "Havic HV G-92 Gamepad",
    price: 192,
    rating: 4,
    reviews: 150,
    dept: "electronics",
    cat: "gaming",
    image: img("havic-1.jpg"),
    images: [img("havic-1.jpg"), img("havic-thumb-1.jpg"), img("havic-thumb-2.jpg"), img("havic-thumb-3.jpg"), img("havic-thumb-4.jpg")],
    colors: ["#A0BCE0", "#E07575"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.",
  }),
  make({ id: "iphone-14-pro", name: "iPhone 14 Pro", price: 999, oldPrice: 1099, discount: 10, rating: 5, reviews: 412, dept: "electronics", cat: "phones", image: img("hero-iphone.jpg"), description: "Super Retina XDR display, an advanced triple-camera system and all-day battery life in a deep purple finish." }),
  make({ id: "jbl-boombox-speaker", name: "JBL Boombox Speaker", price: 450, oldPrice: 520, rating: 4.5, reviews: 218, dept: "electronics", cat: "headphones", image: img("banner-jbl.jpg"), description: "Powerful portable Bluetooth speaker with deep bass, a waterproof body and up to 24 hours of playtime." }),
  make({ id: "amazon-wireless-speakers", name: "Amazon Wireless Speakers", price: 120, rating: 4, reviews: 134, dept: "electronics", cat: "headphones", image: img("speakers.jpg"), description: "Smart speakers with rich 360° sound and built-in voice assistant. Place one in every room." }),
  make({ id: "gucci-intense-oud-edp", name: "GUCCI INTENSE OUD EDP", price: 170, oldPrice: 190, rating: 5, reviews: 76, dept: "beauty", cat: "beauty", image: img("perfume.jpg"), description: "A rich, warm eau de parfum built around oud wood, rose and amber. 90 ml." }),
  make({ id: "playstation-5", name: "PlayStation 5", price: 499, rating: 5, reviews: 860, dept: "electronics", cat: "gaming", isNew: true, image: img("ps5.jpg"), description: "The black and white PS5 console: ultra-fast SSD, 4K gaming and the DualSense wireless controller." }),
  make({ id: "smart-watch-series-7", name: "Smart Watch Series 7", price: 249, oldPrice: 299, rating: 4.5, reviews: 190, dept: "electronics", cat: "smartwatch", image: img("smartwatch.svg"), colors: ["#000000", "#DB4444"], description: "Always-on display, heart-rate and sleep tracking, GPS and a battery that lasts the whole week." }),
];

export const getProduct = (id) => products.find((p) => p.id === id);
export const byIds = (ids) => ids.map(getProduct).filter(Boolean);

export const flashSales = byIds(["havit-hv-g92-gamepad", "ak-900-wired-keyboard", "ips-lcd-gaming-monitor", "s-series-comfort-chair", "gucci-duffle-bag", "rgb-liquid-cpu-cooler", "iphone-14-pro", "smart-watch-series-7"]);
export const bestSelling = byIds(["the-north-coat", "gucci-duffle-bag", "rgb-liquid-cpu-cooler", "small-bookself"]);
export const exploreProducts = byIds([
  "breed-dry-dog-food", "canon-eos-dslr-camera", "asus-fhd-gaming-laptop", "curology-product-set",
  "kids-electric-car", "jr-zoom-soccer-cleats", "gp11-shooter-usb-gamepad", "quilted-satin-jacket",
  "havic-hv-g-92-gamepad", "jbl-boombox-speaker", "amazon-wireless-speakers", "gucci-intense-oud-edp",
  "playstation-5", "smart-watch-series-7", "the-north-coat", "small-bookself",
]);

export const browseCategories = ["phones", "computers", "smartwatch", "camera", "headphones", "gaming"];
export const departments = [
  { key: "womens", sub: ["coats", "bags", "dresses"] },
  { key: "mens", sub: ["jackets", "shoes", "watches"] },
  { key: "electronics" },
  { key: "home" },
  { key: "medicine" },
  { key: "sports" },
  { key: "toys" },
  { key: "groceries" },
  { key: "beauty" },
];

/** Name-only search: every word of the query must appear in the product name. */
export function searchProducts(query) {
  const tokens = String(query || "").toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return products;
  return products.filter((p) => {
    const name = p.name.toLowerCase();
    return tokens.every((tk) => name.includes(tk));
  });
}

/* ---------- seeded reviews ---------- */
const REVIEWERS = ["Sara Ahmed", "Omar Hassan", "Layla Mansour", "Youssef Adel", "Nour El-Din", "Mona Said", "Karim Fathy", "Hana Mostafa"];
const REVIEW_TEXTS = [
  "Great quality for the price. Arrived quickly and exactly as described.",
  "Really happy with this purchase — would buy again.",
  "Looks even better in person. Packaging was neat and secure.",
  "Good value. Does the job and feels well made.",
  "Fast delivery and friendly support. Highly recommended.",
  "Solid product. Took a little while to get used to but I love it now.",
];
export function seededReviews(productId) {
  const seed = [...productId].reduce((a, c) => a + c.charCodeAt(0), 0);
  return [0, 1].map((i) => ({
    id: `seed-${productId}-${i}`,
    author: REVIEWERS[(seed + i * 3) % REVIEWERS.length],
    rating: 5 - ((seed + i) % 2),
    text: REVIEW_TEXTS[(seed + i * 2) % REVIEW_TEXTS.length],
    date: i === 0 ? "2026-09-12" : "2026-08-27",
    seeded: true,
  }));
}
