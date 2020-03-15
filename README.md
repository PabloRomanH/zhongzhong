# Zhongzhong

Fork of the Zhongwen chrome extension that translates Chinese words when hovering on them.

The extension is missing a repository for open collaboration an since the developer didn't answer my messages I decided to fork it.

To install it go to:

<https://chrome.google.com/webstore/detail/zhongzhong-an-improved-ch/dggcgdjndddfmcfoipccicfoajmciacf>

## Build instructions

Prerequisites: Python

To update the dicitonary first clone this repo and change to the data directory

```shell
git clone https://github.com/PabloRomanH/zhongzhong.git
cd zhongzhong/data
```

download a new version of [CC-CEDICT](https://www.mdbg.net/chinese/dictionary?page=cc-cedict)

```shell
wget https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip 
unzip cedict_1_0_ts_utf-8_mdbg.zip
```

Run the script `index.py`

```shell
python index.py
```

Test is by loading unpacked in Chrome.
