Drop brand logo SVGs here, then set "file" in src/_data/brands.json.

  { "name": "Zomato", "file": "zomato.svg" }

The wall renders the name as text when "file" is empty, so it degrades
cleanly and you can fill brands in one at a time.

Source logos from each brand's own press / brand-assets page — that is the
only source that comes with written usage terms attached. Brandfetch blocks
hotlinking without a registered client ID, and Simple Icons has removed most
of these marks following trademark requests.

Logos are tinted to the ink colour via CSS (filter), so supply single-colour
or dark SVGs where possible.
