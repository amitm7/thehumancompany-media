// Brand logo fetcher — Wikipedia/Wikimedia. No API key, no quota, no signup.
//
//   npm run logos
//
// Why this source: it reads the article infobox's `logo` field, which is the
// actual wordmark, then resolves it through Wikimedia's imageinfo API — which
// also returns the licence. That last part matters: these files are NOT
// automatically free to use. Many brand logos on Wikipedia are non-free
// (fair use for the article only). The script records the licence per brand
// in brands.json so you can see exactly what still needs clearance.
//
// Sourcing a file is not permission to display it as a client. Confirm with
// each brand before the wall goes live.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "src/assets/logos");
const BRANDS = path.join(ROOT, "src/_data/brands.json");
const UA = { "User-Agent": "thehumancompany-logo-fetch/1.0 (hello@thehumancompany.media)" };
const API = "https://en.wikipedia.org/w/api.php";

// Article titles differ from display names ("HUL" -> "Hindustan Unilever").
const ARTICLE = {
  "AWS": "Amazon Web Services",
  "Aditya Birla Group": "Aditya Birla Group",
  "Samsung": "Samsung",
  "Myntra": "Myntra",
  "Flipkart": "Flipkart",
  "HUL": "Hindustan Unilever",
  "HSBC": "HSBC",
  "Pidilite": "Pidilite Industries",
  "Sun Pharma": "Sun Pharmaceutical",
  "Fractal": "Fractal Analytics",
  "Kotak": "Kotak Mahindra Bank",
  "Zomato": "Zomato",
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: UA });
      if (r.ok) return r;
    } catch { /* transient DNS/TLS — retry */ }
    await new Promise((r) => setTimeout(r, 800 * (i + 1)));
  }
  return null;
}

// The infobox `logo` field is the wordmark. pageimages is NOT a fallback worth
// having: for Samsung and HSBC it returns a photo of their headquarters.
async function logoFilename(title) {
  const r = await get(`${API}?action=parse&format=json&prop=wikitext&redirects=1&page=${encodeURIComponent(title)}`);
  const txt = (await r?.json())?.parse?.wikitext?.["*"] ?? "";
  const m = txt.match(/\|\s*logo\s*=\s*(?:\[\[)?(?:File:|Image:)?\s*([^|\]\n]+\.(?:svg|png|jpe?g))/i);
  return m?.[1]?.trim() ?? null;
}

async function fileInfo(filename) {
  const r = await get(`${API}?action=query&format=json&prop=imageinfo&iiprop=url%7Cextmetadata&titles=${encodeURIComponent("File:" + filename)}`);
  const p = Object.values((await r?.json())?.query?.pages ?? {})[0];
  const ii = p?.imageinfo?.[0];
  if (!ii?.url) return null;
  const meta = ii.extmetadata ?? {};
  return {
    url: ii.url,
    licence: meta.LicenseShortName?.value?.replace(/<[^>]*>/g, "") ?? "unknown",
    nonFree: /non-?free|fair use/i.test(meta.LicenseShortName?.value ?? meta.UsageTerms?.value ?? ""),
  };
}

// A real logo SVG draws shapes; a scraped one embeds HTML and paints nothing.
const svgIsReal = (buf) => {
  const s = buf.toString("utf8", 0, 4000);
  return !/<foreignObject/i.test(s) && /<(path|polygon|circle|rect|ellipse|g|use|image)\b/i.test(s);
};

// Infoboxes sometimes name a file that no longer exists. Fall back to searching
// the File: namespace, which is how Fractal's logo turns up.
async function searchFile(name) {
  const r = await get(`${API}?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=5`
    + `&gsrsearch=${encodeURIComponent(name + " logo")}&prop=imageinfo&iiprop=url%7Cextmetadata`);
  const pages = Object.values((await r?.json())?.query?.pages ?? {});
  const hit = pages.find((p) => /logo/i.test(p.title) && /\.(svg|png)$/i.test(p.title));
  const ii = hit?.imageinfo?.[0];
  if (!ii?.url) return null;
  const meta = ii.extmetadata ?? {};
  return {
    url: ii.url,
    licence: meta.LicenseShortName?.value?.replace(/<[^>]*>/g, "") ?? "unknown",
    nonFree: /non-?free|fair use/i.test(meta.LicenseShortName?.value ?? meta.UsageTerms?.value ?? ""),
  };
}

const brands = JSON.parse(fs.readFileSync(BRANDS, "utf8"));
let ok = 0;
const failed = [];
const nonFree = [];

for (const b of brands) {
  const title = ARTICLE[b.name];
  if (!title) { failed.push(`${b.name} (no article mapped)`); continue; }

  const fn = await logoFilename(title);
  let info = fn ? await fileInfo(fn) : null;
  if (!info) info = await searchFile(title);          // infobox named a dead file
  if (!info) { failed.push(`${b.name} (no logo found)`); continue; }

  const img = await get(info.url);
  if (!img) { failed.push(`${b.name} (download failed)`); continue; }

  let buf = Buffer.from(await img.arrayBuffer());
  let ext = (info.url.match(/\.(svg|png|jpe?g)(?=$|\?)/i)?.[1] ?? "png").toLowerCase();
  if (ext === "svg" && !svgIsReal(buf)) { failed.push(`${b.name} (svg paints nothing)`); continue; }

  // Some "SVGs" (Aditya Birla) are just a base64 JPEG in an <image> wrapper.
  // JPEG has no alpha, so it renders as a white box on the cream wall.
  // Unwrap it, key the white out, and keep it as a real transparent PNG.
  const embedded = ext === "svg" && buf.toString("utf8").match(/<image[^>]+base64,([A-Za-z0-9+/=\s]+)/);
  if (embedded) {
    fs.writeFileSync("/tmp/_logo_raw", Buffer.from(embedded[1].replace(/\s/g, ""), "base64"));
    const { execFileSync } = await import("node:child_process");
    execFileSync("python3", [path.join(ROOT, "tools/key-white.py"), "/tmp/_logo_raw", "/tmp/_logo_out.png"]);
    buf = fs.readFileSync("/tmp/_logo_out.png");
    ext = "png";
    console.log(`  ~ ${b.name}: unwrapped embedded raster, keyed out white background`);
  }

  const file = `${slug(b.name)}.${ext}`;
  for (const stale of [".svg", ".png", ".jpg", ".jpeg"].map((e) => path.join(OUT, slug(b.name) + e))) {
    if (stale !== path.join(OUT, file) && fs.existsSync(stale)) fs.unlinkSync(stale);
  }
  fs.writeFileSync(path.join(OUT, file), buf);
  b.file = file;
  b.licence = info.licence;
  ok++;
  if (info.nonFree) nonFree.push(b.name);
  console.log(`  ${b.name.padEnd(20)} ${file.padEnd(26)} ${info.licence}`);
}

fs.writeFileSync(BRANDS, JSON.stringify(brands, null, 2) + "\n");
console.log(`\n${ok}/${brands.length} logos fetched.`);
if (failed.length) console.log(`Still text-only: ${failed.join(", ")}`);
if (nonFree.length) console.log(`\nNON-FREE (needs written permission before display): ${nonFree.join(", ")}`);
