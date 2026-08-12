"""Make a logo's flat background transparent and trim the margins.

Used for logos that arrive as JPEG (no alpha) inside an SVG <image> wrapper —
they would otherwise render as a solid rectangle on the cream logo wall.

The background colour is sampled from the corners rather than assumed to be
pure white: Myntra's is off-white and slips past a fixed threshold.
"""
import sys

import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
rgba = np.array(Image.open(src).convert("RGBA")).astype(int)
h, w = rgba.shape[:2]

# median of the four corners = the flat background, whatever shade it is
corners = np.array([rgba[0, 0, :3], rgba[0, w - 1, :3], rgba[h - 1, 0, :3], rgba[h - 1, w - 1, :3]])
bg = np.median(corners, axis=0)

# only key out a background that is actually light and actually flat
if bg.min() > 200 and corners.std(axis=0).max() < 12:
    dist = np.abs(rgba[:, :, :3] - bg).max(axis=2)
    rgba[:, :, 3] = np.where(dist < 26, 0, 255)

im = Image.fromarray(rgba.astype("uint8"))
box = im.getbbox()
if box:
    im = im.crop(box)
im.thumbnail((600, 600), Image.LANCZOS)
im.save(dst, optimize=True)
