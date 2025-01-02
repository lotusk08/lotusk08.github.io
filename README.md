<!-- markdownlint-disable-next-line -->
<img src="./assets/img/cat.webp" width="220" align="right" alt="Steve Hoang" />
<div id="abc">
  <ul align="center" style="list-style: none;">
    <summary>
      <h1>My personal blog's source code</h1>
    </summary>
  </ul>
</div>

Using [Jekyll][jekyllrb] with [Chirpy][theme] theme, host in Github with [submodule][lib], deployed on Cloudflare.
 


## Deploy & public by [Cloudflare][cf]
Fix error while building like this `Could not find html-proofer-5.0.9, async-2.21.1, nokogiri-1.18.1-x86_64-linux-gnu, pdf-reader-2.13.0, ... in locally installed gems (Bundler::GemNotFound). Failed: Error while executing user command. Exited with error code: 1` in Cloudflare with config the variables for your Preview/Production environment

Variable name|Value
---|---
BUNDLE_WITHOUT|test

## Comment system by [Waline][waline]
[![stevehoang.com](/docs/comment-system.webp)][stevehoang.com]

Deploy & running on [Vercel][vercel] with [MongoDB][mon]
Sync dark/light theme color config in [waline.html][waline.html]

```javascript

let head = document.getElementsByTagName("head")[0];
let css = head.lastChild;
let cssContent = css.textContent.replace("__waline__css__", "");
let cssContentPerferredDark = "@media (prefers-color-scheme: dark){html:not([data-mode])" + cssContent + "}";
let cssContentSelectedDark = "html[data-mode=dark]" + cssContent;
css.textContent = cssContentPerferredDark;
let style = document.createElement('style');
style.textContent = cssContentSelectedDark;
head.appendChild(style);

document.documentElement.style.setProperty('--waline-theme-color', 'var(--link-color)');
document.documentElement.style.setProperty('--waline-active-color', 'var(--sidebar-active-color)');
```

## Low Quality Image Placeholders by [lqip-modern][lqip] generator
Generation lqip base64 by running script:

```bash
node tools/lqip/index.js
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

[cf]: https://pages.cloudflare.com
[theme]: https://rubygems.org/gems/jekyll-theme-chirpy
[jekyllrb]: https://jekyllrb.com
[stevehoang.com]: https://stevehoang.com
[lib]: https://github.com/lotusk08/theme-static-assets
[lqip]: https://github.com/transitive-bullshit/lqip-modern
[waline]: https://github.com/walinejs/waline
[waline.html]: https://github.com/lotusk08/lotusk08.github.io/blob/34bf7b0643f7aae4fa812745794a020d9ce5863f/_includes/comments/waline.html
[vercel]: http://vercel.com
[mon]: http://mongodb.com
