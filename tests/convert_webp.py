from PIL import Image
import os, glob

root = r'C:\Users\APPLE DOOR\Documents\My Projects\goldentitab.github.io\images'
quality = 82

for jpg in glob.glob(os.path.join(root, '*.jpg')):
    webp = jpg[:-4] + '.webp'
    im = Image.open(jpg).convert('RGB')
    im.save(webp, 'WEBP', quality=quality, method=6)
    jsz = os.path.getsize(jpg); wsz = os.path.getsize(webp)
    print(f"{os.path.basename(jpg)}: {jsz/1024:.0f}KB -> {os.path.basename(webp)}: {wsz/1024:.0f}KB ({(1-wsz/jsz)*100:.0f}% smaller)")
