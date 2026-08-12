import fs from "node:fs";

// A CNAME means we're serving from the apex domain at "/".
// Without one we're on github.io/<repo>/ and every absolute path needs the repo prefix.
// Deriving it here (rather than hand-setting a flag) means restoring CNAME can never
// ship a live site whose assets all 404.
const pathPrefix = fs.existsSync("src/static/CNAME")
  ? "/"
  : process.env.PATH_PREFIX || "/";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "." });
  return {
    pathPrefix,
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
