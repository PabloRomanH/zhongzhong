/*
        Zhongzhong - A Chinese-English Popup Dictionary
        Copyright (C) 2015 Pablo Roman
        https://chrome.google.com/webstore/detail/dggcgdjndddfmcfoipccicfoajmciacf
*/

chrome.browserAction.onClicked.addListener(zhongwenMain.enableToggle);
chrome.tabs.onActiveChanged.addListener(zhongwenMain.onTabSelect);

chrome.extension.onRequest.addListener(function(request, sender, response) {
    switch(request.type) {
        case 'enable':
            zhongwenMain.enableToggle(sender.tab);
            break;
        case 'enableWithKey':
            if (String.fromCharCode(request.key) == zhongwenMain.config.enableKey)
                zhongwenMain.enableToggle(sender.tab);
            break;
        case 'enable?':
            zhongwenMain.onTabSelect(sender.tab.id);
            break;
        case 'search':
            var e = zhongwenMain.search(request.text, request.dict);
            response(e);
            break;
        case 'open':
            var tabID = zhongwenMain.tabIDs[request.tabType];
            if (tabID) {
                chrome.tabs.get(tabID, function(tab) {
                    if (tab && (tab.url.substr(-13) == 'wordlist.html')) {
                        chrome.tabs.reload(tabID);
                        chrome.tabs.update(tabID, {
                            active: true
                        });
                    } else {
                        chrome.tabs.create({
                            url: request.url
                            }, function(tab) {
                            zhongwenMain.tabIDs[request.tabType] = tab.id;
                            if (request.tabType == 'wordlist') {
                                // make sure the table is sized correctly
                                chrome.tabs.reload(tab.id);
                            }
                        });
                    }
                });
            } else {
                chrome.tabs.create({
                    url: request.url
                    }, function(tab) {
                    zhongwenMain.tabIDs[request.tabType] = tab.id;
                    if (request.tabType == 'wordlist') {
                        // make sure the table is sized correctly
                        chrome.tabs.reload(tab.id);
                    }
                });
            }
            break;
        case 'copy':
            var txt = document.createElement('textarea');
            txt.style.position = "absolute";
            txt.style.left = "-100%";
            txt.value = request.data;
            document.body.appendChild(txt);
            txt.select();
            document.execCommand('copy');
            document.body.removeChild(txt);
            break;
        case 'add':
            var json = localStorage['wordlist'];

            var wordlist;
            if (json) {
                wordlist = JSON.parse(json);
            } else {
                wordlist = []
            }

            for (var i in request.entries) {

                var entry = {}
                entry.simplified = request.entries[i].simplified;
                entry.traditional = request.entries[i].traditional;
                entry.pinyin = request.entries[i].pinyin;
                entry.definition = request.entries[i].definition;

                wordlist.push(entry);
            }
            localStorage['wordlist'] = JSON.stringify(wordlist);

            var tabID = zhongwenMain.tabIDs['wordlist'];
            if (tabID) {
                chrome.tabs.get(tabID, function(tab) {
                    if (tab) {
                        chrome.tabs.reload(tabID);
                    }
                });
            }
            break;
        case 'iframe':
            chrome.tabs.executeScript(sender.tab.id, {
                file: 'content.js',
                allFrames: true
            })
            break;
        case 'toggle':
            if(request.field == 'zhuyin') {
                localStorage.zhuyin = localStorage.zhuyin == 'yes' ? 'no' : 'yes';
                zhongwenMain.config.zhuyin = localStorage.zhuyin;
            }
            else if(request.field == 'pinyin') {
                localStorage.pinyin = localStorage.pinyin == 'yes' ? 'no' : 'yes';
                zhongwenMain.config.pinyin = localStorage.pinyin;
            }
            else if(request.field == 'definitions') {
                localStorage.definitions = localStorage.definitions == 'yes' ? 'no' : 'yes';
                zhongwenMain.config.definitions = localStorage.definitions;
            }
            break;
        case 'speak':
            chrome.tts.speak(request.text, {'lang': zhongwenMain.config.voice, rate: 0.5});
            break;
        default:
    // ignore
    }
});

function initStorage(key, defaultValue) {
    var currentValue = localStorage[key];
    if (!currentValue) {
        localStorage[key] = defaultValue;
    }
}

initStorage("popupcolor", "white");
initStorage("tonecolors", "yes");
initStorage("fontSize", "small");
initStorage("font", "sans");
initStorage("skritterTLD", "com");
initStorage("chars", "both");
initStorage("dicts", "engHan");
initStorage("zhuyin", "no");
initStorage("pinyin", "yes");
initStorage("definitions", "yes");
initStorage("grammar", "yes");
initStorage("voice", "zh-CN");
initStorage("tone1", "#F00");
initStorage("tone2", "#F80");
initStorage("tone3", "#0F0");
initStorage("tone4", "#00F");
initStorage("tone5", "#A0A0A0");
initStorage("shortcuts", "no");
initStorage("shortcutsLookup", "yes");
initStorage("enableKey", "Z");


zhongwenMain.config = {};
zhongwenMain.config.css = localStorage.popupcolor;
zhongwenMain.config.tonecolors = localStorage.tonecolors;
zhongwenMain.config.fontSize = localStorage.fontSize;
zhongwenMain.config.font = localStorage.font;
zhongwenMain.config.skritterTLD = localStorage.skritterTLD;
zhongwenMain.config.chars = localStorage.chars;
zhongwenMain.config.dicts = localStorage.dicts;
zhongwenMain.config.zhuyin = localStorage.zhuyin;
zhongwenMain.config.pinyin = localStorage.pinyin;
zhongwenMain.config.definitions = localStorage.definitions;
zhongwenMain.config.grammar = localStorage.grammar;
zhongwenMain.config.voice = localStorage.voice;
zhongwenMain.config.tones = [localStorage.tone1,
                             localStorage.tone2,
                             localStorage.tone3,
                             localStorage.tone4,
                             localStorage.tone5];
zhongwenMain.config.shortcuts = localStorage.shortcuts;
zhongwenMain.config.shortcutsLookup = localStorage.shortcutsLookup;
zhongwenMain.config.enableKey = localStorage.enableKey;


if (localStorage['enabled'] == 1) {
    zhongwenMain.loadDictionary()
    .then(() => {
      zhongwenMain.enabled = 1;
    });
} else {
    zhongwenMain.enabled = 0;
}
