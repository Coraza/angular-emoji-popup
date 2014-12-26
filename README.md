#Angular Emoji Popup

###[Demo](http://madhur.co.in/angular-emoji-popup)

##Installation

##Usage

##How it works

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