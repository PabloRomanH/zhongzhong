/*
        Zhongzhong - A Chinese-English Popup Dictionary
        Copyright (C) 2015 Pablo Roman
        https://chrome.google.com/webstore/detail/dggcgdjndddfmcfoipccicfoajmciacf
*/

importScripts('js/defaults.js', 'dict.js', 'main.js');

chrome.action.onClicked.addListener(zhongwenMain.enableToggle);
chrome.tabs.onActivated.addListener(function(activeInfo) {
    zhongwenMain.onTabSelect(activeInfo.tabId);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    handleMessage(request, sender, sendResponse);
    // Keep the message channel open: handleMessage awaits
    // zhongwenMain.ready and chrome.storage before it can respond.
    return true;
});

async function handleMessage(request, sender, sendResponse) {
    await zhongwenMain.ready;

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
            sendResponse(e);
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
        case 'add':
            var stored = await chrome.storage.local.get({wordlist: []});
            var wordlist = stored.wordlist;

            for (var i in request.entries) {

                var entry = {}
                entry.simplified = request.entries[i].simplified;
                entry.traditional = request.entries[i].traditional;
                entry.pinyin = request.entries[i].pinyin;
                entry.definition = request.entries[i].definition;

                wordlist.push(entry);
            }
            await chrome.storage.local.set({wordlist: wordlist});

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
            chrome.scripting.executeScript({
                target: {
                    tabId: sender.tab.id,
                    allFrames: true
                },
                files: ['content.js']
            });
            break;
        case 'toggle':
            if(request.field == 'zhuyin') {
                zhongwenMain.config.zhuyin = zhongwenMain.config.zhuyin == 'yes' ? 'no' : 'yes';
                await chrome.storage.local.set({zhuyin: zhongwenMain.config.zhuyin});
            }
            else if(request.field == 'pinyin') {
                zhongwenMain.config.pinyin = zhongwenMain.config.pinyin == 'yes' ? 'no' : 'yes';
                await chrome.storage.local.set({pinyin: zhongwenMain.config.pinyin});
            }
            else if(request.field == 'definitions') {
                zhongwenMain.config.definitions = zhongwenMain.config.definitions == 'yes' ? 'no' : 'yes';
                await chrome.storage.local.set({definitions: zhongwenMain.config.definitions});
            }
            break;
        case 'speak':
            chrome.tts.speak(request.text, {'lang': zhongwenMain.config.voice, rate: 0.5});
            break;
        default:
    // ignore
    }
}
