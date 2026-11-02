"""Validate exported routes, internal links, source domains and bundled images."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

root = Path('out')
# Licence-required credits for map data, plus the channels E-Cell and TEDxLNMIIT run
# outside the lnmiit.ac.in domain.
CREDIT_HOSTS = {
    'www.openstreetmap.org',
    'overturemaps.org',
    'www.esri.com',
    'ecell-lnmiit.vercel.app',
    'www.linkedin.com',
    'www.tedxlnmiit.in',
    'www.ted.com',
    'www.youtube.com',
}
# Every department must be linked to its official page, not to a page of this site.
DEPARTMENT_PAGES = {
    'https://lnmiit.ac.in/department/' + s + '/'
    for s in ['cse', 'ai-ds', 'cce', 'ece', 'mme', 'physics', 'math', 'hss']
}
expected = [
    '',
    'prototype-vertical',
    'prototype-horizontal',
    'heritage',
    'departments',
    'gallery',
    'campus-map',
    'student-life',
    'admissions',
    'sources',
] + [
    'departments/' + s
    for s in ['cse', 'ai-ds', 'cce', 'ece', 'mme', 'physics', 'mathematics', 'hss']
] + [
    'student-life/events/' + s
    for s in ['e-summit', 'vivacity', 'plinth', 'desportivos', 'tedx']
]
errors = []


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.images = []
        self.ids = set()
        self.h1 = 0
        self.title = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.add(a['id'])
        if tag == 'h1':
            self.h1 += 1
        if tag == 'title':
            self.title = True
        if tag == 'a':
            self.links.append(a.get('href', ''))
        if tag == 'img':
            self.images.append(a)


for route in expected:
    p = root / route / 'index.html'
    if not p.exists():
        errors.append(f'Missing route: /{route}')
        continue
    page = Page()
    page.feed(p.read_text())
    if '/campus-map/' not in page.links:
        errors.append(f'{route}: header has no direct link to the 3D campus map')
    if page.h1 != 1:
        errors.append(f'{route}: expected one h1, got {page.h1}')
    if not page.title:
        errors.append(f'{route}: missing title')
    for href in page.links:
        u = urlsplit(href)
        if u.scheme == 'mailto':
            continue
        if u.netloc:
            if u.hostname in CREDIT_HOSTS:
                continue
            if u.hostname != 'lnmiit.ac.in' and not u.hostname.endswith('.lnmiit.ac.in'):
                errors.append(f'Non-official external URL: {href}')
            continue
        target = root / unquote(u.path).lstrip('/')
        if not u.path:
            target = p
        elif not target.suffix:
            target = target / 'index.html'
        if not target.exists():
            errors.append(f'{route}: broken internal link {href}')
        if u.fragment and (not u.path or u.path == '/' + route + '/') and u.fragment not in page.ids:
            errors.append(f'{route}: missing fragment {href}')
    for im in page.images:
        if not im.get('alt'):
            errors.append(f'{route}: missing image alt text')
        src = im.get('src', '')
        if src.startswith('/') and not (root / src.lstrip('/')).is_file():
            errors.append(f'{route}: missing image {src}')
    if 'Create Next App' in p.read_text() or 'images.unsplash.com' in p.read_text():
        errors.append(f'{route}: stale starter or stock content')

for route in ['', 'departments']:
    page = Page()
    page.feed((root / route / 'index.html').read_text())
    missing = DEPARTMENT_PAGES - set(page.links)
    if missing:
        errors.append(f'/{route}: missing official department links {sorted(missing)}')
    internal = [h for h in page.links if h.startswith('/departments/') and h != '/departments/']
    if internal:
        errors.append(f'/{route}: links to internal department pages {internal}')

if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(expected)} pages; internal links; image files and alt text; page titles; one h1 per page; all external page links use official LNMIIT domains or map-data, E-Cell or TEDx credits; departments link to official pages; every page links directly to the 3D map.')
