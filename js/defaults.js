/*
        Zhongzhong - A Chinese-English Popup Dictionary
        Copyright (C) 2015 Pablo Roman
        https://chrome.google.com/webstore/detail/dggcgdjndddfmcfoipccicfoajmciacf
*/

// Default config values, shared between the background service worker and
// options.html. Passed straight into chrome.storage.local.get() so any keys
// not yet stored come back with these defaults already filled in.
var zhongwenDefaults = {
    popupcolor: "white",
    tonecolors: "yes",
    fontSize: "small",
    font: "sans",
    skritterTLD: "com",
    chars: "both",
    dicts: "engHan",
    zhuyin: "no",
    pinyin: "yes",
    definitions: "yes",
    grammar: "yes",
    voice: "zh-CN",
    tone1: "#F00",
    tone2: "#F80",
    tone3: "#0F0",
    tone4: "#00F",
    tone5: "#A0A0A0",
    shortcuts: "no",
    shortcutsLookup: "yes",
    enableKey: "Z",
    enabled: 0
};
