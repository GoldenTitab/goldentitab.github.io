import re, glob

for html in ['index.html', 'world.html', 'experience.html']:
    with open(html, 'r', encoding='utf-8') as f:
        content = f.read()

    def repl(m):
        full = m.group(0)
        sm = re.search(r'src="([^"]*\.jpg)"', full)
        if not sm:
            return full
        jpg = sm.group(1)
        webp = jpg[:-4] + '.webp'
        source = f'<source srcset="{webp}" type="image/webp">'
        return f'<picture>{source}{full}</picture>'

    content2 = re.sub(r'<img [^>]*src="[^"]*\.jpg"[^>]*>', repl, content)
    with open(html, 'w', encoding='utf-8') as f:
        f.write(content2)
    print(f'Processed {html}')
