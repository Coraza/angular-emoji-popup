/*! Angular Emoji 1.0.0 2014-12-27 */

'use strict';

var emojiApp = angular.module("emojiApp", ['ngSanitize']);

emojiApp.config(['$sceProvider', function($sceProvider)
{

  $sceProvider.enabled(false);

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

    $.emojiarea.spritesheetPath = 'img/emojisprite_!.png';
    $.emojiarea.spritesheetDimens = Config.EmojiCategorySpritesheetDimens;
    $.emojiarea.iconSize = 20;
    $.emojiarea.icons = icons;
    $.emojiarea.reverseIcons = reverseIcons;

}]);

emojiApp.directive('contenteditable', [ '$sce', function($sce) {
  return {
    restrict : 'A', // only activate on element attribute
    require : '?ngModel', // get a hold of NgModelController
    link : function(scope, element, attrs, ngModel) {
      if (!ngModel)
        return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html(ngModel.$viewValue || '');
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function() {
        scope.$evalAsync(read);
      });
      read(); // initialize

      // Write data to the model
      function read() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br>
        // behind
        // If strip-br attribute is provided then we strip this out
        if (attrs.stripBr && html == '<br>') {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  };
} ]);

