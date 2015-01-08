#Angular Emoji

An angular module to serve multiple purpose:

* A directive to render a comprehensive emoji popup from which user can select an emoji.
* Filters to encode the message containing emoji to various formats and decode them.

###[Demo](http://coraza.github.io/angular-emoji-popup/)

###Note about encoding and decoding
There are various standards to encode and decode emojis. Most popular are:

* **Colon:** The emojis are converted to their colon style strings. This is simple to save in the database since its just a string.
See the mapping at [http://www.emoji-cheat-sheet.com/](http://www.emoji-cheat-sheet.com/)

* **UTF-8 Characters:** Emojis are mapped to their Unicode characters.  The advatage of this method is that some platforms (such as Android, iOS) can render them automatically as emoji unlike colon style encoding which almost always require decoding. On the disadvantage, Saving them in databases require special handling. See [note below](#db)

A comprehensive list of unicode codes can be obtained from [http://apps.timwhitlock.info/emoji/tables/unicode](http://apps.timwhitlock.info/emoji/tables/unicode)

* **HTML:** Emojis are converted to HTML `<img>` tags rendering each emoji as an image either from the single image or a sprite. 
This is the least useful method to adopt as its not cross platform. There is no standardization of Emoji sprite images and hence you will never be sure that target platform has the same emoji images.

This module contain various filters to encode and decode emojis in the above formats.

##Installation

Only dependencies are `Jquery`, `AngularJs` and `angular-Sanitize` module.

```html
<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.7/angular.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.7/angular-sanitize.min.js"></script>

<script type="text/javascript" src="js/config.js"></script>
<script type="text/javascript" src="js/emoji.min.js"></script>
<link type="text/stylesheet" rel="stylesheet" href="css/emoji.min.css" />
```

Inject the `emojiApp` module to your app

```js
angular.module("myApp", ['ngSanitize', 'emojiApp']);
```

##Usage

The module consists of following components:

* `emojiForm` - Enclose this directive with a `textarea` and a `button` named `emojibtn`.
This directive adds a `contenteditable` `div` and hides the `textarea`. Anything typed into this `contebteditable` `div` is synced with the `textarea`. It also hooks up the button to show an Emoji popup. 

```html
<div emoji-form emoji-message="emojiMessage">
    <textarea id="messageInput" ng-model="emojiMessage.messagetext"></textarea>

    <button id="emojibtn">
        <i class="icon icon-emoji"></i>
    </button>
</div>
```

Make sure to initialize `emojiMessage` inside your controller

```js
emojiApp.controller('emojiController', ['$scope', function($scope) {

	$scope.emojiMessage={};
}]);
```
###Encoding
By default, emoji are encoded to colon style string. Hence `emojiMessage.messagetext` will contain the encoded emoji with colons.

`emojiMessage.rawhtml` will contain the raw html string of the message.

For additional encodings, the following filters can be used

* `colonToCode` : Converts the colon style emoji string to string contaning UTF-8 characters

```html
<div ng-bind="emojiMessage.messagetext | colonToCode"> </div>
```

###Decoding
For decoding the message string containing either colon style emojis or UTF-8 character emojis, following filters can be used:

* `codeToSmiley` : Converts the string containing UTF-8 characters to smiley representation using HTML

```html
<div ng-bind-html="emojiMessage.encodedtext | codeToSmiley"></div>
```

* `colonToSmiley` : Converts the string containing colon characters to smiley representation using HTML

```html
<div ng-bind-html="emojiMessage.encodedtext | colonToSmiley"></div>
```

##How it works

Much of the functionality of this module is driven by the map contained in `config.js` file. It contains a mapping of Emoji UTF-8 character and its colon representation. If you encounter any bugs in this mapping, please raise an issue or send a pull request.

<a name="db"></a>
## Using MySQL for storage

The following text is taken verbatim from [https://github.com/iamcal/js-emoji](https://github.com/iamcal/js-emoji)

> Some special care may be needed to store emoji in your database. While some characters (e.g. Cloud, U+2601) are
> within the Basic Multilingual Plane (BMP), others (e.g. Close Umbrella, U+1F302) are not. As such, 
> they require 4 bytes of storage to encode each character. Inside MySQL, this requires switching from `utf8` 
> storage to `utf8mb4`.

> You can modify a database and table using a statement like:

>  `ALTER DATABASE my_database DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`
>  `ALTER TABLE my_table CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`

> You will also need to modify your connection character set.

> You don't need to worry about this if you translate to colon syntax before storage.

##Credits
This project utilizes snippets and ideas from following open source projects:

* [emoji-cheat-sheet](https://github.com/arvida/emoji-cheat-sheet.com)
* [jquery-emojiarea](https://github.com/diy/jquery-emojiarea)
* [nanoScrollerJS](https://github.com/jamesflorentino/nanoScrollerJS)
* [js-emoji](https://github.com/iamcal/js-emoji)
