Drop content images here, then name the file in src/_data/media.json.

  "impact-1": { "file": "asha-story.jpg", "alt": "Asha outside her shop" }

An empty "file" renders the hatched placeholder instead, so slots can be
filled one at a time without touching any markup. The box keeps the same
aspect ratio either way — nothing on the page moves when an image lands.

Ratios expected (enforced by CSS crop, so anything larger works):
  wide  16:10   series stills, show key art, case studies, impact stories
  sq     1:1    collage tiles, social tiles, leadership portraits
  tall   4:5    founder portrait

Always write a real "alt" describing what is in the picture — it is read
aloud by screen readers and indexed by Google.
