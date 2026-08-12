// One-off logo fetcher. Run locally, commit the downloaded files.
//
//   echo 'CONTEXT_API_KEY=your_key_here' > .env     # .env is gitignored
//   npm run logos
//
// The key is a server-side secret, so it never enters the repo, the Actions
// workflow, or page source. Logos are downloaded and self-hosted, which also
// removes a third-party runtime dependency from the logo wall.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "src/assets/logos");
const BRANDS = path.join(ROOT, "src/_data/brands.json");

// read .env without printing it
for (const line of fs.existsSync(path.join(ROOT, ".env"))
  ? fs.readFileSync(path.join(ROOT, ".env"), "utf8").split("\n")
  : []) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
}

const KEY = process.env.CONTEXT_API_KEY;
if (!KEY) {
  console.error("CONTEXT_API_KEY not set. Create .env with:\n  CONTEXT_API_KEY=...");
  process.exit(1);
}

const brands = JSON.parse(fs.readFileSync(BRANDS, "utf8"));

// The wall sits on cream (#F4EEE3) and is tinted dark by CSS, so prefer a full
// wordmark over a bare icon, and a light-background variant over a dark one.
const score = (l) =>
  (l.type === "logo" ? 4 : 0) +
  (l.mode === "light" || l.mode === "has_opaque_background" ? 2 : 0) +
  (/\.svg($|\?)/i.test(l.url) ? 3 : 0);

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

let ok = 0, failed = [];

for (const b of brands) {
  if (!b.domain) { failed.push(`${b.name} (no domain)`); continue; }
  try {
    const res = await fetch("https://api.context.dev/v1/brand/retrieve", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ type: "by_domain", domain: b.domain }),
    });
    if (!res.ok) { failed.push(`${b.name} (HTTP ${res.status})`); continue; }

    const logos = (await res.json())?.logos ?? [];
    const best = logos.slice().sort((a, c) => score(c) - score(a))[0];
    if (!best?.url) { failed.push(`${b.name} (no logo in response)`); continue; }

    const img = await fetch(best.url);
    if (!img.ok) { failed.push(`${b.name} (download ${img.status})`); continue; }

    const ext = (best.url.match(/\.(svg|png|webp|jpe?g)(?=$|\?)/i)?.[1] ?? "png").toLowerCase();
    const file = `${slug(b.name)}.${ext}`;
    fs.writeFileSync(path.join(OUT, file), Buffer.from(await img.arrayBuffer()));
    b.file = file;
    ok++;
    console.log(`  ${b.name} -> ${file} (${best.type}/${best.mode})`);
  } catch (e) {
    failed.push(`${b.name} (${e.message})`);
  }
}

fs.writeFileSync(BRANDS, JSON.stringify(brands, null, 2) + "\n");
console.log(`\n${ok}/${brands.length} logos fetched.`);
if (failed.length) console.log(`Still text-only: ${failed.join(", ")}`);
