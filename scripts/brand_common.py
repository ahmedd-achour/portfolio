"""Shared palette, fonts and drawing helpers for the brand image generators."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

NAVY = (26, 26, 46)
DEEP = (10, 10, 22)
INDIGO = (40, 36, 92)
GOLD = (201, 169, 110)
GOLD_HI = (240, 214, 160)
GOLD_LO = (160, 124, 66)
WHITE = (250, 249, 247)
MUTED = (156, 163, 175)
SLATE = (36, 38, 62)

INTER = "/usr/share/fonts/opentype/inter/"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
MONO_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"


def font(name, size):
    path = name if name.startswith("/") else INTER + name + ".otf"
    return ImageFont.truetype(path, int(size))


def background(w, h, glows):
    """Deep navy diagonal gradient with soft radial glows: (cx, cy, r, color, strength)."""
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    t = np.clip((x / w) * 0.45 + (y / h) * 0.55, 0, 1)[..., None]
    rgb = np.array(NAVY, np.float32) * (1 - t) + np.array(DEEP, np.float32) * t
    for cx, cy, r, color, strength in glows:
        d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / r
        a = (np.exp(-d * d * 2.2) * strength)[..., None]
        rgb = rgb * (1 - a) + np.array(color, np.float32) * a
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).convert("RGBA")


def dot_grid(w, h, step, radius, color, fade_center, fade_radius, max_alpha):
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    fx, fy = fade_center
    for yy in range(step // 2, h, step):
        for xx in range(step // 2, w, step):
            dist = ((xx - fx) ** 2 + (yy - fy) ** 2) ** 0.5 / fade_radius
            a = int(max_alpha * max(0.0, 1 - dist) ** 1.5)
            if a > 2:
                d.ellipse([xx - radius, yy - radius, xx + radius, yy + radius], fill=color + (a,))
    return layer


def gradient_fill(size, top, bottom, horizontal=False):
    w, h = size
    n = w if horizontal else h
    t = np.linspace(0, 1, n, dtype=np.float32)[:, None]
    line = np.array(top, np.float32) * (1 - t) + np.array(bottom, np.float32) * t
    arr = np.broadcast_to(line[None, :, :] if horizontal else line[:, None, :], (h, w, 3))
    return Image.fromarray(arr.astype(np.uint8)).convert("RGBA")


def gradient_text(img, xy, text, fnt, top, bottom, anchor="ls", spacing=0):
    """Draw text filled with a vertical gradient onto img (RGBA, in place)."""
    mask = Image.new("L", img.size, 0)
    md = ImageDraw.Draw(mask)
    spaced_text(md, xy, text, fnt, 255, anchor, spacing)
    box = mask.getbbox()
    if not box:
        return
    grad = Image.new("RGBA", img.size, (0, 0, 0, 0))
    grad.paste(gradient_fill((box[2] - box[0], box[3] - box[1]), top, bottom), box[:2])
    img.paste(grad, (0, 0), mask)


def spaced_text(draw, xy, text, fnt, fill, anchor="ls", spacing=0):
    """Draw text with extra letter spacing (tracking) in pixels; returns end x."""
    x, y = xy
    if spacing == 0:
        draw.text((x, y), text, font=fnt, fill=fill, anchor=anchor)
        return x + draw.textlength(text, font=fnt)
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill, anchor=anchor)
        x += draw.textlength(ch, font=fnt) + spacing
    return x - spacing


def shadow(layer, blur, opacity, offset=(0, 0), color=(0, 0, 0)):
    """Blurred drop shadow from layer's alpha, same size as layer."""
    a = layer.getchannel("A").point(lambda v: int(v * opacity))
    sh = Image.new("RGBA", layer.size, color + (0,))
    sh.putalpha(a)
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    out = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    out.paste(sh, offset)
    return out


def glow(layer, blur, opacity, color):
    return shadow(layer, blur, opacity, (0, 0), color)
