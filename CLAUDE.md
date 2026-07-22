# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Zhongzhong is a Chrome extension (Manifest V2) that shows a Chinese-English popup
dictionary when hovering over Chinese text on any web page. It's a fork of the Zhongwen extension
(itself descended from Rikaichan/Rikaikun/RikaiXUL). There is no build system, package manager, or
test suite — this is plain, unbundled JavaScript loaded directly by the Chrome extension APIs.

## Commands

- **Load/run the extension**: open `chrome://extensions`, enable Developer Mode, "Load unpacked",
  select this directory. Reload the extension after any JS change; reload the target tab too since
  `content.js` is injected per-page.
- **Package a release**: `./release.sh` — zips the repo (excluding dotfiles) to `../zhongzhong.zip`.
  Bump the `version` in `manifest.json` first.
- **Rebuild the dictionary data** (only needed when updating CC-CEDICT):
  ```shell
  cd data
  wget https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip
  unzip cedict_1_0_ts_utf-8_mdbg.zip
  python index.py
  ```
  `index.py` reads `cedict_ts.u8` and regenerates `cedict.idx`, the sorted binary-search index
  keyed by simplified/traditional headword mapping to byte offsets in the dictionary file.
- There are no linters, formatters, or automated tests configured in this repo.

## Architecture

Manifest V2 extension with three JS execution contexts, wired together in `manifest.json`:

- **Background page** (`dict.js`, `main.js`, `background.js`, loaded in that order, persistent):
  - `dict.js` defines `zhongwenDict`, which loads the raw dictionary files (`data/cedict_ts.u8`,
    `data/cedict.idx`, `data/hanzi.dat`, `data/grammarKeywordsMin.json`) via XHR and implements
    lookups: `wordSearch`/`singleWordSearch` (binary search over the index into the CEDICT text
    blob), `hanziSearch`/`findHanzi` (per-character data: pinyin, stroke count, radical, HSK level,
    etc. from `hanzi.dat`), and `translate` (greedy longest-match segmentation of a text run).
  - `main.js` defines the `zhongwenMain` singleton: extension enable/disable state, per-tab
    tracking (`tabIDs`), user config (read from `localStorage`, mirrored into
    `zhongwenMain.config`), the `search()` entry point content scripts call into, and the
    context-menu/badge/help-popup setup done on enable.
  - `background.js` is the message router: it listens on `chrome.extension.onRequest` and dispatches
    on `request.type` (`enable`, `search`, `open`, `add` (save word to word list), `toggle`
    (quick-setting flip), `speak` (TTS), `copy`, `iframe`, etc.), and seeds default config values into
    `localStorage` via `initStorage()` on load.
- **Content script** (`content.js`, injected into every frame of every page): the `zhongwenContent`
  object. Tracks mouse position, resolves the DOM text node/offset under the cursor
  (`getTextFromRange`/`getInlineText`), sends `search` messages to the background page, and renders
  the popup (`showPopup`, `makeHtmlEnglishDict`, `makeHtmlHanzi`, pinyin/zhuyin tone-coloring via
  `pinyinAndZhuyin`/`tonify`). Keyboard shortcuts for navigating matches, switching dictionaries,
  copying, saving to the word list, and opening external lookups (MDBG, YellowBridge, Koohii, etc.)
  are handled in `onKeyDown`.
- **Extension pages** (`options.html` + `js/options.js`, `wordlist.html` + `js/wordlist.js`): plain
  jQuery pages that read/write the same `localStorage` config keys and talk to the background page
  via `chrome.extension.getBackgroundPage()` or messages. The word list page uses `jqGrid`
  (`js/jquery.jqGrid.min.js`) to display/export/delete saved words (also stored in `localStorage`
  under the `wordlist` key).

Cross-context communication is entirely `chrome.extension.sendRequest`/`onRequest` (the old
callback-style messaging API, not the promise-based `runtime.sendMessage`) plus shared
`localStorage` state — there's no shared module system, so the same config keys are duplicated by
convention across `background.js`, `js/options.js`, and `content.js`.

CSS for the popup is theme-based: `css/popup-{white,black,blue,lightblue,yellow}.css`, selected by
the `popupcolor` config value and injected by the content script.

## Notes

- Keep copyright headers/links in modified files — the license header in `main.js`/`dict.js`
  explicitly asks that they not be changed or removed (GPL v2, see `GPL_2.0.txt`).
- `data/index.py` is Python 2 style (`str.decode('utf-8')`); run it with `python2` if `python`
  resolves to Python 3 on your system.
