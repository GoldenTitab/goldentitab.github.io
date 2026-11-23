import re, glob

# Convert <img src="images/X.jpg" ...> to <picture><source srcset="images/X.webp" type="image/webp"><img src="images/X.jpg" ...></picture>
# Preserves all other attributes on the img tag.
for html in ['index.html', 'world.html', 'experience.html']:
    with open(html, 'r', encoding='utf-8') as f:
        content = f.read()

    def repl(m):
        full = m.group(0)
        # Extract src value
        sm = re.search(r'src="([^"]*\.jpg)"', full)
        if not sm:
            return full
        jpg = sm.group(1)
        webp = jpg[:-4] + '.webp'
        # Build source tag inserted before the img, inside a picture wrapper
        source = f'<source srcset="{webp}" type="image/webp">'
        # Wrap: replace <img ...> with <picture>source <img ...></picture>
        # We keep the img tag intact and wrap it.
        return f'<picture>{source}{full}</picture>'

    content2 = re.sub(r'<img [^>]*src="[^"]*\.jpg"[^>]*>', repl, content)
    with open(html, 'w', encoding='utf-8') as f:
        f.write(content2)
    print(f'Processed {html}')
