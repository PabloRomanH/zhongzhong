/*
        Zhongzhong - A Chinese-English Popup Dictionary
        Copyright (C) 2015 Pablo Roman
        https://chrome.google.com/webstore/detail/dggcgdjndddfmcfoipccicfoajmciacf
*/

var wlstring = localStorage['wordlist'];

var entries;
if (wlstring) {
    entries = JSON.parse(wlstring);
} else {
    entries = [];
}

$(function() {

    $('#words').jqGrid({
        data: entries,
        datatype: 'local',
        colNames: ['Simplified', 'Traditional', 'Pinyin', 'Definition'],
        colModel: [
            {
                name: 'simplified',
                index: 'simplified'
            },

            {
                name: 'traditional',
                index: 'traditional'
            },

            {
                name: 'pinyin',
                index: 'pinyin'
            },

            {
                name: 'definition',
                index: 'definition',
                cellattr: function (rowId, tv, rawObject, cm, rdata) {
                    return 'style="white-space: normal;'
                }
            },
        ],
        multiselect: true,
        rowNum: 1000,
        rowList:[10,20,30],
        viewrecords: true,
        gridview: true,
        caption: 'Zhongzhong: My Words',
        autowidth: true,
        height: '100%',
        emptyrecords: "No words",
        loadui: 'disable',
        onSelectRow: function(id) {
            var selected = jQuery("#words").getGridParam('selarrrow');

            if (selected.length > 0) {
                jQuery("#savebutton").removeAttr("disabled");
            } else {
                jQuery("#savebutton").attr("disabled", true);
            }
        },
    });

$('#savebutton').click(function(e) {
    var selected = jQuery("#words").getGridParam('selarrrow');

    selected.sort();

    var content = '';
    for (var i in selected) {
        var entry = entries[selected[i] - 1];
        content += entry.simplified;
        content += '\t';
        content += entry.traditional;
        content += '\t';
        content += entry.pinyin;
        content += '\t';
        content += entry.definition;
        content += '\r\n';
    }

    var saveBlob = new Blob([content], { "type" : "text/plain" });
    var a = document.getElementById('savelink');
    a.href = window.webkitURL.createObjectURL(saveBlob);
    a.click();
});

$('#delete').click(function(e) {
    var selected = jQuery("#words").getGridParam('selarrrow');

    selected.sort();

    var set = {};
    for (var i in selected) {
        set[selected[i] - 1] = 1;
    }

    var toKeep = [];
    for (var j = 0; j < entries.length; j++) {
        if (!set[j]) {
            toKeep.push(entries[j]);
        }
    }

    localStorage['wordlist'] = JSON.stringify(toKeep);

    location.reload(true);
});

$('#help').click(function(e) {
    $('#helpmsg').toggle('bounce', function() {
        if ($('#help').text() == 'Show help') {
            $('#help').text('Hide help');
        } else {
            $('#help').text('Show help');
        }
    }
    );

});

if (entries.length > 0) {
    $('#nodata').hide();
    $('#save').show();
    $('#delete').show();
    $('#help').show();
} else {
    $('#nodata').show();
    $('#save').hide();
    $('#delete').hide();
    $('#help').hide();
}

});
