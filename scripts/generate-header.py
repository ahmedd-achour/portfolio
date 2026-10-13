"""Generate the 4096x2304 Google Play developer page header image.

Usage: python3 scripts/generate-header.py src/assets/img/brand/play-header-4096x2304.png
"""
import sys

import numpy as np

from PIL import Image, ImageDraw

from brand_common import (DEEP, GOLD, GOLD_HI, GOLD_LO, INDIGO, MONO, MUTED, NAVY, SLATE, WHITE,
                          background, dot_grid, font, glow, gradient_fill, gradient_text, shadow,
                          spaced_text)

W, H = 4096, 2304
K = 2  # supersampling factor for the device mockups


def k(*v):
    return [int(x * K) for x in v]


def phone_frame(w, h):
    """Return (image, draw, screen_box) for a phone of w x h final pixels."""
    img = Image.new("RGBA", (w * K, h * K), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(k(0, 0, w, h), radius=90 * K, fill=(18, 18, 32, 255))
    d.rounded_rectangle(k(3, 3, w - 3, h - 3), radius=88 * K, outline=GOLD + (170,), width=3 * K)
    sx0, sy0, sx1, sy1 = 22, 22, w - 22, h - 22
    screen = gradient_fill(k(sx1 - sx0, sy1 - sy0)[0:2], (24, 24, 44), (14, 14, 28))
    m = Image.new("L", screen.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, *screen.size], radius=70 * K, fill=255)
    img.paste(screen, k(sx0, sy0), m)
    # dynamic island
    d.rounded_rectangle(k(w / 2 - 70, 44, w / 2 + 70, 82), radius=19 * K, fill=(6, 6, 12, 255))
    return img, d, (sx0, sy0, sx1, sy1)


def status_bar(d, x0, y0, x1):
    f = font("Inter-SemiBold", 24 * K)
    d.text(k(x0 + 40, y0 + 46), "9:41", font=f, fill=WHITE + (230,), anchor="lm")
    for i in range(4):
        hgt = 8 + i * 5
        d.rounded_rectangle(k(x1 - 120 + i * 12, y0 + 54 - hgt, x1 - 112 + i * 12, y0 + 54), radius=2 * K,
                            fill=WHITE + (220,))
    d.rounded_rectangle(k(x1 - 66, y0 + 36, x1 - 28, y0 + 56), radius=5 * K, outline=WHITE + (220,), width=2 * K)
    d.rounded_rectangle(k(x1 - 62, y0 + 40, x1 - 38, y0 + 52), radius=3 * K, fill=WHITE + (220,))


def app_phone(w=600, h=1240):
    img, d, (x0, y0, x1, y1) = phone_frame(w, h)
    status_bar(d, x0, y0, x1)
    pad = x0 + 36
    d.text(k(pad, y0 + 150), "Good morning", font=font("Inter-Regular", 26 * K), fill=MUTED + (255,), anchor="ls")
    d.text(k(pad, y0 + 200), "Dashboard", font=font("InterDisplay-Bold", 44 * K), fill=WHITE + (255,), anchor="ls")
    d.ellipse(k(x1 - 110, y0 + 140, x1 - 40, y0 + 210), fill=GOLD + (255,))
    d.text(k(x1 - 75, y0 + 176), "A", font=font("InterDisplay-Bold", 34 * K), fill=NAVY + (255,), anchor="mm")
    # hero card with gold gradient
    cx0, cy0, cx1, cy1 = pad, y0 + 240, x1 - 36, y0 + 470
    card = gradient_fill(k(cx1 - cx0, cy1 - cy0)[0:2], GOLD_HI, GOLD_LO, horizontal=True)
    cm = Image.new("L", card.size, 0)
    ImageDraw.Draw(cm).rounded_rectangle([0, 0, *card.size], radius=36 * K, fill=255)
    img.paste(card, k(cx0, cy0), cm)
    d.text(k(cx0 + 32, cy0 + 60), "Active users", font=font("Inter-Medium", 24 * K), fill=NAVY + (200,), anchor="ls")
    d.text(k(cx0 + 32, cy0 + 130), "128.4K", font=font("InterDisplay-Bold", 64 * K), fill=NAVY + (255,), anchor="ls")
    pts = [(0, 60), (40, 48), (80, 54), (120, 30), (160, 38), (200, 14), (240, 20), (280, 0)]
    pts = [k(cx0 + 32 + px * 1.7, cy0 + 150 + py)[0:2] for px, py in pts]
    pts = [tuple(p) for p in pts]
    d.line(pts, fill=NAVY + (230,), width=5 * K, joint="curve")
    d.ellipse([pts[-1][0] - 9 * K, pts[-1][1] - 9 * K, pts[-1][0] + 9 * K, pts[-1][1] + 9 * K], fill=NAVY + (255,))
    # bar chart card
    by0 = cy1 + 30
    d.rounded_rectangle(k(pad, by0, x1 - 36, by0 + 260), radius=32 * K, fill=SLATE + (255,))
    d.text(k(pad + 30, by0 + 54), "Weekly sessions", font=font("Inter-SemiBold", 24 * K), fill=WHITE + (235,), anchor="ls")
    vals = [0.45, 0.7, 0.55, 0.9, 0.65, 1.0, 0.8]
    bw = (x1 - 36 - pad - 60) / len(vals)
    for i, v in enumerate(vals):
        bx = pad + 30 + i * bw
        top = by0 + 230 - v * 140
        col = GOLD + (255,) if i == 5 else (88, 90, 130, 255)
        d.rounded_rectangle(k(bx + 10, top, bx + bw - 10, by0 + 230), radius=10 * K, fill=col)
    # list rows
    ly = by0 + 300
    names = [("New review  ★★★★★", "2 min ago"), ("Build 2.4.0 live", "today")]
    for i, (t, s) in enumerate(names):
        ry = ly + i * 112
        d.rounded_rectangle(k(pad, ry, x1 - 36, ry + 92), radius=26 * K, fill=(30, 31, 54, 255))
        d.ellipse(k(pad + 20, ry + 18, pad + 76, ry + 74), fill=(GOLD if i == 0 else (70, 72, 120)) + (255,))
        d.text(k(pad + 96, ry + 42), t, font=font("Inter-SemiBold", 24 * K), fill=WHITE + (235,), anchor="ls")
        d.text(k(pad + 96, ry + 74), s, font=font("Inter-Regular", 20 * K), fill=MUTED + (255,), anchor="ls")
    # bottom nav
    ny = y1 - 110
    for i in range(4):
        nx = x0 + (x1 - x0) * (i + 0.5) / 4
        col = GOLD if i == 0 else (90, 92, 130)
        d.rounded_rectangle(k(nx - 22, ny, nx + 22, ny + 44), radius=12 * K, fill=col + (255,))
    d.rounded_rectangle(k(w / 2 - 80, y1 - 34, w / 2 + 80, y1 - 26), radius=4 * K, fill=WHITE + (200,))
    return img.resize((w, h), Image.LANCZOS)


CODE = [
    [("class ", "kw"), ("Developer ", "ty"), ("{", "p")],
    [("  final ", "kw"), ("name ", "id"), ("= ", "p"), ("'Achour Ahmed'", "st"), (";", "p")],
    [("  final ", "kw"), ("stack ", "id"), ("= [", "p")],
    [("    'Flutter'", "st"), (", ", "p"), ("'Firebase'", "st"), (",", "p")],
    [("    'Angular'", "st"), (", ", "p"), ("'Node.js'", "st"), (",", "p")],
    [("  ];", "p")],
    [("", "p")],
    [("  ", "p"), ("Future", "ty"), ("<", "p"), ("App", "ty"), ("> ", "p"), ("build", "fn"), ("() ", "p"),
     ("async ", "kw"), ("{", "p")],
    [("    final ", "kw"), ("idea ", "id"), ("= ", "p"), ("await ", "kw"), ("listen", "fn"), ("();", "p")],
    [("    return ", "kw"), ("ship", "fn"), ("(", "p")],
    [("      idea,", "id")],
    [("      quality: ", "id"), ("Quality", "ty"), (".max", "id"), (",", "p")],
    [("      platforms: ", "id"), ("[", "p")],
    [("        Android", "ty"), (", ", "p"), ("iOS", "ty"), (", ", "p"), ("Web", "ty")],
    [("      ],", "p")],
    [("    );", "p")],
    [("  }", "p")],
    [("}", "p")],
]
SYNTAX = {"kw": (199, 146, 234), "ty": GOLD_HI, "id": (220, 222, 235), "st": (163, 214, 148),
          "fn": (130, 190, 255), "p": (150, 155, 180)}


def code_phone(w=600, h=1240):
    img, d, (x0, y0, x1, y1) = phone_frame(w, h)
    status_bar(d, x0, y0, x1)
    pad = x0 + 30
    d.text(k(pad + 6, y0 + 150), "main.dart", font=font("Inter-SemiBold", 28 * K), fill=WHITE + (240,), anchor="ls")
    d.rounded_rectangle(k(x1 - 150, y0 + 118, x1 - 30, y0 + 160), radius=21 * K, fill=GOLD + (255,))
    d.text(k(x1 - 90, y0 + 140), "Run ▶", font=font("Inter-Bold", 22 * K), fill=NAVY + (255,), anchor="mm")
    d.line(k(pad, y0 + 190, x1 - 30, y0 + 190), fill=(60, 62, 96, 255), width=2 * K)
    f = font(MONO, 19.5 * K)
    lh = 46
    for i, line in enumerate(CODE):
        y = y0 + 250 + i * lh
        d.text(k(pad, y), f"{i + 1:>2}", font=f, fill=(80, 84, 120, 255), anchor="ls")
        x = pad + 46
        for txt, kind in line:
            d.text(k(x, y), txt, font=f, fill=SYNTAX[kind] + (255,), anchor="ls")
            x += d.textlength(txt, font=f) / K
    # cursor
    cy = y0 + 250 + 8 * lh
    d.rectangle(k(pad + 46 + 470, cy - 26, pad + 46 + 473, cy + 4), fill=GOLD_HI + (255,))
    # terminal strip
    ty = y1 - 200
    d.rounded_rectangle(k(pad, ty, x1 - 30, y1 - 50), radius=24 * K, fill=(8, 8, 18, 255))
    d.text(k(pad + 24, ty + 54), "$ flutter build --release", font=font(MONO, 20 * K), fill=MUTED + (255,), anchor="ls")
    d.text(k(pad + 24, ty + 104), "✓ Built in 41.2s", font=font(MONO, 20 * K), fill=(163, 214, 148, 255), anchor="ls")
    return img.resize((w, h), Image.LANCZOS)


def browser(w=1640, h=1040):
    img = Image.new("RGBA", (w * K, h * K), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(k(0, 0, w, h), radius=34 * K, fill=(20, 20, 38, 255))
    d.rounded_rectangle(k(1, 1, w - 1, h - 1), radius=34 * K, outline=(70, 72, 110, 255), width=2 * K)
    d.rounded_rectangle(k(0, 0, w, 80), radius=34 * K, fill=(28, 28, 50, 255))
    d.rectangle(k(0, 50, w, 80), fill=(28, 28, 50, 255))
    for i, c in enumerate([(237, 106, 94), (245, 191, 79), (97, 197, 84)]):
        d.ellipse(k(34 + i * 40, 26, 58 + i * 40, 50), fill=c + (255,))
    d.rounded_rectangle(k(w / 2 - 300, 18, w / 2 + 300, 60), radius=21 * K, fill=(16, 16, 30, 255))
    d.text(k(w / 2, 39), "admin dashboard", font=font("Inter-Medium", 22 * K), fill=MUTED + (255,), anchor="mm")
    # sidebar
    d.rectangle(k(0, 80, 300, h - 34), fill=(24, 24, 44, 255))
    d.text(k(40, 150), "Console", font=font("InterDisplay-Bold", 36 * K), fill=WHITE + (255,), anchor="ls")
    for i in range(6):
        yy = 210 + i * 76
        col = GOLD + (255,) if i == 0 else (60, 62, 96, 255)
        d.rounded_rectangle(k(36, yy, 70, yy + 34), radius=9 * K, fill=col)
        d.rounded_rectangle(k(88, yy + 9, 88 + (150 if i % 2 else 120), yy + 25), radius=8 * K,
                            fill=(WHITE if i == 0 else (90, 94, 130)) + (255,))
    # KPI cards
    cx = 340
    kpis = [("Revenue", "$48.2K", "+12.4%"), ("Installs", "92,310", "+8.1%"), ("Rating", "4.9 ★", "+0.2")]
    cw = (w - cx - 40 - 2 * 28) / 3
    for i, (lab, val, delta) in enumerate(kpis):
        x = cx + i * (cw + 28)
        d.rounded_rectangle(k(x, 120, x + cw, 300), radius=24 * K, fill=SLATE + (255,))
        d.text(k(x + 30, 172), lab, font=font("Inter-Medium", 24 * K), fill=MUTED + (255,), anchor="ls")
        d.text(k(x + 30, 248), val, font=font("InterDisplay-Bold", 54 * K), fill=WHITE + (255,), anchor="ls")
        d.text(k(x + cw - 30, 172), delta, font=font("Inter-SemiBold", 22 * K), fill=(163, 214, 148, 255), anchor="rs")
    # line chart
    gx0, gy0, gx1, gy1 = cx, 330, w - 40, h - 70
    d.rounded_rectangle(k(gx0, gy0, gx1, gy1), radius=24 * K, fill=SLATE + (255,))
    d.text(k(gx0 + 30, gy0 + 58), "Growth", font=font("Inter-SemiBold", 28 * K), fill=WHITE + (255,), anchor="ls")
    for i in range(4):
        yy = gy0 + 120 + i * 130
        d.line(k(gx0 + 30, yy, gx1 - 30, yy), fill=(56, 58, 90, 255), width=1 * K)
    series = [0.15, 0.22, 0.2, 0.35, 0.32, 0.48, 0.45, 0.6, 0.58, 0.72, 0.7, 0.88]
    pw, ph = gx1 - gx0 - 80, gy1 - gy0 - 190
    pts = [(gx0 + 40 + i * pw / (len(series) - 1), gy1 - 50 - v * ph) for i, v in enumerate(series)]
    area = [k(*p) for p in pts] + [k(pts[-1][0], gy1 - 40), k(pts[0][0], gy1 - 40)]
    fill_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(fill_layer).polygon([tuple(p) for p in area], fill=GOLD + (45,))
    img.alpha_composite(fill_layer)
    d.line([tuple(k(*p)) for p in pts], fill=GOLD + (255,), width=6 * K, joint="curve")
    series2 = [0.1, 0.12, 0.18, 0.2, 0.26, 0.28, 0.34, 0.37, 0.42, 0.46, 0.5, 0.55]
    pts2 = [(gx0 + 40 + i * pw / (len(series2) - 1), gy1 - 50 - v * ph) for i, v in enumerate(series2)]
    d.line([tuple(k(*p)) for p in pts2], fill=(130, 140, 220, 255), width=4 * K, joint="curve")
    px, py = pts[-1]
    d.ellipse(k(px - 14, py - 14, px + 14, py + 14), fill=GOLD_HI + (255,))
    return img.resize((w, h), Image.LANCZOS)


def place(canvas, layer, center, angle=0, shadow_blur=60, shadow_op=0.6):
    if angle:
        layer = layer.rotate(angle, resample=Image.BICUBIC, expand=True)
    x = int(center[0] - layer.width / 2)
    y = int(center[1] - layer.height / 2)
    full = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    full.paste(layer, (x, y))
    canvas.alpha_composite(shadow(full, shadow_blur, shadow_op, (0, 40)))
    canvas.alpha_composite(full)


def chip(img, d, x, y, label, f, filled=False):
    tw = d.textlength(label, font=f)
    w, h = tw + 96, 104
    if filled:
        d.rounded_rectangle([x, y, x + w, y + h], radius=h / 2, fill=GOLD + (255,))
        d.text((x + w / 2, y + h / 2 + 2), label, font=f, fill=NAVY + (255,), anchor="mm")
    else:
        glass = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ImageDraw.Draw(glass).rounded_rectangle([x, y, x + w, y + h], radius=h / 2, fill=(255, 255, 255, 14),
                                                outline=GOLD + (150,), width=3)
        img.alpha_composite(glass)
        d.text((x + w / 2, y + h / 2 + 2), label, font=f, fill=WHITE + (235,), anchor="mm")
    return x + w + 28


def main(out):
    img = background(W, H, [
        (3150, 1050, 1500, GOLD, 0.16),
        (3500, 300, 1200, INDIGO, 0.55),
        (500, 2200, 1300, INDIGO, 0.35),
    ])
    img.alpha_composite(dot_grid(W, H, 64, 3, (190, 190, 230), (3100, 1150), 1900, 70))

    # concentric gold rings behind the devices (echo the app icon)
    rings = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rd = ImageDraw.Draw(rings)
    for r, a in [(760, 70), (1000, 45), (1240, 25)]:
        rd.ellipse([3080 - r, 1180 - r, 3080 + r, 1180 + r], outline=GOLD + (a,), width=4)
    img.alpha_composite(rings)

    place(img, browser(), (3280, 900), angle=0, shadow_blur=70, shadow_op=0.7)
    place(img, code_phone(), (2560, 1330), angle=6)
    place(img, app_phone(), (3620, 1420), angle=-5)

    # left-side legibility veil
    a = np.clip(1.0 - np.linspace(0, 1, W) / 0.55, 0, 1) ** 1.6 * 150
    veil = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    veil.putalpha(Image.fromarray(np.broadcast_to(a[None, :], (H, W)).astype(np.uint8)))
    img.alpha_composite(veil)

    d = ImageDraw.Draw(img)
    x0 = 400
    label_f = font("Inter-SemiBold", 58)
    d.rounded_rectangle([x0, 690, x0 + 90, 700], radius=5, fill=GOLD + (255,))
    spaced_text(d, (x0 + 120, 716), "MOBILE & FULL-STACK DEVELOPER", label_f, GOLD + (255,), "ls", spacing=10)

    name_f = font("InterDisplay-Bold", 250)
    text_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(text_layer)
    td.text((x0 - 8, 1000), "Achour", font=name_f, fill=WHITE + (255,), anchor="ls")
    gradient_text(text_layer, (x0 - 8, 1250), "Ahmed.", name_f, GOLD_HI, GOLD_LO)
    img.alpha_composite(glow(text_layer, 40, 0.25, GOLD))
    img.alpha_composite(text_layer)

    tag_f = font("Inter-Regular", 74)
    d.text((x0, 1420), "I design & build polished apps", font=tag_f, fill=(214, 216, 228, 255), anchor="ls")
    d.text((x0, 1520), "for Android, iOS and the web.", font=tag_f, fill=(214, 216, 228, 255), anchor="ls")

    chip_f = font("Inter-SemiBold", 50)
    x = x0
    for i, t in enumerate(["Flutter", "Firebase", "Angular", "Node.js"]):
        x = chip(img, d, x, 1630, t, chip_f, filled=(i == 0))

    img.convert("RGB").save(out, optimize=True)


if __name__ == "__main__":
    main(sys.argv[1])
