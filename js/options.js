/*
        Zhongzhong - A Chinese-English Popup Dictionary
        Copyright (C) 2015 Pablo Roman
        https://chrome.google.com/webstore/detail/dggcgdjndddfmcfoipccicfoajmciacf
*/

function loadVals(stored) {
    for (var i = 0; i < document.optform.popupcolor.length; i++) {
        if(document.optform.popupcolor[i].value == stored.popupcolor) {
            document.optform.popupcolor[i].selected = true;
            break;
        }
    }

    document.optform.tonecolors.checked = stored.tonecolors == 'yes';

    document.optform.tone1.value = stored.tone1;
    document.optform.tone1.style.color = document.optform.tone1.value;
    document.optform.tone2.value = stored.tone2;
    document.optform.tone2.style.color = document.optform.tone2.value;
    document.optform.tone3.value = stored.tone3;
    document.optform.tone3.style.color = document.optform.tone3.value;
    document.optform.tone4.value = stored.tone4;
    document.optform.tone4.style.color = document.optform.tone4.value;
    document.optform.tone5.value = stored.tone5;
    document.optform.tone5.style.color = document.optform.tone5.value;

    if(stored.fontSize == 'small') {
        document.optform.fontSize[1].selected = true;
    }
    else {
        document.optform.fontSize[0].selected = true;
    }

    if(stored.font == 'sans') {
        document.optform.font[0].selected = true;
    }
    else if(stored.font == 'serif') {
        document.optform.font[1].selected = true;
    }
    else { // == 'handdrawn'
        document.optform.font[2].selected = true;
    }

    if(stored.skritterTLD == 'cn') {
        document.optform.skritterTLD[1].selected = true;
    }
    else if(stored.skritterTLD == 'disabled') {
        document.optform.skritterTLD[2].selected = true;
    }
    else {
        document.optform.skritterTLD[0].selected = true;
    }

    if(stored.chars == 'both') {
        document.optform.chars[0].selected = true;
    }
    else if(stored.chars == 'traditional') {
        document.optform.chars[1].selected = true;
    }
    else {
        document.optform.chars[2].selected = true;
    }

    if(stored.dicts == 'engHan') {
        document.optform.dicts[0].selected = true;
    }
    else if(stored.dicts == 'hanEng') {
        document.optform.dicts[1].selected = true;
    }

    document.optform.zhuyin.checked = stored.zhuyin == 'yes';

    document.optform.pinyin.checked = stored.pinyin == 'yes';

    document.optform.definitions.checked = stored.definitions == 'yes';

    document.optform.grammar.checked = stored.grammar == 'yes';

    if(stored.voice == 'zh-CN') {
        document.optform.voice[0].selected = true;
    }
    else { // == 'taiwan'
        document.optform.voice[1].selected = true;
    }

    document.optform.shortcuts.checked = stored.shortcuts == 'yes';
    document.optform.shortcutsLookup.checked = stored.shortcutsLookup == 'yes';

    document.optform.enableKey.value = stored.enableKey;
}

function storeVals() {
    chrome.storage.local.set({
        popupcolor: document.optform.popupcolor.value,
        tonecolors: document.optform.tonecolors.checked ? 'yes' : 'no',
        tone1: document.optform.tone1.value,
        tone2: document.optform.tone2.value,
        tone3: document.optform.tone3.value,
        tone4: document.optform.tone4.value,
        tone5: document.optform.tone5.value,
        fontSize: document.optform.fontSize.value,
        font: document.optform.font.value,
        skritterTLD: document.optform.skritterTLD.value,
        chars: document.optform.chars.value,
        dicts: document.optform.dicts.value,
        zhuyin: document.optform.zhuyin.checked ? 'yes' : 'no',
        pinyin: document.optform.pinyin.checked ? 'yes' : 'no',
        definitions: document.optform.definitions.checked ? 'yes' : 'no',
        grammar: document.optform.grammar.checked ? 'yes' : 'no',
        voice: document.optform.voice.value,
        shortcuts: document.optform.shortcuts.checked ? 'yes' : 'no',
        shortcutsLookup: document.optform.shortcutsLookup.checked ? 'yes' : 'no',
        enableKey: document.optform.enableKey.value.toUpperCase()
    });
}

$(function() {
    $('select').change(storeVals);
    $('input').change(storeVals);
    $('input').blur(storeVals);
    $('.tone-color').change(setTextColorToValue);
    $('.tone-color').blur(setTextColorToValue);

    $('#resettonecolors').click(function(event) {
      document.optform.tone1.value = zhongwenDefaults.tone1;
      document.optform.tone1.style.color = document.optform.tone1.value;
      document.optform.tone2.value = zhongwenDefaults.tone2;
      document.optform.tone2.style.color = document.optform.tone2.value;
      document.optform.tone3.value = zhongwenDefaults.tone3;
      document.optform.tone3.style.color = document.optform.tone3.value;
      document.optform.tone4.value = zhongwenDefaults.tone4;
      document.optform.tone4.style.color = document.optform.tone4.value;
      document.optform.tone5.value = zhongwenDefaults.tone5;
      document.optform.tone5.style.color = document.optform.tone5.value;
      storeVals();
    });
});

function setTextColorToValue(event) {
  event.target.style.color = event.target.value;
}

window.onload = function() {
    chrome.storage.local.get(zhongwenDefaults).then(loadVals);
};
