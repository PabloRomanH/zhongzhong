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

    document.optform.tone1.value = localStorage['tone1'] || "#F00";
    document.optform.tone1.style.color = document.optform.tone1.value;
    document.optform.tone2.value = localStorage['tone2'] || "#F80";
    document.optform.tone2.style.color = document.optform.tone2.value;
    document.optform.tone3.value = localStorage['tone3'] || "#0F0";
    document.optform.tone3.style.color = document.optform.tone3.value;
    document.optform.tone4.value = localStorage['tone4'] || "#00F";
    document.optform.tone4.style.color = document.optform.tone4.value;
    document.optform.tone5.value = localStorage['tone5'] || "#A0A0A0";
    document.optform.tone5.style.color = document.optform.tone5.value;

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
    else if(storedValue == 'disabled') {
        document.optform.skritterTLD[2].selected = true;
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

    storedValue = localStorage['dicts'];
    if(storedValue == 'engHan') {
        document.optform.dicts[0].selected = true;
    }
    else if(storedValue == 'hanEng') {
        document.optform.dicts[1].selected = true;
    }

    document.optform.zhuyin.checked = localStorage['zhuyin'] == 'yes';

    document.optform.pinyin.checked = localStorage['pinyin'] == 'yes';

    document.optform.definitions.checked = localStorage['definitions'] == 'yes';

    document.optform.grammar.checked = localStorage['grammar'] == 'yes';

    storedValue = localStorage['voice'];
    if(storedValue == 'zh-CN') {
        document.optform.voice[0].selected = true;
    }
    else { // == 'taiwan'
        document.optform.voice[1].selected = true;
    }

    document.optform.shortcuts.checked = localStorage['shortcuts'] == 'yes';
    document.optform.shortcutsLookup.checked = localStorage['shortcutsLookup'] == 'yes';

    document.optform.enableKey.value = localStorage['enableKey'] || 'Z';
    console.log(document.optform.enableKey.value, localStorage['enableKey'] || 'Z')
}

function storeVals() {
    localStorage['popupcolor'] = document.optform.popupcolor.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.css = localStorage['popupcolor'];

    localStorage['tonecolors'] = document.optform.tonecolors.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.tonecolors = localStorage['tonecolors'];

    localStorage['tone1'] = document.optform.tone1.value;
    localStorage['tone2'] = document.optform.tone2.value;
    localStorage['tone3'] = document.optform.tone3.value;
    localStorage['tone4'] = document.optform.tone4.value;
    localStorage['tone5'] = document.optform.tone5.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.tones = [localStorage['tone1'],
                                                                      localStorage['tone2'],
                                                                      localStorage['tone3'],
                                                                      localStorage['tone4'],
                                                                      localStorage['tone5']];

    localStorage['fontSize'] = document.optform.fontSize.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.fontSize = localStorage['fontSize'];

    localStorage['font'] = document.optform.font.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.font = localStorage['font'];

    localStorage['skritterTLD'] = document.optform.skritterTLD.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.skritterTLD = localStorage['skritterTLD'];

    localStorage['chars'] = document.optform.chars.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.chars = localStorage['chars'];

    localStorage['dicts'] = document.optform.dicts.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.dicts = localStorage['dicts'];

    localStorage['zhuyin'] = document.optform.zhuyin.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.zhuyin = localStorage['zhuyin'];

    localStorage['pinyin'] = document.optform.pinyin.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.pinyin = localStorage['pinyin'];

    localStorage['definitions'] = document.optform.definitions.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.definitions = localStorage['definitions'];

    localStorage['grammar'] = document.optform.grammar.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.grammar = localStorage['grammar'];

    localStorage['voice'] = document.optform.voice.value;
    chrome.extension.getBackgroundPage().zhongwenMain.config.voice = localStorage['voice'];

    localStorage['shortcuts'] = document.optform.shortcuts.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.shortcuts = localStorage['shortcuts'];

    localStorage['shortcutsLookup'] = document.optform.shortcutsLookup.checked ? 'yes' : 'no';
    chrome.extension.getBackgroundPage().zhongwenMain.config.shortcutsLookup = localStorage['shortcutsLookup'];

    localStorage['enableKey'] = document.optform.enableKey.value.toUpperCase();
    console.log(document.optform.enableKey.value.toUpperCase());
    chrome.extension.getBackgroundPage().zhongwenMain.config.enableKey = localStorage['enableKey'];
}

$(function() {
    $('select').change(storeVals);
    $('input').change(storeVals);
    $('input').blur(storeVals);
    $('.tone-color').change(setTextColorToValue);
    $('.tone-color').blur(setTextColorToValue);

    $('#resettonecolors').click(function(event) {
      localStorage['tone1'] = document.optform.tone1.value = '#F00';
      document.optform.tone1.style.color = document.optform.tone1.value;
      localStorage['tone2'] = document.optform.tone2.value = '#F80';
      document.optform.tone2.style.color = document.optform.tone2.value;
      localStorage['tone3'] = document.optform.tone3.value = '#0F0';
      document.optform.tone3.style.color = document.optform.tone3.value;
      localStorage['tone4'] = document.optform.tone4.value = '#00F';
      document.optform.tone4.style.color = document.optform.tone4.value;
      localStorage['tone5'] = document.optform.tone5.value = '#A0A0A0';
      document.optform.tone5.style.color = document.optform.tone5.value;
    });
});

function setTextColorToValue(event) {
  event.target.style.color = event.target.value;
}


window.onload = loadVals;
