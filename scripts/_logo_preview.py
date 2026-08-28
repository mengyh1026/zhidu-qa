from PIL import Image, ImageDraw
import os

base_path = r"C:/Users/admin/AppData/Local/Temp/ScreenShot_2026-08-28_090915_799.png"
logo_path = r"C:/Users/admin/AppData/Local/Temp/ScreenShot_2026-08-28_085743_494.png"
out_path = r"C:/Users/admin/.wpscomate/agent/workspace/zhidu-qa/logo-preview.png"

base = Image.open(base_path).convert("RGB")
logo = Image.open(logo_path).convert("RGB")
print("base size:", base.size, "logo size:", logo.size)

# 定位顶栏 logo 方块：截图上书图标区域约 (36, 22) 起，约 66x66（含圆角底）
# 稍微扩一点确保完全盖住旧 emoji
tile_x, tile_y, tile_s = 34, 20, 70

# 1) 画白色圆角块（从顶栏背景色取色补边角）
corner_color = base.getpixel((tile_x + 2, tile_y + 2))  # 接近顶栏蓝
tile = Image.new("RGB", (tile_s, tile_s), (255, 255, 255))
mask = Image.new("L", (tile_s, tile_s), 0)
d = ImageDraw.Draw(mask)
radius = 18
d.rounded_rectangle([0, 0, tile_s - 1, tile_s - 1], radius=radius, fill=255)

# 2) LOGO 等比缩放进圆角块（留 6px 内边距）
pad = 6
inner = tile_s - pad * 2
lw, lh = logo.size
scale = min(inner / lw, inner / lh)
nw, nh = int(lw * scale), int(lh * scale)
logo_rs = logo.resize((nw, nh), Image.LANCZOS)
tile.paste(logo_rs, ((tile_s - nw) // 2, (tile_s - nh) // 2))

# 3) 用背景蓝填充圆角外的区域，再贴圆角块
patch = Image.new("RGB", (tile_s, tile_s), corner_color)
base.paste(patch, (tile_x, tile_y))
base.paste(tile, (tile_x, tile_y), mask)

# 4) 裁出顶栏 + 顶部内容区做预览（宽全幅，高 ~620）
preview = base.crop((0, 0, base.size[0], 620))
preview.save(out_path)
print("OUTPUT=" + os.path.abspath(out_path))
