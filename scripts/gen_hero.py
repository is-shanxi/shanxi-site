import numpy as np
from PIL import Image
import random

W, H = 2400, 1080
rng = random.Random(20260811)

# 页面背景色（浅色主题），让图片底部能无缝衔接
PAGE_BG = np.array([246, 249, 246], float)  # --bg

# 基础垂直渐变（上浅薄荷天空 -> 下青绿地平线）
top = np.array([232, 248, 242], float)       # #e8f8f2
horizon = np.array([140, 213, 190], float)    # #8cd5be
ys = np.linspace(0, 1, H)[:, None]
base = top[None, :] * (1 - ys) + horizon[None, :] * ys
img = np.tile(base, (W, 1, 1)).transpose(1, 0, 2).copy()

def add_glow(cx, cy, radius, color, strength):
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    g = np.clip(1 - d / radius, 0, 1) ** 2
    for i in range(3):
        img[:, :, i] += color[i] * g * strength

# 主光晕：右上大月亮/太阳
add_glow(int(W * 0.72), int(H * 0.28), int(H * 1.05),
         np.array([255, 250, 235]), 0.65)
# 左上薄荷光
add_glow(int(W * 0.14), int(H * 0.52), int(H * 0.7),
         np.array([195, 240, 225]), 0.35)

def mountain(base_y, amp, color, alpha):
    layer = np.zeros((H, W, 3), float)
    phase = rng.uniform(0, 6.28)
    freq = rng.uniform(1.1, 2.2)
    for x in range(W):
        nx = x / W
        y = base_y + np.sin(nx * np.pi * freq + phase) * amp \
            + np.sin(nx * np.pi * (freq * 2.3) + phase * 1.7) * amp * 0.35
        yint = int(np.clip(y, 0, H - 1))
        layer[yint:H, x, :] = color
    mask = (layer.sum(axis=2) > 0)[:, :, None]
    img[:, :, :] = np.where(mask, img[:, :, :] * (1 - alpha) + layer * alpha, img[:, :, :])

mountain(int(H * 0.66), 28, np.array([170, 220, 205]), 0.50)
mountain(int(H * 0.74), 36, np.array([120, 200, 178]), 0.55)
mountain(int(H * 0.84), 32, np.array([78, 165, 142]), 0.62)

# 星点（仅上半部，稀疏）
for _ in range(110):
    x = rng.randint(0, W - 1)
    y = rng.randint(0, int(H * 0.48))
    b = rng.uniform(0.35, 1.0)
    r = rng.choice([1, 1, 1, 2])
    yy, xx = np.ogrid[max(0, y - r):y + r + 1, max(0, x - r):x + r + 1]
    mask = (xx - x) ** 2 + (yy - y) ** 2 <= r * r
    img[max(0, y - r):y + r + 1, max(0, x - r):x + r + 1, :] += (255 * b) * mask[:, :, None]

# 漂浮光斑
for _ in range(48):
    x = rng.randint(0, W)
    y = rng.randint(int(H * 0.2), H)
    r = rng.randint(6, 28)
    c = rng.choice([[210, 245, 232], [255, 250, 235], [185, 230, 218]])
    add_glow(x, y, int(r * 4), np.array(c), rng.uniform(0.05, 0.14))

# 底部过渡带：从山丘底部平滑过渡到页面背景色，避免生硬的截断
# 同时抵消原先全局高斯模糊带来的"朦胧"感，让边界清晰可辨
fade_start = int(H * 0.90)
for y in range(fade_start, H):
    t = (y - fade_start) / (H - fade_start)
    blend = t ** 1.6
    img[y, :, :] = img[y, :, :] * (1 - blend) + PAGE_BG * blend

img = np.clip(img, 0, 255).astype(np.uint8)
im = Image.fromarray(img, 'RGB')
im.save('public/hero-banner.png', 'PNG')
print('saved public/hero-banner.png', im.size)
