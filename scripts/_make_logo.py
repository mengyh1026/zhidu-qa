from PIL import Image
import os, shutil

SRC = r"C:\Users\admin\AppData\Local\Temp\ScreenShot_2026-08-28_085743_494.png"
REPO = r"C:\Users\admin\.wpscomate\agent\workspace\zhidu-qa"

img = Image.open(SRC).convert("RGB")
w, h = img.size

# 等比放入 256x256 白底正方形，四周留 8% 边距
size = 256
canvas = Image.new("RGB", (size, size), (255, 255, 255))
scale = (size * 0.84) / max(w, h)
nw, nh = int(w * scale), int(h * scale)
resized = img.resize((nw, nh), Image.LANCZOS)
canvas.paste(resized, ((size - nw) // 2, (size - nh) // 2))

# favicon 用：64x64 缩小版
favicon = canvas.resize((64, 64), Image.LANCZOS)

logo_path = os.path.join(REPO, "app", "logo.png")
canvas.save(logo_path, optimize=True)

# 同步 3 处站点目录（app/ 根目录 gh-pages/）+ favicon
targets = [logo_path,
           os.path.join(REPO, "logo.png"),
           os.path.join(REPO, "gh-pages", "logo.png"),
           os.path.join(REPO, "favicon.png"),
           os.path.join(REPO, "gh-pages", "favicon.png"),
           os.path.join(REPO, "app", "favicon.png")]
favicon.save(targets[3], optimize=True)
for t in targets[4:]:
    shutil.copy(targets[3], t)

print("logo size:", canvas.size)
for t in [logo_path, targets[1], targets[2], targets[3]]:
    print("OUTPUT=" + t)
