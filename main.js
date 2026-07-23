/*
        Zhongzhong - A Chinese-English Popup Dictionary
        Copyright (C) 2015 Pablo Roman
        https://chrome.google.com/webstore/detail/dggcgdjndddfmcfoipccicfoajmciacf

        ---

        Originally based on Zhongwen 4.0.1
        Copyright (C) 2011 Christian Schiller
        https://chrome.google.com/extensions/detail/kkmlkkjojmombglmlpbpapmhcaljjkde

        ---

        Originally based on Rikaikun 0.8
        Copyright (C) 2010 Erek Speed
        http://code.google.com/p/rikaikun/

        ---

        Originally based on Rikaichan 1.07
        by Jonathan Zarate
        http://www.polarcloud.com/

        ---

        Originally based on RikaiXUL 0.4 by Todd Rudick
        http://www.rikai.com/
        http://rikaixul.mozdev.org/

        ---

        This program is free software; you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation; either version 2 of the License, or
        (at your option) any later version.

        This program is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with this program; if not, write to the Free Software
        Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

        ---

        Please do not change or remove any of the copyrights or links to web pages
        when modifying any of the files.

*/
var zhongwenMain = {

    altView: 0,
    enabled: 0,

    tabIDs: {},

    buildMiniHelp: function() {
    return '<span style="font-weight: bold;">Zhongzhong Chinese-English Dictionary&nbsp;&nbsp;&nbsp;</span><br><br>' +
    '<p>' +
    '<span style="font-style: italic;">In order to make Zhongzhong work in input fields and text areas,<br>' +
    ' hold down the Alt-key on your keyboard.</span><br><br>' +
    '<p>' +
    'Keyboard actions:' +
    '<p>' +
    '<table style="margin: 20px;" cellspacing=5 cellpadding=5>' +
    '<tr><td><b>Alt + ' + zhongwenMain.config.enableKey + '&nbsp;:</b></td><td style="font-weight: bold;">&nbsp;Enable/Disable Zhongzhong</td></tr>' +
    '<tr><td><b>&nbsp;</b></td><td>&nbsp;</td></tr>' +
    '<tr><td><b>N&nbsp;:</b></td><td>&nbsp;Next word</td></tr>' +
    '<tr><td><b>B&nbsp;:</b></td><td>&nbsp;Previous character</td></tr>' +
    '<tr><td><b>M&nbsp;:</b></td><td>&nbsp;Next character</td></tr>' +
    '<tr><td><b>&nbsp;</b></td><td>&nbsp;</td></tr>' +
    '<tr><td><b>V&nbsp;:</b></td><td style="font-weight: bold;">&nbsp;Read word aloud</td></tr>' +
    '<tr><td><b>Shift/Enter&nbsp;:</b></td><td style="font-weight: bold;">&nbsp;Switch dictionaries</td></tr>' +
    '<tr><td><b>&nbsp;</b></td><td>&nbsp;</td></tr>' +
    '<tr><td><b>A&nbsp;:</b></td><td>&nbsp;Alternate popup location</td></tr>' +
    '<tr><td><b>Y&nbsp;:</b></td><td>&nbsp;Move popup location down</td></tr>' +
    '<tr><td><b>X&nbsp;:</b></td><td>&nbsp;Move popup location up</td></tr>' +
    '<tr><td><b>&nbsp;</b></td><td>&nbsp;</td></tr>' +
    '<tr><td><b>C&nbsp;:</b></td><td>&nbsp;Copy to clipboard</td></tr>' +
    '<tr><td><b>&nbsp;</b></td><td>&nbsp;</td></tr>' +
    '<tr><td><b>S&nbsp;:</b></td><td>&nbsp;Add word to Skritter queue</td></tr>' +
    '<tr><td><b>&nbsp;</b></td><td>&nbsp;</td></tr>' +
    '<tr><td><b>R&nbsp;:</b></td><td>&nbsp;Save word to the internal word list</td></tr>' +
    '<tr><td><b>Alt + W&nbsp;:</b></td><td>&nbsp;Show the word list</td></tr>' +
    '</table>' +
    '<p>' +
    'Quick settings:' +
    '<p>' +
    '<table style="margin: 20px;" cellspacing=5 cellpadding=5>' +
    '<tr><td><b>D&nbsp;:</b></td><td>&nbsp;Display/hide definitions</td></tr>' +
    '<tr><td><b>P&nbsp;:</b></td><td>&nbsp;Display/hide Pinyin</td></tr>' +
    '<tr><td><b>Z&nbsp;:</b></td><td>&nbsp;Display/hide Zhuyin (Bopomofo)</td></tr>' +
    '</table>' +
    '<p>' +
    'Look up selected text in online resource:' +
    '<p>' +
    '<table style="margin: 20px;" cellspacing=5 cellpadding=5>' +
    '<tr><td><b>Alt + 1&nbsp;:</b></td><td>&nbsp;LINE Dict (formerly nciku)</td></tr>' +
    '<tr><td><b>Alt + 2&nbsp;:</b></td><td>&nbsp;YellowBridge</td></tr>' +
    '<tr><td><b>Alt + 3&nbsp;:</b></td><td>&nbsp;Dict.cn</td></tr>' +
    '<tr><td><b>Alt + 4&nbsp;:</b></td><td>&nbsp;iCIBA</td></tr>' +
    '<tr><td><b>Alt + 5&nbsp;:</b></td><td>&nbsp;MDBG</td></tr>' +
    '<tr><td><b>Alt + 6&nbsp;:</b></td><td>&nbsp;JuKuu (manual search)</td></tr>' +
    '<tr><td><b>Alt + 7&nbsp;:</b></td><td>&nbsp;Moedict</td></tr>' +
    '<tr><td><b>Alt + 8&nbsp;:</b></td><td>&nbsp;Baidu Baike</td></tr>' +
    '<tr><td><b>T&nbsp;:</b></td><td>&nbsp;Tatoeba</td></tr>' +
    '<tr><td><b>K&nbsp;:</b></td><td style="font-weight: bold;">&nbsp;Study character in Koohii.com (NEW)</td></tr>' +
    '</table>';
    },

    loadDictionary: function() {
        if (!this.dict) {
            this.dict = new zhongwenDict();
            return this.dict.donePromise;
        }
        return Promise.resolve();
    },

    // The callback for onSelectionChanged.
    // Just sends a message to the tab to enable itself if it hasn't
    // already.
    onTabSelect: function(tabId) {
        zhongwenMain.ready.then(() => zhongwenMain._onTabSelect(tabId));
    },
    _onTabSelect: function(tabId) {
        if ((this.enabled == 1))
            // Fails harmlessly for tabs with no content script (chrome://
            // pages, the New Tab Page, etc.) - same as the old MV2
            // sendRequest's unchecked runtime.lastError.
            chrome.tabs.sendMessage(tabId, {
                "type":"enable",
                "config":zhongwenMain.config
            }).catch(() => {});
    },

    enable: function(tab) {
        chrome.storage.local.set({enabled: 1});

        if (!this.dict) {
            this.loadDictionary()
            .then(() => {
                this.chromeSetup(tab);
            })
            .catch(err => {
                console.error('Error loading dictionary: ' + err);
            });
        }
    },

    chromeSetup: function(tab) {
        // Send message to current tab to add listeners and create stuff
        chrome.tabs.sendMessage(tab.id, {
            "type": "enable",
            "config": zhongwenMain.config
        }).catch(() => {});
        zhongwenMain.enabled = 1;

        chrome.tabs.sendMessage(tab.id, {
            "type": "showPopup",
            "text": zhongwenMain.buildMiniHelp(),
            "isHelp": true
        }).catch(() => {});

        chrome.action.setBadgeBackgroundColor({
            "color": [255, 0, 0, 255]
        });

        chrome.action.setBadgeText({
            "text": "On"
        });

        chrome.contextMenus.create(
        {
            id: "openWordList",
            title: "Open word list",
            contexts: ['all']
        });
    },

    disable: function(tab) {

        chrome.storage.local.set({enabled: 0});

        // Delete dictionary object after we implement it
        delete this.dict;

        zhongwenMain.enabled = 0;
        chrome.action.setBadgeBackgroundColor({
            "color": [0,0,0,0]
        });
        chrome.action.setBadgeText({
            "text": ""
        });

        // Send a disable message to all browsers.
        var windows = chrome.windows.getAll({
            "populate": true
        },
        function(windows) {
            for (var i =0; i < windows.length; ++i) {
                var tabs = windows[i].tabs;
                for ( var j = 0; j < tabs.length; ++j) {
                    chrome.tabs.sendMessage(tabs[j].id, {
                        "type":"disable"
                    }).catch(() => {});
                }
            }
        });

        chrome.contextMenus.removeAll();
    },

    enableToggle: function(tab) {
        zhongwenMain.ready.then(() => {
            if (zhongwenMain.enabled) {
                zhongwenMain.disable(tab);
            } else {
                zhongwenMain.enable(tab);
            }
        });
    },

    search: function(text, dict) {
        if (dict === 0) {
            var entry = this.dict.wordSearch(text);
            if (entry != null) {
                for (var i = 0; i < entry.data.length; i++) {
                    var word = entry.data[i][1];
                    if (this.dict.hasKeyword(word) && (entry.matchLen == word.length)) {
                        // the final index should be the last one with the maximum length
                        entry.grammar = { keyword: word, index: i };
                    }

                    var e = entry.data[i][0].match(/.*variant of ([^\^|[]+)/);
                    if (!e) {
                        e = entry.data[i][0].match(/\/see also ([^\^|[]+)/);
                    }

                    if (!e) {
                        e = entry.data[i][0].match(/\/see ([^\^|[]+)/);
                    }

                    if (e) {
                        var entry2 = this.dict.singleWordSearch(e[1]);
                        if (entry2) {
                            for (var add = 0; add < entry2.data.length; add++) {
                                var repeated = false;
                                for (var check = 0; check < entry.data.length; check++) {
                                    if (entry.data[check][0] == entry2.data[add][0]) {
                                        repeated = true;
                                        break;
                                    }
                                }
                                if (!repeated) {
                                    entry.data.push(entry2.data[add]);
                                }
                            }
                        }
                    }
                }
            }
            return entry;
        } else if (dict === 1) {
            var entry = this.dict.hanziSearch(text.charAt(0));
            return entry;
        }

    }
};

// The context menu item is created fresh on every enable() (and removed on
// disable()), but the click listener has to be registered once, up front,
// since chrome.contextMenus.create()'s old onclick-callback form isn't
// reliable across service worker restarts.
chrome.contextMenus.onClicked.addListener(function(info) {
    if (info.menuItemId !== 'openWordList') return;

    var url = chrome.runtime.getURL("/wordlist.html");
    var tabID = zhongwenMain.tabIDs['wordlist'];
    if (tabID) {
        chrome.tabs.get(tabID, function(tab) {
            if (tab && (tab.url.substr(-13) == 'wordlist.html')) {
                chrome.tabs.reload(tabID);
                chrome.tabs.update(tabID, {
                    active: true
                });
            } else {
                chrome.tabs.create({
                    url: url
                }, function(tab) {
                    zhongwenMain.tabIDs['wordlist'] = tab.id;
                    chrome.tabs.reload(tab.id);
                });
            }
        });
    } else {
        chrome.tabs.create({
            url: url
        }, function(tab) {
            zhongwenMain.tabIDs['wordlist'] = tab.id;
            chrome.tabs.reload(tab.id);
        });
    }
});

// Config field name -> chrome.storage.local key, mirroring the mapping done
// below when zhongwenMain.config is first built from storage.
var configFieldToStorageKey = {
    css: 'popupcolor',
    tonecolors: 'tonecolors',
    fontSize: 'fontSize',
    font: 'font',
    skritterTLD: 'skritterTLD',
    chars: 'chars',
    dicts: 'dicts',
    zhuyin: 'zhuyin',
    pinyin: 'pinyin',
    definitions: 'definitions',
    grammar: 'grammar',
    voice: 'voice',
    shortcuts: 'shortcuts',
    shortcutsLookup: 'shortcutsLookup',
    enableKey: 'enableKey'
};
var storageKeyToConfigField = {};
for (var configField in configFieldToStorageKey) {
    storageKeyToConfigField[configFieldToStorageKey[configField]] = configField;
}

zhongwenMain.config = {};

// Populates zhongwenMain.config from chrome.storage.local and, if the
// extension was left enabled, reloads the dictionary. The service worker is
// non-persistent and re-runs this top-level code on every wake, so every
// entry point below awaits this promise before touching config/enabled/dict.
zhongwenMain.ready = chrome.storage.local.get(zhongwenDefaults).then(function(stored) {
    zhongwenMain.config.css = stored.popupcolor;
    zhongwenMain.config.tonecolors = stored.tonecolors;
    zhongwenMain.config.fontSize = stored.fontSize;
    zhongwenMain.config.font = stored.font;
    zhongwenMain.config.skritterTLD = stored.skritterTLD;
    zhongwenMain.config.chars = stored.chars;
    zhongwenMain.config.dicts = stored.dicts;
    zhongwenMain.config.zhuyin = stored.zhuyin;
    zhongwenMain.config.pinyin = stored.pinyin;
    zhongwenMain.config.definitions = stored.definitions;
    zhongwenMain.config.grammar = stored.grammar;
    zhongwenMain.config.voice = stored.voice;
    zhongwenMain.config.tones = [stored.tone1,
                                  stored.tone2,
                                  stored.tone3,
                                  stored.tone4,
                                  stored.tone5];
    zhongwenMain.config.shortcuts = stored.shortcuts;
    zhongwenMain.config.shortcutsLookup = stored.shortcutsLookup;
    zhongwenMain.config.enableKey = stored.enableKey;

    if (stored.enabled == 1) {
        return zhongwenMain.loadDictionary().then(function() {
            zhongwenMain.enabled = 1;
        });
    }
});

// Keeps the in-memory config current when options.html writes new values to
// chrome.storage.local (it can no longer reach into this service worker via
// chrome.extension.getBackgroundPage()).
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName !== 'local') return;

    for (var key in changes) {
        var toneMatch = /^tone([1-5])$/.exec(key);
        if (toneMatch && zhongwenMain.config.tones) {
            zhongwenMain.config.tones[Number(toneMatch[1]) - 1] = changes[key].newValue;
        } else if (storageKeyToConfigField[key]) {
            zhongwenMain.config[storageKeyToConfigField[key]] = changes[key].newValue;
        }
    }
});
