from PIL import Image, ImageDraw, ImageFont
import os

root = r'C:\Users\APPLE DOOR\Documents\My Projects\goldentitab.github.io\images'

# OG image: 1200x630, aurora blush gradient + accent + title
og = Image.new('RGB', (1200, 630), '#f6eef2')
d = ImageDraw.Draw(og)
# accent band
d.rectangle([0, 0, 1200, 60], fill='#00B6F0')
d.rectangle([0, 630-60, 1200, 630], fill='#00B6F0')
try:
    f = ImageFont.truetype('arial.ttf', 64)
    fs = ImageFont.truetype('arial.ttf', 40)
except Exception:
    f = ImageFont.load_default()
    fs = ImageFont.load_default()
d.text((60, 240), 'Ali D. Shah', font=f, fill='#14141f')
d.text((60, 330), 'UI/UX Designer & Flutter Developer', font=fs, fill='#3d3d52')
d.text((60, 400), 'goldentitab.github.io', font=fs, fill='#02527f')
og.save(os.path.join(root, 'og-image.jpg'), 'JPEG', quality=85)
print('og-image.jpg saved')
