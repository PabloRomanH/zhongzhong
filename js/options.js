/*
        Zhongzhong - A Chinese-English Popup Dictionary
        Copyright (C) 2015 Pablo Roman
        https://chrome.google.com/webstore/detail/dggcgdjndddfmcfoipccicfoajmciacf
*/

function loadVals() {
    var storedValue = localStorage['popupcolor'];
    for (var i = 0; i < document.optform.popupcolor.length; i++) {
        if(document.optform.popupcolor[i].value == storedValue) {
            document.optform.popupcolor[i].selected = true;
            break;
        }
    }

    document.optform.tonecolors.checked = localStorage['tonecolors'] == 'yes';

    storedValue = localStorage['fontSize'];
    if(storedValue == 'small') {
        document.optform.fontSize[1].selected = true;
    }
    else {
        document.optform.fontSize[0].selected = true;
    }

    storedValue = localStorage['font'];
    if(storedValue == 'sans') {
        document.optform.font[0].selected = true;
    }
    else if(storedValue == 'serif') {
        document.optform.font[1].selected = true;
    }
    else { // == 'handdrawn'
        document.optform.font[2].selected = true;
    }

    storedValue = localStorage['skritterTLD'];
    if(storedValue == 'cn') {
        document.optform.skritterTLD[1].selected = true;
    }
    else {
        document.optform.skritterTLD[0].selected = true;
    }

    storedValue = localStorage['chars'];
    if(storedValue == 'both') {
        document.optform.chars[0].selected = true;
    }
    else if(storedValue == 'traditional') {
        document.optform.chars[1].selected = true;
    }
    else {
        document.optform.chars[2].selected = true;
    }

    document.optform.zhuyin.checked = localStorage['zhuyin'] == 'yes';

    document.optform.pinyin.checked = localStorage['pinyin'] == 'yes';

    document.optform.definitions.checked = localStorage['definitions'] == 'yes';

    document.optform.grammar.checked = localStorage['grammar'] == 'yes';
}

function storeVals() {
    localStorage['popupcolor'] = document.optform.popupcolor.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.css = localStorage['popupcolor'];

    localStorage['tonecolors'] = document.optform.tonecolors.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.tonecolors = localStorage['tonecolors'];

    localStorage['fontSize'] = document.optform.fontSize.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.fontSize = localStorage['fontSize'];

    localStorage['font'] = document.optform.font.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.font = localStorage['font'];

    localStorage['skritterTLD'] = document.optform.skritterTLD.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.skritterTLD = localStorage['skritterTLD'];

    localStorage['chars'] = document.optform.chars.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.chars = localStorage['chars'];

    localStorage['zhuyin'] = document.optform.zhuyin.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.zhuyin = localStorage['zhuyin'];

    localStorage['pinyin'] = document.optform.pinyin.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.pinyin = localStorage['pinyin'];

    localStorage['definitions'] = document.optform.definitions.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.definitions = localStorage['definitions'];

    localStorage['grammar'] = document.optform.grammar.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.grammar = localStorage['grammar'];
}

$(function() {
    $('select').change(storeVals);
    $('input').change(storeVals);
});

window.onload = loadVals;
