# -*- coding: utf-8 -*-
"""Zeichnet Prozessbilder (Kapitelschritte) und Prozesslandkarten je Quick Guide im Design der Vorlage."""
from PIL import Image, ImageDraw, ImageFont
import os, math

DPI = 300
F_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
F_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
C = {"text": (38, 38, 38), "blue": (0, 173, 239), "fill": (239, 248, 255), "red": (178, 30, 35), "redfill": (255, 224, 225),
     "gray": (191, 191, 191), "muted": (64, 64, 64), "white": (255, 255, 255), "lightgray": (243, 243, 243)}

def pt(p):  # Punkt -> Pixel
    return int(p * DPI / 72)

def font(size, bold=False):
    return ImageFont.truetype(F_BOLD if bold else F_REG, pt(size))

def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= max_w or not cur:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def rrect(draw, box, r, fill, outline, width):
    draw.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)

def arrow(draw, x1, y1, x2, y2, color, w):
    draw.line((x1, y1, x2, y2), fill=color, width=w)
    ang = math.atan2(y2 - y1, x2 - x1); L = pt(5)
    p1 = (x2 - L * math.cos(ang - 0.5), y2 - L * math.sin(ang - 0.5))
    p2 = (x2 - L * math.cos(ang + 0.5), y2 - L * math.sin(ang + 0.5))
    draw.polygon([(x2, y2), p1, p2], fill=color)

def flow(labels, w_in, h_in, path, title=None):
    """Horizontale Schrittkette; mehr als 5 Schritte werden auf zwei Reihen verteilt."""
    W, H = int(w_in * DPI), int(h_in * DPI)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    n = len(labels)
    rows = [labels] if n <= 5 else [labels[:math.ceil(n / 2)], labels[math.ceil(n / 2):]]
    per = max(len(r) for r in rows)
    pad = pt(4); gap = pt(14)
    top = pt(14) if title else pad
    if title:
        d.text((pad, pad), title, font=font(8, True), fill=C["text"])
    row_h = (H - top - pad - (len(rows) - 1) * pt(8)) / len(rows)
    node_w = (W - 2 * pad - (per - 1) * gap) / per
    f_num, f_lab = font(9, True), font(7)
    idx = 0
    centers = []
    for ri, row in enumerate(rows):
        y0 = top + ri * (row_h + pt(8)); y1 = y0 + row_h
        for ci, lab in enumerate(row):
            x0 = pad + ci * (node_w + gap); x1 = x0 + node_w
            rrect(d, (x0, y0, x1, y1), pt(4), C["fill"], C["blue"], pt(0.7))
            r = pt(6); cx, cy = x0 + pt(9), y0 + pt(9)
            d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=C["blue"])
            num = str(idx + 1)
            tw = d.textlength(num, font=f_num)
            d.text((cx - tw / 2, cy - pt(5.2)), num, font=f_num, fill=C["white"])
            lines = wrap(d, lab, f_lab, node_w - pt(10))[:3]
            ty = y0 + pt(17)
            for ln in lines:
                d.text((x0 + pt(5), ty), ln, font=f_lab, fill=C["text"]); ty += pt(8.5)
            centers.append((x0, x1, (y0 + y1) / 2, y1))
            idx += 1
    for i in range(1, len(centers)):
        a, b = centers[i - 1], centers[i]
        if abs(a[2] - b[2]) < 1:
            arrow(d, a[1] + pt(1), a[2], b[0] - pt(1), b[2], C["blue"], pt(1))
        else:  # Reihenwechsel: Pfeil von Reihenende nach Reihenanfang
            d.line((a[0] + (a[1] - a[0]) / 2, a[3], a[0] + (a[1] - a[0]) / 2, a[3] + pt(4)), fill=C["blue"], width=pt(1))
            d.line((a[0] + (a[1] - a[0]) / 2, a[3] + pt(4), b[0] + (b[1] - b[0]) / 2, a[3] + pt(4)), fill=C["blue"], width=pt(1))
            arrow(d, b[0] + (b[1] - b[0]) / 2, a[3] + pt(4), b[0] + (b[1] - b[0]) / 2, b[2] - (b[3] - b[2]) - pt(1) + pt(1), C["blue"], pt(1))
    img.save(path)

PHASES = [("Zugang und Navigation", [1, 2, 3]), ("Kunde und Fahrzeug", [4, 5]), ("Angebot", [5]), ("Antrag", [6]),
          ("Signatur", [7]), ("Prüfung und Aktivierung", [8, 9]), ("Verwaltung", [10, 12, 13]), ("Abrechnung", [11])]
LANES = [("Markt- und HQ-Pflege, Länder und Sparten", [14, 15, 20, 21]), ("Governance, Rollout, Migration", [16, 17, 18]),
         ("Architektur, Ausblick, Support", [19, 22, 23])]

def landscape(nr, w_in, h_in, path):
    W, H = int(w_in * DPI), int(h_in * DPI)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    pad = pt(4); f_t, f_l, f_k = font(8, True), font(6.5), font(6)
    d.text((pad, pad), "Prozesslandkarte oneSCM – Einordnung von Kapitel %d" % nr, font=f_t, fill=C["text"])
    top = pt(16); gap = pt(6)
    n = len(PHASES); bw = (W - 2 * pad - (n - 1) * gap) / n; bh = pt(30)
    for i, (name, chs) in enumerate(PHASES):
        x0 = pad + i * (bw + gap); x1 = x0 + bw; hl = nr in chs
        rrect(d, (x0, top, x1, top + bh), pt(3), C["redfill"] if hl else C["fill"], C["red"] if hl else C["blue"], pt(1.2 if hl else 0.7))
        lines = wrap(d, name, f_l, bw - pt(6))[:2]; ty = top + pt(4)
        for ln in lines:
            tw = d.textlength(ln, font=f_l); d.text((x0 + (bw - tw) / 2, ty), ln, font=f_l, fill=C["red"] if hl else C["text"]); ty += pt(7.5)
        k = "Kap. " + ", ".join(str(c) for c in chs); tw = d.textlength(k, font=f_k)
        d.text((x0 + (bw - tw) / 2, top + bh - pt(8.5)), k, font=f_k, fill=C["red"] if hl else C["muted"])
        if i < n - 1:
            arrow(d, x1 + pt(0.5), top + bh / 2, x1 + gap - pt(0.5), top + bh / 2, C["blue"], pt(0.8))
    ly = top + bh + pt(7); lh = (H - ly - pad - (len(LANES) - 1) * pt(3)) / len(LANES)
    for j, (name, chs) in enumerate(LANES):
        y0 = ly + j * (lh + pt(3)); y1 = y0 + lh; hl = nr in chs
        rrect(d, (pad, y0, W - pad, y1), pt(2), C["redfill"] if hl else C["lightgray"], C["red"] if hl else C["gray"], pt(1.0 if hl else 0.5))
        txt = "%s   (Kap. %s)" % (name, ", ".join(str(c) for c in chs))
        d.text((pad + pt(5), y0 + (lh - pt(7)) / 2), txt, font=f_l, fill=C["red"] if hl else C["text"])
    img.save(path)

def badge(nr, title, w_in, h_in, path):
    W, H = int(w_in * DPI), int(h_in * DPI)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    rrect(d, (0, 0, W - 1, H - 1), pt(5), C["white"], C["blue"], pt(0.7))
    phase = next((n for n, chs in PHASES + LANES if nr in chs), "")
    f_big = font(30, True); num = str(nr); tw = d.textlength(num, font=f_big)
    d.text(((W - tw) / 2, pt(6)), num, font=f_big, fill=C["blue"])
    f_s = font(7, True); t = "Kapitel %d von 23" % nr; tw = d.textlength(t, font=f_s)
    d.text(((W - tw) / 2, pt(44)), t, font=f_s, fill=C["text"])
    f_p = font(6.5); lines = wrap(d, phase, f_p, W - pt(10)); ty = pt(55)
    for ln in lines[:2]:
        tw = d.textlength(ln, font=f_p); d.text(((W - tw) / 2, ty), ln, font=f_p, fill=C["muted"]); ty += pt(8)
    img.save(path)

if __name__ == "__main__":
    import sys, json
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    spec = json.load(open(sys.argv[2], encoding="utf-8"))
    for g in spec:
        flow(g["flow"], 5.1, 1.05 if len(g["flow"]) <= 5 else 1.65, os.path.join(out, "flow_%02d.png" % g["nr"]), title="Prozessbild: " + g["title"])
        landscape(g["nr"], 5.1, 1.32, os.path.join(out, "landscape_%02d.png" % g["nr"]))
        badge(g["nr"], g["title"], 1.9, 1.15, os.path.join(out, "badge_%02d.png" % g["nr"]))
    print("Bilder erzeugt:", len(spec) * 3)
