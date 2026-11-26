"""Bundle index.html + css/style.css + js/*.js into one page for claude.ai.

claude.ai wraps an artifact page in its own <html>/<head>/<body>, so the output keeps only
what goes inside: the title, fonts, the stylesheet inlined, the markup, and every script inlined
in the same order index.html loads them.

Usage:  python3 tools/build_artifact.py [output.html]   (default: dist/emotion-garden.html)
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "dist", "emotion-garden.html")
    html = read("index.html")
    head = html.split("<head>", 1)[1].split("</head>", 1)[0]
    body = html.split("<body>", 1)[1].split("</body>", 1)[0]

    title = re.search(r"<title>.*?</title>", head).group(0)
    fonts = re.findall(r'<link rel="(?:preconnect|stylesheet)" href="https://fonts\.[^"]+"[^>]*>', head)
    css = read("css/style.css")

    def inline_script(m):
        src = m.group(1)
        if src.startswith("http"):
            return m.group(0)
        code = read(src)
        if "</script" in code:
            raise SystemExit(f"{src} contains '</script', which would end the inline script early")
        return f"<script>\n{code}</script>"

    body = re.sub(r'<script src="([^"]+)"></script>', inline_script, body)
    page = "\n".join([title, '<meta name="claude:viewport-fit-sides" content="cover">', *fonts,
                      "<style>", css.rstrip("\n"), "</style>", body.strip("\n"), ""])
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        f.write(page)
    print(f"wrote {out} ({len(page.encode('utf-8')):,} bytes)")


if __name__ == "__main__":
    main()
