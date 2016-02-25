# nwjs-open-link-in-browser

[![NPM version][npm-image]][npm-url] [![Travis-CI Status][travis-image]][travis-url] [![Appveyor Status][appveyor-image]][appveyor-url] [![Daviddm Status][daviddm-image]][daviddm-url]

> Open a link in browser for NW.js and browser.

#### NW.js app to browser

![NW.js to browser](https://cloud.githubusercontent.com/assets/75448/8766185/d31b7a8c-2e68-11e5-9e25-9ef01bfb3606.gif)

####browser to browser

![browser to browser](https://cloud.githubusercontent.com/assets/75448/8766204/4174fdc8-2e69-11e5-969b-6c46a0f87c45.gif)


## Install

```
$ npm install --save nwjs-open-link-in-browser
```


## Usage

```html
<script type="text/javascript" src="build/nwjs-open-link-in-browser.js"></script>
<a
  href="https://github.com/lyrictenor/nwjs-emoji-app"
  onClick="nwjsOpenLinkInBrowser();"
  >
  github.com/lyrictenor/nwjs-emoji-app
</a>

<button
  type="button"
  onclick="nwjsOpenLinkInBrowser('http://example.com');"
  >
  Example.com
</button>
```

### React.js + JSX + Browserify/Webpack

```html
var nwjsOpenLinkInBrowser = require("nwjs-open-link-in-browser");

<a
  href="https://github.com/lyrictenor/nwjs-emoji-app"
  onClick={nwjsOpenLinkInBrowser.bind(this)}
  >
  github.com/lyrictenor/nwjs-emoji-app
</a>

<button
  type="button"
  onClick={nwjsOpenLinkInBrowser.bind(this, "http://example.com")}
  >
  Example.com
</button>
```


## API

### nwjsOpenLinkInBrowser([url,] event)

Jump to the href property.

#### url

*Optional*

Type: `string`

Jump to url.


## Changelog

[changelog.md](./changelog.md).


## License

MIT © [sanemat](http://sane.jp)


[travis-url]: https://travis-ci.org/lyrictenor/nwjs-open-link-in-browser
[travis-image]: https://img.shields.io/travis/lyrictenor/nwjs-open-link-in-browser/master.svg?style=flat-square&label=travis
[appveyor-url]: https://ci.appveyor.com/project/sanemat/nwjs-open-link-in-browser/branch/master
[appveyor-image]: https://img.shields.io/appveyor/ci/sanemat/nwjs-open-link-in-browser/master.svg?style=flat-square&label=appveyor
[npm-url]: https://npmjs.org/package/nwjs-open-link-in-browser
[npm-image]: https://img.shields.io/npm/v/nwjs-open-link-in-browser.svg?style=flat-square
[daviddm-url]: https://david-dm.org/lyrictenor/nwjs-open-link-in-browser
[daviddm-image]: https://img.shields.io/david/lyrictenor/nwjs-open-link-in-browser.svg?style=flat-square
