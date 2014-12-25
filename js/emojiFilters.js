'use strict';
emojiApp.filter('colonToSmiley', function() {

	return function(input) {

		if(!input)
			return "";

		if(!Config.rx_unified)
			Config.init_unified();

		 return input.replace(Config.rx_unified, function(m)
        {
            var val = Config.mapcolon[m];
            if (val)
            {
                return val;
            }
            else
                return "";
        });

	};
});


emojiApp.filter('unicodeToSmiley', function() {

	return function(input) {

		 return str.replace(emoji.rx_unified, function(m)
        {
            var val = Config.reversemap[m];
            if (val)
            {
                val = ":" + val + ":";
                var $img = $.emojiarea.createIcon($.emojiarea.icons[val]);
                return $img;
            }
            else
                return "";
        });

	};
});