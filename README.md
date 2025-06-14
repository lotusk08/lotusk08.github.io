<!-- markdownlint-disable-next-line -->
<img src="./assets/img/cat.webp" width="220" align="right" alt="Steve Hoang" />
<div id="abc">
  <ul align="center" style="list-style: none;">
    <summary>
      <h1>My personal blog's source code</h1>
    </summary>
  </ul>
</div>

[![stevehoang.com](/docs/blog-v1.2.7.gif)][stevehoang.com]

A custom style from [Chirpy][theme] for [Jekyll][jekyllrb]

> I don't have time to support. You should read through the [Wiki][wiki] of Chirpy theme to understand the project features and how to use it properly.

## For simple style
[![stevehoang.com](/docs/steve-hoang.webp)][stevehoang.com]
_Fullpage design_

## For speed
[![stevehoang.com](/docs/pagespeed.webp)][stevehoang.com]
_Tested with contents_

## For Obsidient
Yes, I'm using Obsidian, and this Jekyll theme support Obsidian with Minimal style Vault template.
[![stevehoang.com](/docs/obsidian-template.webp)][stevehoang.com]

## Deploy & public by [CloudFlare][cf]
Fix error while building:
```bash
Could not find html-proofer-5.0.9, async-2.21.1, nokogiri-1.18.1-x86_64-linux-gnu, pdf-reader-2.13.0, ... in locally installed gems (Bundler::GemNotFound). Failed: Error while executing user command. Exited with error code: 1
```
in Cloudflare with config the variables for your Preview/Production environment

Variable name|Value
---|---
BUNDLE_WITHOUT|test

## Comment system by [Waline][waline]

Deploy & running on [Vercel][vercel] with [TiDB][Ti]
Sync dark/light theme color config in [waline.html][waline.html]

## Auto insert LQIP - Low Quality Image Placeholders by [lqip-modern][lqip] generator
Generation lqip base64 by running script:

```bash
npm run lqip
```
## Customizations
- Font replace: 'Lato => System Fonts Stack'
- Personal styling:
  - feat: name effective (sidebar).
  - feat: back-to-top progress bar & scroll percentage text.
  - feat: adjust style code blocks.
  - feat: restyle prompt-alerts/note blocks.
  - feat: adjust breadcumb (desktop) & topbar (mobile) content.
  - feat: TOC auto hidden/show with scrolling/hover
  - feat: URLs without trailing slashes
  - style: moving social icon from sidebar to footer
  - style: merge tag to archive page. Moving about page to footer. Hide tab, about, category.
  - style: restyle sidebar: remove background, restyle nav.link hover effect.
  - fix: theme color switching.
  - refactor: restyle footer: add license link.
  - refactor: remove unused code & submodule.
  - refactor: remove sidebar.
  - feat(page): toc enable (not by default)
  
### Upgrade UI (from 1.2.5)
- Single column - easy to read.
- Responsive & adjust text
- style: change border style to diagonal
- style(syntax): change highlight theme to ayu
- style(ui): change the back-to-top circle to square
- feat: X (Twitter) embed function
- feat: breadcrumb hidden for homepage only
  
### Redesign homepage (1.2.7)
- style(ui): redesign homepage
- style(font): use JetBrains Mono for monospace & PlayFair Display (Heading homepage)
- style(img): use lqip data for layered background block behind an image
- feat(chart): use chartjs for visual
- perf: replace font fontawesome by SVG Sprite (all website icons just by `icons.svg` use the svg path from fontawesome)
- style: replace prompt- by note-

[wiki]: https://github.com/cotes2020/jekyll-theme-chirpy/wiki
[cf]: https://pages.cloudflare.com
[theme]: https://rubygems.org/gems/jekyll-theme-chirpy
[jekyllrb]: https://jekyllrb.com
[stevehoang.com]: https://stevehoang.com
[lqip]: https://github.com/transitive-bullshit/lqip-modern
[waline]: https://github.com/walinejs/waline
[waline.html]: https://github.com/lotusk08/lotusk08.github.io/blob/34bf7b0643f7aae4fa812745794a020d9ce5863f/_includes/comments/waline.html
[vercel]: https://vercel.com
[Ti]: https://tidbcloud.com
