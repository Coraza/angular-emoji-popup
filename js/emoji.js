(function()
{

    function emoji()
        {}
        // settings
    emoji.inits = {};
    emoji.map = {};

    emoji.replace_unified = function(str)
    {
        emoji.init_unified();
        return str.replace(emoji.rx_unified, function(m)
        {
            // var val = emoji.map.unified[m];
            var val = Config.reversemap[m];
            //console.log(val);

            if (val)
            {
                val = ":" + val + ":";

                var $img = $.emojiarea.createIcon($.emojiarea.icons[val]);
                return $img;
            }
            else
                return "";
            // return val ? emoji.replacement(val) : m;
        });
    };

    emoji.init_emoticons = function()
    {
        if (emoji.inits.emoticons)
            return;
        emoji.init_colons(); // we require this for the emoticons map
        emoji.inits.emoticons = 1;

        var a = [];
        emoji.map.emoticons = {};
        for (var i in emoji.emoticons_data)
        {
            // because we never see some characters in our text except as
            // entities, we must do some replacing
            var emoticon = i.replace(/\&/g, '&amp;').replace(/\</g, '&lt;')
                .replace(/\>/g, '&gt;');

            if (!emoji.map.colons[emoji.emoticons_data[i]])
                continue;

            emoji.map.emoticons[emoticon] = emoji.map.colons[emoji.emoticons_data[i]];
            a.push(emoji.escape_rx(emoticon));
        }
        emoji.rx_emoticons = new RegExp(
            ('(^|\\s)(' + a.join('|') + ')(?=$|[\\s|\\?\\.,!])'), 'g');
    };
    emoji.init_colons = function()
    {
        if (emoji.inits.colons)
            return;
        emoji.inits.colons = 1;
        emoji.rx_colons = new RegExp('\:[^\\s:]+\:', 'g');
        emoji.map.colons = {};
        for (var i in emoji.data)
        {
            for (var j = 0; j < emoji.data[i][3].length; j++)
            {
                emoji.map.colons[emoji.data[i][3][j]] = i;
            }
        }
    };
    emoji.init_unified = function()
    {
        if (emoji.inits.unified)
            return;
        emoji.inits.unified = 1;

        var a = [];
        emoji.map.unified = {};

        for (var i in emoji.data)
        {
            for (var j = 0; j < emoji.data[i][0].length; j++)
            {
                a.push(emoji.data[i][0][j]);
                emoji.map.unified[emoji.data[i][0][j]] = i;
            }
        }

        emoji.rx_unified = new RegExp('(' + a.join('|') + ')', "g");
    };
    emoji.escape_rx = function(text)
    {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

}).call(function()
{
    return this || (typeof window !== 'undefined' ? window : global);
}());
