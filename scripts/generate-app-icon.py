"""Generate the 512x512 Google Play developer icon.

Usage: python3 scripts/generate-app-icon.py src/assets/img/brand/app-icon-512.png
"""
import sys

from PIL import Image, ImageDraw

from brand_common import (GOLD, GOLD_HI, GOLD_LO, INDIGO, MONO_BOLD, WHITE, background, dot_grid, font,
                          glow, gradient_text, shadow)

S = 4  # supersampling factor
N = 512 * S


def main(out):
    img = background(N, N, [
        (N * 0.5, N * 0.46, N * 0.55, GOLD, 0.22),
        (N * 0.95, N * 0.0, N * 0.7, INDIGO, 0.6),
        (N * 0.0, N * 1.0, N * 0.6, INDIGO, 0.4),
    ])
    img.alpha_composite(dot_grid(N, N, 22 * S, 1.3 * S, (200, 200, 235), (N / 2, N / 2), N * 0.62, 60))

    rings = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    rd = ImageDraw.Draw(rings)
    c = N / 2
    for r, a, w in [(0.33, 230, 4), (0.405, 90, 2), (0.47, 40, 2)]:
        rr = N * r
        rd.ellipse([c - rr, c - rr, c + rr, c + rr], outline=GOLD + (a,), width=w * S)
    # small accent dots riding the inner ring
    for (dx, dy), rad in [((-0.233, -0.233), 7), ((0.233, 0.233), 5)]:
        x, y = c + N * dx, c + N * dy
        rd.ellipse([x - rad * S, y - rad * S, x + rad * S, y + rad * S], fill=GOLD_HI + (255,))
    img.alpha_composite(rings)

    # monogram "A." in gold, echoing "Ahmed." on the header
    mono = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    f = font("InterDisplay-Black", 200 * S)
    md = ImageDraw.Draw(mono)
    a_w = md.textlength("A", font=f)
    dot_r = 15 * S
    total = a_w + 10 * S + dot_r * 2
    x0 = c - total / 2
    base = c + 70 * S
    gradient_text(mono, (x0, base), "A", f, GOLD_HI, GOLD_LO)
    dx = x0 + a_w + 10 * S + dot_r
    md.ellipse([dx - dot_r, base - dot_r * 2, dx + dot_r, base], fill=WHITE + (255,))
    img.alpha_composite(shadow(mono, 14 * S, 0.6, (0, 8 * S)))
    img.alpha_composite(glow(mono, 30 * S, 0.35, GOLD))
    img.alpha_composite(mono)

    # code tag under the monogram
    tag = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    td = ImageDraw.Draw(tag)
    tf = font(MONO_BOLD, 26 * S)
    td.text((c, c + 112 * S), "</>", font=tf, fill=GOLD + (220,), anchor="mm")
    img.alpha_composite(tag)

    img.resize((512, 512), Image.LANCZOS).convert("RGB").save(out, optimize=True)


if __name__ == "__main__":
    main(sys.argv[1])
