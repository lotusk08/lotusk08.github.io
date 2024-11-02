<!-- markdownlint-disable-next-line -->
<div align="center">

  <!-- markdownlint-disable-next-line -->
  # My personal blog's source code
  
  [![Gem Version](https://img.shields.io/gem/v/jekyll-theme-chirpy?color=brightgreen)][gem]&nbsp;
  [![CI](https://github.com/lotusk08/lotusk08.github.io/actions/workflows/ci.yml/badge.svg?branch=master&event=push)][ci]&nbsp;
  [![Codacy Badge](https://app.codacy.com/project/badge/Grade/4e556876a3c54d5e8f2d2857c4f43894)][codacy]&nbsp;
  [![GitHub license](https://img.shields.io/github/license/cotes2020/jekyll-theme-chirpy.svg)][license]&nbsp;
  [![npm](https://img.shields.io/npm/v/jekyll-theme-chirpy)][npm]&nbsp;
  [![Cloudflare](https://img.shields.io/badge/Pages-deployed-blue?logo=cloudflare)][cf]&nbsp;
  [![DMCA](https://img.shields.io/badge/DMCA-protected-green)][dmca]

  Using Jekyll with Chirpy theme, host in Github with [submodule][lib], deployed by Cloudflare
  
  [**Live site** → ][stevehoang.com]

  [![stevehoang.com](/docs/stevehoang.com.webp)][stevehoang.com]
 
</div>

## Optimized pagespeed
[![stevehoang.com](/docs/pagespeed.webp)][stevehoang.com]

## Deploy & public by [Cloudflare][cf]
Fix error `Gems in the groups 'development' and 'test' were not installed.` in Cloudflare with config the variables for your Preview/Production environment

Variable name|Value
---|---
BUNDLE_WITHOUT|""

## Comment system by [Waline][waline]
[![stevehoang.com](/docs/comment-system.webp)][stevehoang.com]

Deploy & running on [Vercel][vercel] with [MongoDB][mon]
Sync dark/light theme color config in [waline.html][waline.html]

```javascript

const updateCssForDarkMode = () => {
  const head = document.head;
  const css = head.lastChild;
  const cssContent = css.textContent.replace("__waline__css__", "");
  const cssContentPreferredDark = `@media (prefers-color-scheme: dark){html:not([data-mode])${cssContent}}`;
  const cssContentSelectedDark = `html[data-mode=dark]${cssContent}`;
  css.textContent = cssContentPreferredDark;
  const style = document.createElement('style');
  style.textContent = cssContentSelectedDark;
  head.appendChild(style);
};

updateCssForDarkMode();
```

## Low Quality Image Placeholders by [lqip-modern][lqip] generator
Generation lqip base64 by running script:

```bash
node tools/lqip/index.js
```

[gem]: https://rubygems.org/gems/jekyll-theme-chirpy
[ci]: https://github.com/lotusk08/lotusk08.github.io/actions/workflows/ci.yml?query=event%3Apush+branch%3Amaster
[codacy]: https://app.codacy.com/gh/cotes2020/jekyll-theme-chirpy/dashboard
[license]: https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/LICENSE
[npm]: https://www.npmjs.com/package/jekyll-theme-chirpy
[cf]: https://lotusk08-github-io.pages.dev
[dmca]: https://www.dmca.com/r/84e1gg7
[jekyllrb]: https://jekyllrb.com
[stevehoang.com]: https://stevehoang.com
[lib]: https://github.com/lotusk08/theme-static-assets
[lqip]: https://github.com/transitive-bullshit/lqip-modern
[waline]: https://github.com/walinejs/waline
[waline.html]: https://github.com/lotusk08/lotusk08.github.io/blob/34bf7b0643f7aae4fa812745794a020d9ce5863f/_includes/comments/waline.html
[vercel]: http://vercel.com
[mon]: http://mongodb.com
