'use strict';

var emojiApp = angular.module("emojiApp", []);

emojiApp.config(function(ConfigProvider)
{

    var Config = ConfigProvider.$get();
    
    var icons = {},
        reverseIcons = {},
        i, j, hex, name, dataItem, row, column, totalColumns;

    for (j = 0; j < Config.EmojiCategories.length; j++)
    {
        totalColumns = Config.EmojiCategorySpritesheetDimens[j][1];
        for (i = 0; i < Config.EmojiCategories[j].length; i++)
        {
            dataItem = Config.Emoji[Config.EmojiCategories[j][i]];
            name = dataItem[1][0];
            row = Math.floor(i / totalColumns);
            column = (i % totalColumns);
            icons[':' + name + ':'] = [j, row, column,
                ':' + name + ':'
            ];
            reverseIcons[name] = dataItem[0];
        }
    }

    $.emojiarea.spritesheetPath = '/img/emojisprite_!.png';
    $.emojiarea.spritesheetDimens = Config.EmojiCategorySpritesheetDimens;
    $.emojiarea.iconSize = 20;
    $.emojiarea.icons = icons;
    $.emojiarea.reverseIcons = reverseIcons;

});

    
function checkDragEvent(e) {
  if (!e || e.target && (e.target.tagName == 'IMG' || e.target.tagName == 'A')) return false;
  if (e.dataTransfer && e.dataTransfer.types) {
    for (var i = 0; i < e.dataTransfer.types.length; i++) {
      if (e.dataTransfer.types[i] == 'Files') {
        return true;
      }
    }
  } else {
    return true;
  }

  return false;
}

function cancelEvent (event) {
  event = event || window.event;
  if (event) {
    event = event.originalEvent || event;

    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
  }

  return false;
}

