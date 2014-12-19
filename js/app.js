'use strict';

var emojiApp  = angular.module("emojiApp", []);

emojiApp.config(['ConfigProvider',function(ConfigProvider) {

	var icons = {}, reverseIcons = {}, i, j, hex, name, dataItem, row, column, totalColumns;

			for (j = 0; j < Config.EmojiCategories.length; j++) {
				totalColumns = Config.EmojiCategorySpritesheetDimens[j][1];
				for (i = 0; i < Config.EmojiCategories[j].length; i++) {
					dataItem = Config.Emoji[Config.EmojiCategories[j][i]];
					name = dataItem[1][0];
					row = Math.floor(i / totalColumns);
					column = (i % totalColumns);
					icons[':' + name + ':'] = [ j, row, column,
							':' + name + ':' ];
					reverseIcons[name] = dataItem[0];
				}
			}

			$.emojiarea.spritesheetPath = '/img/emojisprite_!.png';
			$.emojiarea.spritesheetDimens = Config.EmojiCategorySpritesheetDimens;
			$.emojiarea.iconSize = 20;
			$.emojiarea.icons = icons;
			$.emojiarea.reverseIcons = reverseIcons;
	
}]);